import { db, collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc } from '../firebaseConfig.js';
import { store } from '../state.js';

/**
 * PJR Centralized Firestore Service
 * Implements Repository Pattern for real-time dynamic data synchronization & Admin CRUD.
 */
class FirestoreService {
  constructor() {
    this.unsubscribers = [];
  }

  // Starts real-time listeners for all necessary collections
  initializeRealtimeSync() {
    // 1. Direct listener for homeimages/heroimage document
    try {
      const heroDocRef = doc(db, 'homeimages', 'heroimage');
      const unsubHero = onSnapshot(heroDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          store.heroData = { id: snap.id, ...data };
          // Support both single-field URLs and imageUrls array format
          store.heroImageUrl = data.url || data.imageUrl || data.image || data.heroImage
            || (Array.isArray(data.imageUrls) && data.imageUrls[0])
            || '';
          // Persist to cache so refresh renders Firebase data instantly
          try { localStorage.setItem('pjr_hero_cache', JSON.stringify(store.heroData)); } catch {}
        } else {
          store.heroData = null;
        }
        store.isHeroLoading = false;
        store.notify();
      }, (error) => {
        console.warn('[FirestoreService] Warning syncing homeimages/heroimage doc:', error);
        store.isHeroLoading = false;
        store.notify();
      });
      this.unsubscribers.push(unsubHero);
    } catch (e) {
      console.warn('[FirestoreService] heroDocRef setup failed:', e);
    }

    // 2. Collection listener for homeimages
    this.syncCollection('homeimages', (data) => {
      if (data && data.length > 0) {
        const heroDoc = data.find(d => d.id === 'heroimage' || d.id === 'hero') || data[0];
        // Support both single-field URLs and imageUrls array format
        const url = heroDoc.url || heroDoc.imageUrl || heroDoc.image || heroDoc.heroImage
          || (Array.isArray(heroDoc.imageUrls) && heroDoc.imageUrls[0])
          || '';
        if (url) {
          store.heroImageUrl = url;
        }
        store.homeimages = heroDoc;
        if (!store.heroData) {
          store.heroData = heroDoc;
          try { localStorage.setItem('pjr_hero_cache', JSON.stringify(heroDoc)); } catch {}
        }
      }
      store.isHeroLoading = false;
      store.notify();
    });

    this.syncCollection('settings', (data) => {
      if (data.length > 0) store.settings = data[0];
      store.notify();
    });

    this.syncCollection('banners', (data) => {
      // Filter out disabled banners
      store.banners = data.filter(b => b.enabled !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
      store.notify();
    }, 'order');

    this.syncCollection('categories', (data) => {
      const categoryFallbacks = {
        men:         'assets/images/hero-men.png',
        women:       'assets/images/hero-women.png',
        accessories: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      };
      store.categories = data.map(cat => {
        let catId = (cat.id || cat.name || '').toString().toLowerCase().trim();
        if (catId === 'acessories' || catId.includes('access')) catId = 'accessories';
        
        let catName = cat.name || cat.title || 'Accessories';
        if (catName.toLowerCase() === 'acessories') catName = 'Luxury Accessories';
        else if (catName.toLowerCase().includes('acessories')) {
          catName = catName.replace(/acessories/gi, 'Accessories');
        }

        const rawImg = cat.imageUrl || cat.image ||
          (Array.isArray(cat.imageUrls) && cat.imageUrls.length > 0 ? cat.imageUrls[0] : '') || '';
        const finalImg = rawImg.trim() !== '' ? rawImg.trim() :
          (categoryFallbacks[catId] || categoryFallbacks['men']);
        return { ...cat, id: catId, name: catName, imageUrl: finalImg, image: finalImg };
      });
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

    this.syncCollection('editorials', (data) => {
      store.editorials = data
        .filter(e => e.enabled !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      store.notify();
    }, 'order');

    const handleProductsData = (data) => {
      console.log('[Firebase] All products fetched from Firebase:', data);

      const hiddenStatuses = ['hidden', 'inactive', 'draft'];

      const getGender = (p) => {
        const cat = (p.category || p.categoryGroup || p.gender || '').toString().toLowerCase();
        if (cat.includes('men') && !cat.includes('women') && !cat.includes("women's")) return 'men';
        if (cat.includes('women') || cat.includes("women's")) return 'women';
        if (cat.includes('access')) return 'accessories';
        const g = (p.gender || '').toString().toLowerCase();
        if (g === 'male' || g === 'man' || g === 'men') return 'men';
        if (g === 'female' || g === 'woman' || g === 'women') return 'women';
        if (g === 'accessories') return 'accessories';
        return 'men';
      };

      const parsed = data
        .filter(p => {
          if (p.isActive === false) return false;
          const status = (p.status || p.productStatus || 'active').toString().toLowerCase();
          return !hiddenStatuses.includes(status);
        })
        .map(p => {
          const imgs = p.imageUrls || p.images || p.imageUrl || p.image || [];
          const normalizedImages = Array.isArray(imgs) ? imgs.filter(u => u && typeof u === 'string' && u.trim() !== '') : (imgs ? [imgs] : []);
          const finalImages = normalizedImages.length > 0 ? normalizedImages : ['assets/images/hero-men.png'];

          // Color variant parsing helpers
          const COLOR_HEX_MAP = {
            black: '#000000', white: '#FFFFFF', red: '#E53E3E', blue: '#3182CE', navy: '#001B2A',
            'navy blue': '#001B2A', green: '#38A169', 'dark green': '#1A4D2E', yellow: '#D69E2E',
            gold: '#D4AF37', silver: '#C0C0C0', grey: '#718096', gray: '#718096', pink: '#ED64A6',
            purple: '#805AD5', violet: '#7C3AED', orange: '#DD6B20', brown: '#8B4513', beige: '#F5F5DC',
            tan: '#D2B48C', maroon: '#800000', teal: '#008080', cyan: '#00FFFF', turquoise: '#40E0D0',
            olive: '#808000', charcoal: '#36454F', cream: '#FFFDD0', ivory: '#FFFFF0', khaki: '#C3B091',
            coral: '#FF7F50', magenta: '#FF00FF', peach: '#FFDAB9', mint: '#98FF98', wine: '#722F37',
            burgundy: '#800020', mustard: '#FFDB58', 'sky blue': '#87CEEB', 'light blue': '#ADD8E6', 'rose gold': '#B76E79'
          };

          const resolveColorHex = (val, nameFallback = '') => {
            const str = String(val || nameFallback).trim().toLowerCase();
            if (str.startsWith('#') || str.startsWith('rgb') || str.startsWith('hsl')) return str;
            if (COLOR_HEX_MAP[str]) return COLOR_HEX_MAP[str];
            for (const [k, v] of Object.entries(COLOR_HEX_MAP)) {
              if (str.includes(k)) return v;
            }
            return str.length > 0 ? str : '#001B2A';
          };

          const parseColorItem = (item) => {
            if (!item) return null;
            if (typeof item === 'object') {
              const name = item.name || item.colorName || item.label || item.title || item.color || item.value || 'Variant';
              const rawHex = item.hex || item.colorCode || item.code || item.value || item.colorHex || item.bg || item.backgroundColor || '';
              return { name: String(name), hex: resolveColorHex(rawHex, name) };
            }
            if (typeof item === 'string') {
              const trimmed = item.trim();
              return { name: trimmed, hex: resolveColorHex(trimmed) };
            }
            return null;
          };

          let rawColors = p.colors || p.color || p.colorVariants || p.variants || p.availableColors || [];
          if (typeof rawColors === 'string') {
            rawColors = rawColors.split(',').map(s => s.trim()).filter(Boolean);
          }
          let colors = [];
          if (Array.isArray(rawColors)) {
            colors = rawColors.map(parseColorItem).filter(Boolean);
          }
          if (colors.length === 0) {
            colors = [{ name: 'Default', hex: '#001B2A' }];
          }

          const title = p.title || p.name || p.productName || 'Luxury Fashion Item';
          const brand = p.brand || p.brandName || 'PJR Exclusive';
          const rawPrice = Number(p.price || p.regularPrice || p.sellingPrice || 0);
          const rawOriginal = Number(p.discountPrice || p.originalPrice || p.mrp || 0);
          const finalPrice = rawPrice;
          const finalOriginal = rawOriginal > rawPrice ? rawOriginal : null;
          const finalDiscount = finalOriginal ? Math.round((1 - finalPrice / finalOriginal) * 100) : 0;

          // Extract label & tags/badges saved by Admin App
          const rawLabel = (p.label || p.productLabel || p.tag || p.badge || '').toString().toLowerCase().trim();
          const rawLabelsArray = Array.isArray(p.labels) ? p.labels.map(l => String(l).toLowerCase().trim())
                               : (Array.isArray(p.tags) ? p.tags.map(t => String(t).toLowerCase().trim())
                               : (Array.isArray(p.badges) ? p.badges.map(b => String(b).toLowerCase().trim()) : []));

          // Match trending flags/labels
          const isTrending = Boolean(
            p.isTrending === true ||
            p.trending === true ||
            p.isTrendingCollection === true ||
            p.trendingCollection === true ||
            rawLabel === 'trending' ||
            rawLabel === 'trend' ||
            rawLabelsArray.includes('trending') ||
            rawLabelsArray.includes('trend')
          );

          // Match best-seller flags/labels
          const isBestSeller = Boolean(
            p.isBestSeller === true ||
            p.isBestseller === true ||
            p.bestSeller === true ||
            p.bestseller === true ||
            rawLabel === 'best-seller' ||
            rawLabel === 'bestseller' ||
            rawLabel === 'best_seller' ||
            rawLabel === 'best seller' ||
            rawLabelsArray.includes('best-seller') ||
            rawLabelsArray.includes('bestseller') ||
            rawLabelsArray.includes('best seller') ||
            rawLabelsArray.includes('best_seller')
          );

          const label = p.label || p.productLabel || p.badge || p.tag || (isTrending ? 'trending' : (isBestSeller ? 'best-seller' : ''));

          return {
            id: p.id,
            title,
            brand,
            gender: getGender(p),
            category: (p.category || p.subcategory || p.subCategory || '').toString().toLowerCase(),
            price: finalPrice,
            originalPrice: finalOriginal,
            discount: finalDiscount,
            rating: Number(p.rating || 4.8),
            reviewsCount: Number(p.reviewsCount || p.reviewCount || 12),
            isNew: p.isNew !== undefined ? p.isNew : true,
            label,
            isBestSeller,
            bestSellerOrder: Number(
              p.bestSellerOrder !== undefined ? p.bestSellerOrder :
              (p.bestSellerPosition !== undefined ? p.bestSellerPosition :
              (p.bestSellerRank !== undefined ? p.bestSellerRank :
              (p.position !== undefined ? p.position :
              (p.order !== undefined ? p.order : 99))))
            ),
            isTrending,
            images: finalImages,
            imageUrls: finalImages,
            sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL'],
            colors,
            stock: Number(p.stock !== undefined ? p.stock : (p.quantity !== undefined ? p.quantity : 10)),
            description: p.description || p.desc || 'World-class luxury fashion with PJR perfect fit.',
            specifications: p.specifications || { Fit: 'Perfect Fit', Care: 'Dry Clean' }
          };
        });

      // Console logs required by task
      console.log('[Firebase] Product labels received:', parsed.map(p => ({
        id: p.id,
        title: p.title,
        label: p.label,
        isTrending: p.isTrending,
        isBestSeller: p.isBestSeller
      })));

      const trendingList = parsed.filter(p => p.isTrending);
      const bestSellerList = parsed.filter(p => p.isBestSeller);

      console.log('[Firebase] Products filtered for Trending:', trendingList);
      console.log('[Firebase] Products filtered for Best Seller:', bestSellerList);

      // Update store products
      store.products = parsed;
      store.notify();
    };

    this.syncCollection('products', handleProductsData);
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

  /* =====================================================
     ADMIN PANEL FIRESTORE MUTATION METHODS
     ===================================================== */

  /** Saves or updates a document in a collection */
  async saveDocument(collectionName, docId, data) {
    try {
      const targetDoc = doc(db, collectionName, docId);
      await setDoc(targetDoc, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error(`[FirestoreService] Error saving to ${collectionName}/${docId}:`, err);
      throw err;
    }
  }

  /** Deletes a document from a collection */
  async deleteDocument(collectionName, docId) {
    try {
      const targetDoc = doc(db, collectionName, docId);
      await deleteDoc(targetDoc);
      return true;
    } catch (err) {
      console.error(`[FirestoreService] Error deleting from ${collectionName}/${docId}:`, err);
      throw err;
    }
  }

  /** Deletes a product and cleans up references across store */
  async deleteProductAndCleanup(productId) {
    await this.deleteDocument('products', productId);
    store.products = store.products.filter(p => p.id !== productId);
    store.wishlist = store.wishlist.filter(id => id !== productId);
    store.cart = store.cart.filter(item => item.id !== productId);
    store.notify();
  }

  stopSync() {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
  }
}

export const firestoreService = new FirestoreService();
