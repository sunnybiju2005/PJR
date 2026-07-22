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
        const catId = (cat.id || cat.name || '').toString().toLowerCase();
        const rawImg = cat.imageUrl || cat.image ||
          (Array.isArray(cat.imageUrls) && cat.imageUrls.length > 0 ? cat.imageUrls[0] : '') || '';
        const finalImg = rawImg.trim() !== '' ? rawImg.trim() :
          (categoryFallbacks[catId] || categoryFallbacks['men']);
        return { ...cat, imageUrl: finalImg, image: finalImg };
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

          let colors = p.colors || [];
          if (Array.isArray(colors) && colors.length > 0 && typeof colors[0] === 'string') {
            colors = colors.map(c => ({ name: c, hex: '#001B2A' }));
          }
          if (!Array.isArray(colors) || colors.length === 0) {
            colors = [{ name: 'Default', hex: '#001B2A' }];
          }

          const title = p.title || p.name || p.productName || 'Luxury Fashion Item';
          const brand = p.brand || p.brandName || 'PJR Exclusive';
          const rawPrice = Number(p.price || p.regularPrice || p.sellingPrice || 0);
          const rawOriginal = Number(p.discountPrice || p.originalPrice || p.mrp || 0);
          const finalPrice = rawPrice;
          const finalOriginal = rawOriginal > rawPrice ? rawOriginal : null;
          const finalDiscount = finalOriginal ? Math.round((1 - finalPrice / finalOriginal) * 100) : 0;

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
            isBestSeller: p.isBestSeller !== undefined ? Boolean(p.isBestSeller) : Boolean(p.featured),
            bestSellerOrder: Number(p.bestSellerOrder || p.bestSellerPosition || 99),
            isTrending: p.isTrending !== undefined ? Boolean(p.isTrending) : false,
            images: finalImages,
            imageUrls: finalImages,
            sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL'],
            colors,
            stock: Number(p.stock !== undefined ? p.stock : (p.quantity !== undefined ? p.quantity : 10)),
            description: p.description || p.desc || 'World-class luxury fashion with PJR perfect fit.',
            specifications: p.specifications || { Fit: 'Perfect Fit', Care: 'Dry Clean' }
          };
        });

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
