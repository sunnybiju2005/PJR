/* PJR Dedicated Wishlist Page Renderer — Mobile-Optimized with Full Actions */
import { store } from '../state.js';

export function renderWishlistPage() {
  const wishlistProducts = store.products.filter(p => store.wishlist.includes(p.id));
  const { itemCount } = store.getCartTotals();

  return `
    <!-- Page Header Banner -->
    <div class="wishlist-header-banner" style="background:var(--pjr-deep-navy); color:var(--pjr-pure-white); padding:7.5rem 0 2.5rem; border-bottom:1px solid rgba(255,255,255,0.1);">
      <div class="container">
        <div style="font-size:0.82rem; color:var(--pjr-teal-light); margin-bottom:0.5rem; font-weight:600;">
          <a href="index.html" style="color:var(--pjr-teal-light); text-decoration:none;">Home</a> &nbsp;/&nbsp; Saved Wishlist
        </div>
        <h1 style="color:var(--pjr-pure-white); margin-bottom:0.4rem;">
          My Wishlist
          <span style="font-size:1.4rem; font-weight:600; color:var(--pjr-teal-light);">(${wishlistProducts.length})</span>
        </h1>
        <p style="color:rgba(255,255,255,0.75); font-size:0.95rem; margin:0;">Your saved haute couture pieces and perfect fit apparel.</p>
      </div>
    </div>

    <section class="section" style="background:var(--pjr-bg-grey); min-height:60vh;">
      <div class="container">
        ${wishlistProducts.length === 0 ? `
          <div style="text-align:center; padding:4rem 1rem; background:var(--pjr-pure-white); border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
            <div style="font-size:3.5rem; margin-bottom:1rem;">❤️</div>
            <h3 style="color:var(--pjr-deep-navy); margin-bottom:0.5rem;">Your wishlist is empty</h3>
            <p class="text-muted" style="margin-bottom:1.5rem; font-size:0.9rem;">Browse our collections and save your favourite luxury pieces.</p>
            <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
              <a href="mens.html" class="btn btn-teal">Men's Collection</a>
              <a href="womens.html" class="btn btn-outline">Women's Couture</a>
            </div>
          </div>
        ` : `
          <!-- Toolbar: count + clear all -->
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.75rem;">
            <span style="font-size:0.88rem; color:var(--pjr-steel-grey); font-weight:600;">
              <strong style="color:var(--pjr-deep-navy);">${wishlistProducts.length}</strong> item${wishlistProducts.length !== 1 ? 's' : ''} saved
            </span>
            <button class="btn btn-outline" id="wishlistClearAllBtn" style="padding:0.45rem 1rem; font-size:0.8rem; color:var(--pjr-danger);">
              Clear All
            </button>
          </div>

          <!-- Wishlist Items Grid -->
          <div class="wishlist-grid">
            ${wishlistProducts.map(p => {
              const img = (p.imageUrls || p.images || [])[0] || 'assets/images/hero-men.png';
              return `
                <div class="wishlist-item-card glass-card" data-product-id="${p.id}">
                  <!-- Product Image -->
                  <div style="position:relative; aspect-ratio:3/4; overflow:hidden; border-radius:var(--radius-sm) var(--radius-sm) 0 0; background:var(--pjr-bg-grey);">
                    <img src="${img}" alt="${p.title}" loading="lazy"
                      style="width:100%; height:100%; object-fit:cover; transition:transform 0.35s ease;" />
                    
                    ${p.discount ? `<span class="badge badge-discount" style="position:absolute; top:0.6rem; left:0.6rem; z-index:5; font-size:0.6rem;">-${p.discount}% OFF</span>` : ''}

                    <!-- Remove from wishlist (top-right X) -->
                    <button class="wishlist-remove-btn" data-remove-id="${p.id}"
                      style="position:absolute; top:0.6rem; right:0.6rem; z-index:5; width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,0.92); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--pjr-danger); font-size:1rem; box-shadow:var(--shadow-sm); transition:all 0.2s ease;"
                      title="Remove from wishlist">
                      ✕
                    </button>
                  </div>

                  <!-- Product Details -->
                  <div style="padding:0.85rem 0.85rem 1rem;">
                    <span class="product-brand">${p.brand}</span>
                    <div class="product-title wishlist-quick-view" data-qv-id="${p.id}"
                      style="cursor:pointer; font-size:0.88rem; font-weight:600; color:var(--pjr-dark-slate); line-height:1.3; margin:0.2rem 0 0.5rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                      ${p.title}
                    </div>

                    <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.7rem;">
                      <span class="price-current" style="font-size:0.95rem;">₹${p.price.toLocaleString('en-IN')}</span>
                      ${p.originalPrice ? `<span class="price-original" style="font-size:0.78rem;">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
                    </div>

                    <!-- Action Buttons -->
                    <div style="display:flex; gap:0.5rem;">
                      <button class="btn btn-teal wishlist-add-cart-btn" data-cart-id="${p.id}"
                        style="flex:1; padding:0.55rem 0.5rem; font-size:0.78rem; border-radius:var(--radius-xs);">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right:3px;"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        Add to Bag
                      </button>
                      <button class="btn btn-outline wishlist-quick-view" data-qv-id="${p.id}"
                        style="padding:0.55rem 0.7rem; font-size:0.78rem; border-radius:var(--radius-xs);">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Continue Shopping -->
          <div style="text-align:center; margin-top:3rem; padding-top:2rem; border-top:1px solid var(--pjr-light-grey);">
            <p style="color:var(--pjr-steel-grey); font-size:0.9rem; margin-bottom:1rem;">Discover more luxury pieces</p>
            <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
              <a href="mens.html" class="btn btn-teal">Men's Collection</a>
              <a href="womens.html" class="btn btn-outline">Women's Couture</a>
              <a href="accessories.html" class="btn btn-outline">Accessories</a>
            </div>
          </div>
        `}
      </div>
    </section>
  `;
}

export function initWishlistPageEvents() {
  // Remove single item from wishlist
  document.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.wishlist-remove-btn');
    if (removeBtn) {
      const id = removeBtn.dataset.removeId;
      store.toggleWishlist(id);
      return;
    }

    // Add to cart from wishlist
    const addCartBtn = e.target.closest('.wishlist-add-cart-btn');
    if (addCartBtn) {
      const id = addCartBtn.dataset.cartId;
      const product = store.products.find(p => p.id === id);
      if (product) {
        store.addToCart(product);
        // Visual feedback
        addCartBtn.textContent = '✓ Added!';
        addCartBtn.style.background = 'var(--pjr-teal)';
        setTimeout(() => {
          addCartBtn.innerHTML = `
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right:3px;"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            Add to Bag
          `;
        }, 1200);
      }
      return;
    }

    // Quick view product
    const qvBtn = e.target.closest('.wishlist-quick-view');
    if (qvBtn) {
      const id = qvBtn.dataset.qvId;
      const product = store.products.find(p => p.id === id);
      if (product) store.openModal('quickView', product);
      return;
    }

    // Clear all wishlist items
    if (e.target.id === 'wishlistClearAllBtn') {
      if (confirm('Remove all items from your wishlist?')) {
        store.wishlist = [];
        store.notify();
      }
    }
  });
}
