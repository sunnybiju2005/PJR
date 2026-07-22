import { db, collection, onSnapshot, query, orderBy } from '../firebaseConfig.js';
import { store } from '../state.js';

/**
 * PJR Centralized Firestore Service
 * Implements Repository Pattern for real-time dynamic data synchronization.
 */
class FirestoreService {
  constructor() {
    this.unsubscribers = [];
  }

  // Starts real-time listeners for all necessary collections
  initializeRealtimeSync() {
    this.syncCollection('settings', (data) => {
      // Assuming a single document for global settings
      if (data.length > 0) store.settings = data[0];
      store.notify();
    });

    this.syncCollection('banners', (data) => {
      // Filter out disabled banners
      store.banners = data.filter(b => b.enabled !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
      store.notify();
    }, 'order');

    this.syncCollection('categories', (data) => {
      store.categories = data;
      store.notify();
    });

    this.syncCollection('subcategories', (data) => {
      store.subcategories = data;
      store.notify();
    });

    this.syncCollection('brands', (data) => {
      store.brands = data;
      store.notify();
    });

    this.syncCollection('offers', (data) => {
      store.offers = data.filter(o => o.visibility !== false);
      store.notify();
    });

    this.syncCollection('products', (data) => {
      // Filter out products marked as draft, hidden, or inactive by the admin
      const hiddenStatuses = ['hidden', 'inactive', 'draft'];
      store.products = data.filter(p => !hiddenStatuses.includes((p.status || '').toLowerCase()));
      store.notify();
    });
  }

  // Generic method to subscribe to a collection
  syncCollection(collectionName, callback, sortField = null) {
    let q = collection(db, collectionName);
    if (sortField) {
      q = query(q, orderBy(sortField));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    }, (error) => {
      console.error(`[FirestoreService] Error syncing ${collectionName}:`, error);
    });

    this.unsubscribers.push(unsubscribe);
  }

  // Stop all listeners (useful if admin logs out, but for public site usually kept alive)
  stopSync() {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
  }
}

export const firestoreService = new FirestoreService();
