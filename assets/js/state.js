import { firestoreService } from './services/firestoreService.js';
import { homepageContentService } from './services/homepageContentService.js';
import { HomepageContentModel } from './models/HomepageContentModel.js';

class StateStore {
  constructor() {
    this.listeners = new Set();
    this.route = typeof window !== 'undefined' ? (window.location.hash || '#home') : '#home';

    // Dynamic Firebase Collections & Homepage Model
    this.homepageContent = new HomepageContentModel();
    this.isHomepageContentLoading = true;
    this.settings = {};
    this.banners = [];
    this.categories = [];
    this.subcategories = [];
    this.brands = [];
    this.offers = [];
    this.products = [];
    this.editorials = []; // Trending/Visual Editorial section items
    this.homeimages = {};

    // Restore last-known Firebase hero data from cache so first render is instant
    const _heroCache = (typeof localStorage !== 'undefined' && localStorage.getItem('pjr_hero_cache'))
      ? (() => { try { return JSON.parse(localStorage.getItem('pjr_hero_cache')); } catch { return null; } })()
      : null;
    this.heroData = _heroCache || null;
    this.heroImageUrl = _heroCache
      ? (_heroCache.url || _heroCache.imageUrl || _heroCache.image || _heroCache.heroImage
          || (Array.isArray(_heroCache.imageUrls) && _heroCache.imageUrls[0])
          || '')
      : '';
    this.isHeroLoading = true;

    this.cart = (typeof localStorage !== 'undefined' && localStorage.getItem('pjr_cart')) ? JSON.parse(localStorage.getItem('pjr_cart')) : [];

    this.wishlist = (typeof localStorage !== 'undefined' && localStorage.getItem('pjr_wishlist')) ? JSON.parse(localStorage.getItem('pjr_wishlist')) : [];

    this.addresses = (typeof localStorage !== 'undefined' && localStorage.getItem('pjr_addresses')) ? JSON.parse(localStorage.getItem('pjr_addresses')) : [];

    this.selectedAddressId = this.addresses.find(a => a.isDefault)?.id || this.addresses[0]?.id;

    this.user = (typeof localStorage !== 'undefined' && localStorage.getItem('pjr_user')) ? JSON.parse(localStorage.getItem('pjr_user')) : {
      name: '',
      email: '',
      isLoggedIn: false
    };

    this.filters = {
      subcategory: 'all',
      gender: 'all',
      brand: 'all',
      color: 'all',
      size: 'all',
      rating: 0,
      availability: 'all',
      search: '',
      priceMin: 0,
      priceMax: 30000,
      sortBy: 'newest',
      viewMode: 'grid' // 'grid' or 'list'
    };

    this.activeModal = null; // 'quickView', 'cart', 'checkout', 'account', 'search', 'mapPicker', 'editAddress'
    this.selectedProduct = null;
    this.addressToEdit = null;

    this.activeOrder = null;

    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => {
        this.route = window.location.hash || '#home';
        window.scrollTo(0, 0);
        this.notify();
      });
    }

    // Start Realtime Sync
    if (typeof window !== 'undefined') {
      firestoreService.initializeRealtimeSync();
      homepageContentService.initializeListeners();
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.saveLocalStorage();
    this.listeners.forEach(fn => fn(this));
  }

  saveLocalStorage() {
    localStorage.setItem('pjr_cart', JSON.stringify(this.cart));
    localStorage.setItem('pjr_wishlist', JSON.stringify(this.wishlist));
    localStorage.setItem('pjr_addresses', JSON.stringify(this.addresses));
    localStorage.setItem('pjr_user', JSON.stringify(this.user));
    // Persist latest Firebase hero data so refresh renders it instantly
    if (this.heroData) {
      localStorage.setItem('pjr_hero_cache', JSON.stringify(this.heroData));
    }
  }

  /* Address Management Operations */
  addAddress(addressData) {
    const newAddress = {
      id: 'addr-' + Date.now(),
      icon: this.getIconForLabel(addressData.label),
      ...addressData,
      isDefault: this.addresses.length === 0 || addressData.isDefault
    };

    if (newAddress.isDefault) {
      this.addresses.forEach(a => a.isDefault = false);
    }

    this.addresses.push(newAddress);
    this.selectedAddressId = newAddress.id;
    this.notify();
  }

  updateAddress(id, updatedData) {
    const index = this.addresses.findIndex(a => a.id === id);
    if (index > -1) {
      if (updatedData.isDefault) {
        this.addresses.forEach(a => a.isDefault = false);
      }
      this.addresses[index] = {
        ...this.addresses[index],
        ...updatedData,
        icon: this.getIconForLabel(updatedData.label || this.addresses[index].label)
      };
      this.notify();
    }
  }

  deleteAddress(id) {
    this.addresses = this.addresses.filter(a => a.id !== id);
    if (this.selectedAddressId === id) {
      this.selectedAddressId = this.addresses[0]?.id || null;
    }
    this.notify();
  }

  setDefaultAddress(id) {
    this.addresses.forEach(a => a.isDefault = (a.id === id));
    this.selectedAddressId = id;
    this.notify();
  }

  getIconForLabel(label) {
    switch ((label || '').toLowerCase()) {
      case 'home': return '🏠';
      case 'work': return '🏢';
      case 'office': return '💼';
      case 'parents': return '👨‍👩‍👧';
      default: return '📍';
    }
  }

  /* Cart & Wishlist */
  addToCart(product, size = 'M', color = 'Deep Navy', qty = 1) {
    const existingIndex = this.cart.findIndex(
      item => item.id === product.id && item.size === size && item.color === color
    );
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += qty;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        size,
        color: typeof color === 'string' ? color : (color.name || 'Default'),
        quantity: qty,
        image: (product.imageUrls || product.images || [])[0] || ''
      });
    }
    this.notify();
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.notify();
  }

  updateCartQty(index, qty) {
    if (qty <= 0) this.removeFromCart(index);
    else { this.cart[index].quantity = qty; this.notify(); }
  }

  getCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 250;
    const total = subtotal + gst + shipping;
    return { subtotal, gst, shipping, total, itemCount: this.cart.reduce((c, i) => c + i.quantity, 0) };
  }

  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) this.wishlist.splice(idx, 1);
    else this.wishlist.push(productId);
    this.notify();
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  /* Filter Operations */
  setFilter(key, value) {
    this.filters[key] = value;
    this.notify();
  }

  resetFilters() {
    this.filters = {
      subcategory: 'all',
      gender: 'all',
      brand: 'all',
      color: 'all',
      size: 'all',
      rating: 0,
      availability: 'all',
      search: '',
      priceMin: 0,
      priceMax: 30000,
      sortBy: 'newest',
      viewMode: 'grid'
    };
    this.notify();
  }

  getFilteredProducts() {
    return this.products.filter(p => {
      // 1. Gender filter (case-insensitive & alias handling)
      if (this.filters.gender !== 'all') {
        const pGender = (p.gender || p.targetGender || p.categoryGroup || '').toString().toLowerCase();
        const fGender = this.filters.gender.toLowerCase();
        const isMenMatch = (fGender === 'men' && (pGender === 'men' || pGender === 'man' || pGender === 'male'));
        const isWomenMatch = (fGender === 'women' && (pGender === 'women' || pGender === 'woman' || pGender === 'female'));
        const isAccessoryMatch = (fGender === 'accessories' && (pGender === 'accessories' || pGender === 'accessory'));
        if (!isMenMatch && !isWomenMatch && !isAccessoryMatch && pGender !== fGender) {
          return false;
        }
      }

      // 2. Subcategory / Category filter (case-insensitive & alias handling)
      if (this.filters.subcategory !== 'all') {
        const pSub = (p.category || p.subcategory || p.subCategory || p.categoryId || '').toString().toLowerCase();
        const fSub = this.filters.subcategory.toLowerCase();
        if (pSub !== fSub && !pSub.includes(fSub)) {
          return false;
        }
      }

      // 3. Brand filter (case-insensitive)
      if (this.filters.brand !== 'all') {
        const pBrand = (p.brand || p.brandName || '').toString().toLowerCase();
        const fBrand = this.filters.brand.toLowerCase();
        if (pBrand !== fBrand) {
          return false;
        }
      }

      // 4. Price filter
      const price = Number(p.price || 0);
      if (price < this.filters.priceMin || price > this.filters.priceMax) {
        return false;
      }

      // 5. Rating filter
      const rating = Number(p.rating || 5);
      if (this.filters.rating > 0 && rating < this.filters.rating) {
        return false;
      }

      // 6. Search query filter
      if (this.filters.search.trim()) {
        const query = this.filters.search.toLowerCase();
        const title = (p.title || p.name || p.productName || '').toString().toLowerCase();
        const brand = (p.brand || p.brandName || '').toString().toLowerCase();
        const desc = (p.description || '').toString().toLowerCase();
        if (!title.includes(query) && !brand.includes(query) && !desc.includes(query)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = Number(a.price || 0);
      const priceB = Number(b.price || 0);
      if (this.filters.sortBy === 'price-low') return priceA - priceB;
      if (this.filters.sortBy === 'price-high') return priceB - priceA;
      const ratingA = Number(a.rating || 5);
      const ratingB = Number(b.rating || 5);
      if (this.filters.sortBy === 'rating') return ratingB - ratingA;
      return 0;
    });
  }

  openModal(modalName, data = null) {
    this.activeModal = modalName;
    if (modalName === 'quickView') this.selectedProduct = data;
    if (modalName === 'editAddress') this.addressToEdit = data;
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.selectedProduct = null;
    this.addressToEdit = null;
    this.notify();
  }

  login(name, email) {
    this.user = { name, email, isLoggedIn: true };
    this.notify();
  }

  logout() {
    this.user = { name: '', email: '', isLoggedIn: false };
    localStorage.removeItem('pjr_user');
    this.closeModal();
  }
}

export const store = new StateStore();
