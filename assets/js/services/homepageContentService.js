import { db, collection, doc, onSnapshot } from '../firebaseConfig.js';
import { HomepageContentModel } from '../models/HomepageContentModel.js';
import { store } from '../state.js';

/**
 * Reusable HomepageContentService
 * Responsible for reading homepage content from Firestore collection `homeimages`
 * (heroimage, menwear, womenwear, accessories) with real-time listeners and error handling.
 */
class HomepageContentService {
  constructor() {
    this.unsubscribers = [];
    this.cache = {};
  }

  /**
   * Initializes real-time Firestore listeners for `homeimages` collection documents
   */
  initializeListeners() {
    try {
      const rawData = {
        heroimage: null,
        menwear: null,
        womenwear: null,
        accessories: null
      };

      const updateState = () => {
        store.homepageContent = new HomepageContentModel(rawData);

        // Sync hero URL and data from the freshly built model
        const heroUrl = store.homepageContent.getHeroImageUrl();
        if (heroUrl) {
          store.heroImageUrl = heroUrl;
        }

        // If rawData.heroimage has fresh Firebase content, sync it into store.heroData
        // and persist to cache so the next page refresh is flash-free
        if (rawData.heroimage) {
          store.heroData = rawData.heroimage;
          try { localStorage.setItem('pjr_hero_cache', JSON.stringify(rawData.heroimage)); } catch {}
        }

        store.isHomepageContentLoading = false;
        store.isHeroLoading = false;
        store.notify();
      };


      // 1. Listen to `homeimages` collection snapshots
      const homeImagesColRef = collection(db, 'homeimages');
      const unsubCol = onSnapshot(homeImagesColRef, (snapshot) => {
        snapshot.docs.forEach(docSnap => {
          const docId = docSnap.id.toLowerCase().trim();
          if (rawData.hasOwnProperty(docId)) {
            rawData[docId] = { id: docSnap.id, ...docSnap.data() };
            this.cache[docId] = rawData[docId];
          }
        });
        updateState();
      }, (error) => {
        console.error('[HomepageContentService] Collection sync error:', error);
        store.isHomepageContentLoading = false;
        store.isHeroLoading = false;
        store.notify();
      });
      this.unsubscribers.push(unsubCol);

      // 2. Direct document listeners for specific documents (heroimage, menwear, womenwear, accessories)
      const docNames = ['heroimage', 'menwear', 'womenwear', 'accessories'];
      docNames.forEach(docName => {
        try {
          const docRef = doc(db, 'homeimages', docName);
          const unsubDoc = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              rawData[docName] = { id: docSnap.id, ...docSnap.data() };
              this.cache[docName] = rawData[docName];
            }
            updateState();
          }, (error) => {
            console.error(`[HomepageContentService] Document error on homeimages/${docName}:`, error);
          });
          this.unsubscribers.push(unsubDoc);
        } catch (err) {
          console.warn(`[HomepageContentService] Listener setup warning for ${docName}:`, err);
        }
      });

    } catch (err) {
      console.error('[HomepageContentService] Unexpected initialization error:', err);
      store.isHomepageContentLoading = false;
      store.isHeroLoading = false;
      store.notify();
    }
  }

  stopSync() {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
  }
}

export const homepageContentService = new HomepageContentService();
