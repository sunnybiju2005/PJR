/* PJR Central Reactive State Store & Multi-Address Store */
import { PRODUCTS } from './mockData.js';

class StateStore {
  constructor() {
    this.listeners = new Set();
    this.route = typeof window !== 'undefined' ? (window.location.hash || '#home') : '#home';

    this.cart = (typeof localStorage !== 'undefined' && localStorage.getItem('pjr_cart')) ? JSON.parse(localStorage.getItem('pjr_cart')) : [
      { id: 'pjr-001', title: 'Minimalist Monogram Navy Blazer', price: 8999, size: 'M', color: 'Deep Navy', quantity: 1, image: 'assets/images/hero-men.png' }
    ];

    this.wishlist = (typeof localStorage !== 'undefined' && localStorage.getItem('pjr_wishlist')) ? JSON.parse(localStorage.getItem('pjr_wishlist')) : ['pjr-002'];

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

    this.activeOrder = {
      orderId: 'PJR-94821',
      date: '2026-07-21',
      status: 'shipped', // placed, confirmed, packed, shipped, delivered
      items: [{ title: 'Minimalist Monogram Navy Blazer', price: 8999, qty: 1 }],
      total: 10618,
      addressId: 'addr-001'
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => {
        this.route = window.location.hash || '#home';
        window.scrollTo(0, 0);
        this.notify();
      });
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
        image: product.images[0]
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
    return PRODUCTS.filter(p => {
      if (this.filters.gender !== 'all' && p.gender !== this.filters.gender) return false;
      if (this.filters.subcategory !== 'all' && p.category !== this.filters.subcategory) return false;
      if (this.filters.brand !== 'all' && p.brand.toLowerCase() !== this.filters.brand.toLowerCase()) return false;
      if (p.price < this.filters.priceMin || p.price > this.filters.priceMax) return false;
      if (this.filters.rating > 0 && p.rating < this.filters.rating) return false;
      if (this.filters.search.trim()) {
        const query = this.filters.search.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        if (!matchTitle && !matchBrand) return false;
      }
      return true;
    }).sort((a, b) => {
      if (this.filters.sortBy === 'price-low') return a.price - b.price;
      if (this.filters.sortBy === 'price-high') return b.price - a.price;
      if (this.filters.sortBy === 'rating') return b.rating - a.rating;
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
