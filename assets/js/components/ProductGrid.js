/* PJR New Arrivals & Best Sellers Product Grid Components */
import { store } from '../state.js';


export function renderProductCard(product) {
  const isWishlist = store.isInWishlist(product.id);

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-img-wrapper">
        <img src="${product.images[0]}" alt="${product.title}" loading="lazy" />
        
        <button class="wishlist-btn ${isWishlist ? 'active' : ''}" data-wishlist-id="${product.id}" title="Toggle Wishlist">
          <svg width="18" height="18" fill="${isWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>

        ${product.discount ? `<span class="badge badge-discount" style="position:absolute; top:1rem; left:1rem; z-index:5;">-${product.discount}% OFF</span>` : ''}

        <div class="product-quick-actions">
          <button class="btn btn-teal quick-view-btn" data-qv-id="${product.id}" style="flex:1; padding:0.6rem 1rem; font-size:0.85rem;">
            Quick View
          </button>
          <button class="btn btn-primary add-cart-btn" data-cart-id="${product.id}" style="padding:0.6rem 1rem; font-size:0.85rem;">
            Add
          </button>
        </div>
      </div>

      <div class="product-details">
        <span class="product-brand">${product.brand}</span>
        <a href="javascript:void(0)" class="product-title quick-view-btn" data-qv-id="${product.id}">${product.title}</a>
        
        <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; margin-bottom:0.5rem;">
          <div class="rating-stars">★★★★★</div>
          <span style="font-weight:600; color:var(--pjr-dark-slate);">${product.rating}</span>
          <span style="color:var(--pjr-steel-grey);">(${product.reviewsCount})</span>
        </div>

        <div class="product-price-row">
          <span class="price-current">₹${product.price.toLocaleString('en-IN')}</span>
          ${product.originalPrice ? `<span class="price-original">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function renderNewArrivals() {
  const filtered = store.getFilteredProducts();
  const productsToShow = filtered.length > 0 ? filtered : store.products;

  return `
    <section class="section" id="new-arrivals">
      <div class="container">
        <div style="display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:3rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <span class="section-subtitle">JUST IN</span>
            <h2 class="section-title">New Arrivals</h2>
            <p class="text-muted">Fresh drops engineered with PJR's signature perfect fit technology.</p>
          </div>

          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-outline filter-gender-btn ${store.filters.gender === 'all' ? 'active' : ''}" data-gender="all">All</button>
            <button class="btn btn-outline filter-gender-btn ${store.filters.gender === 'men' ? 'active' : ''}" data-gender="men">Men</button>
            <button class="btn btn-outline filter-gender-btn ${store.filters.gender === 'women' ? 'active' : ''}" data-gender="women">Women</button>
            <button class="btn btn-outline filter-gender-btn ${store.filters.gender === 'accessories' ? 'active' : ''}" data-gender="accessories">Accessories</button>
          </div>
        </div>

        <div class="grid-4" id="productsGridContainer">
          ${productsToShow.map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>
  `;
}

export function renderBestSellers() {
  const bestSellers = store.products
    .filter(p => Boolean(p.isBestSeller))
    .sort((a, b) => (Number(a.bestSellerOrder) || 99) - (Number(b.bestSellerOrder) || 99))
    .slice(0, 3);

  if (bestSellers.length === 0) {
    return '';
  }

  return `
    <section class="section" id="best-sellers" style="background:var(--pjr-bg-grey);">
      <div class="container">
        <div style="text-align:center; max-width:600px; margin:0 auto 3.5rem;">
          <span class="section-subtitle">POPULAR DEMAND</span>
          <h2 class="section-title">Best Sellers</h2>
          <p class="text-muted">The most coveted fashion pieces loved by our luxury community.</p>
        </div>

        <div style="display:flex; justify-content:center; gap:1.5rem; flex-wrap:wrap;">
          ${bestSellers.map(p => `
            <div style="flex:1 1 280px; max-width:350px;">
              ${renderProductCard(p)}
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initProductEvents() {
  document.addEventListener('click', (e) => {
    const qvBtn = e.target.closest('.quick-view-btn');
    if (qvBtn) {
      const pId = qvBtn.dataset.qvId;
      const product = store.products.find(p => p.id === pId);
      if (product) store.openModal('quickView', product);
      return;
    }

    const cartBtn = e.target.closest('.add-cart-btn');
    if (cartBtn) {
      const pId = cartBtn.dataset.cartId;
      const product = store.products.find(p => p.id === pId);
      if (product) {
        store.addToCart(product);
        store.openModal('cart');
      }
      return;
    }

    const wishBtn = e.target.closest('.wishlist-btn');
    if (wishBtn) {
      const pId = wishBtn.dataset.wishlistId;
      if (pId) store.toggleWishlist(pId);
      return;
    }

    const filterGenderBtn = e.target.closest('.filter-gender-btn');
    if (filterGenderBtn) {
      const gender = filterGenderBtn.dataset.gender;
      store.setFilter('gender', gender);
    }
  });
}
