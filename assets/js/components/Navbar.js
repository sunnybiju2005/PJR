/* PJR Sticky Glassmorphism Navbar with Desktop Mega Menu, Mobile Drawer & Shop Category Picker Bottom Sheet */
import { store } from '../state.js';

export function renderNavbar(activePage = 'home') {
  const { itemCount } = store.getCartTotals();
  const wishlistCount = store.wishlist.length;

  return `
    <!-- Desktop / Mobile Top Navbar -->
    <nav class="navbar scrolled" id="mainNavbar">
      <div class="container nav-container">
        <!-- Menu trigger (mobile only) -->
        <button class="hamburger-btn" id="mobileMenuTrigger" aria-label="Open navigation menu">
          <svg class="menu-icon-open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="17" y2="12"/>
            <line x1="3" y1="18" x2="13" y2="18"/>
          </svg>
          <svg class="menu-icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="6" y1="6" x2="18" y2="18"/>
            <line x1="18" y1="6" x2="6" y2="18"/>
          </svg>
        </button>

        <a href="index.html" class="brand-logo">
          <span class="brand-name">PJR</span>
          <span class="brand-tagline">Multiple Brands &amp; Perfect Fit</span>
        </a>

        <ul class="nav-menu">
          <li><a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a></li>

          <!-- Men Mega Menu Dropdown -->
          <li class="nav-item-dropdown">
            <a href="mens.html" class="nav-link ${activePage === 'men' ? 'active' : ''}">Men</a>
            <div class="mega-menu">
              <div class="container mega-menu-container">
                <div class="mega-column">
                  <h5>Men's Apparel</h5>
                  ${store.subcategories.filter(s => s.parent === 'men' && s.group === 'Apparel').map(s => `
                    <a href="mens.html?subcat=${s.id}" class="mega-link" data-subcat="${s.id}">${s.name}</a>
                  `).join('')}
                </div>
                <div class="mega-column">
                  <h5>Footwear</h5>
                  ${store.subcategories.filter(s => s.parent === 'men' && s.group === 'Footwear').map(s => `
                    <a href="mens.html?subcat=${s.id}" class="mega-link" data-subcat="${s.id}">${s.name}</a>
                  `).join('')}
                </div>
                <div class="mega-column">
                  <h5>Accessories</h5>
                  ${store.subcategories.filter(s => s.parent === 'men' && s.group === 'Accessories').map(s => `
                    <a href="mens.html?subcat=${s.id}" class="mega-link" data-subcat="${s.id}">${s.name}</a>
                  `).join('')}
                </div>
                <div class="mega-column mega-featured">
                  <img src="assets/images/hero-men.png" alt="Men's Italian Suits" />
                  <div class="mega-featured-text">
                    <span>SPRING 2026</span>
                    <h6>Italian Tailored Fit</h6>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <!-- Women Mega Menu Dropdown -->
          <li class="nav-item-dropdown">
            <a href="womens.html" class="nav-link ${activePage === 'women' ? 'active' : ''}">Women</a>
            <div class="mega-menu">
              <div class="container mega-menu-container">
                <div class="mega-column">
                  <h5>Couture &amp; Tops</h5>
                  ${store.subcategories.filter(s => s.parent === 'women' && s.group === 'Apparel').map(s => `
                    <a href="womens.html?subcat=${s.id}" class="mega-link" data-subcat="${s.id}">${s.name}</a>
                  `).join('')}
                </div>
                <div class="mega-column">
                  <h5>Luxury Footwear</h5>
                  ${store.subcategories.filter(s => s.parent === 'women' && s.group === 'Footwear').map(s => `
                    <a href="womens.html?subcat=${s.id}" class="mega-link" data-subcat="${s.id}">${s.name}</a>
                  `).join('')}
                </div>
                <div class="mega-column">
                  <h5>Accessories &amp; Jewels</h5>
                  ${store.subcategories.filter(s => s.parent === 'women' && s.group === 'Accessories').map(s => `
                    <a href="womens.html?subcat=${s.id}" class="mega-link" data-subcat="${s.id}">${s.name}</a>
                  `).join('')}
                </div>
                <div class="mega-column mega-featured">
                  <img src="assets/images/hero-women.png" alt="Women Haute Couture" />
                  <div class="mega-featured-text">
                    <span>HAUTE COUTURE</span>
                    <h6>Silk Draped Gowns</h6>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li><a href="accessories.html" class="nav-link ${activePage === 'accessories' ? 'active' : ''}">Accessories</a></li>
          <li><a href="new-arrivals.html" class="nav-link ${activePage === 'new-arrivals' ? 'active' : ''}">New Arrivals</a></li>
          <li><a href="best-sellers.html" class="nav-link ${activePage === 'best-sellers' ? 'active' : ''}">Best Sellers</a></li>
          <li><a href="offers.html" class="nav-link ${activePage === 'offers' ? 'active' : ''}">Offers</a></li>
        </ul>

        <div class="nav-actions">
          <button class="btn-icon" id="searchTrigger" title="Search catalog">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>

          <a href="wishlist.html" class="btn-icon" title="Wishlist" style="position:relative;">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            ${wishlistCount > 0 ? `<span class="counter-badge">${wishlistCount}</span>` : ''}
          </a>

          <button class="btn-icon" id="cartTrigger" title="Cart Drawer" style="position:relative;">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            ${itemCount > 0 ? `<span class="counter-badge">${itemCount}</span>` : ''}
          </button>

          <a href="profile.html" class="btn-icon" title="Customer Profile">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </a>
        </div>
      </div>
    </nav>

    <!-- Mobile Slide-out Navigation Drawer -->
    <div class="mobile-nav-drawer-overlay" id="mobileNavDrawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <nav class="mobile-nav-drawer">
        <div class="mobile-drawer-header">
          <a href="index.html" class="mobile-drawer-logo">
            <span class="brand-name">PJR</span>
            <span class="brand-tagline">Multiple Brands &amp; Perfect Fit</span>
          </a>
          <button class="mobile-drawer-close" id="mobileDrawerClose" aria-label="Close menu">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="mobile-drawer-body">
          <div class="mobile-drawer-section-label">Shop Categories</div>
          <a href="mens.html" class="mobile-drawer-link ${activePage === 'men' ? 'active' : ''}">
            <span>👔 Men's Collection</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </a>
          <a href="womens.html" class="mobile-drawer-link ${activePage === 'women' ? 'active' : ''}">
            <span>👗 Women's Couture</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </a>
          <a href="accessories.html" class="mobile-drawer-link ${activePage === 'accessories' ? 'active' : ''}">
            <span>⌚ Luxury Accessories</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </a>

          <div class="mobile-drawer-section-label" style="margin-top:0.75rem;">Discover</div>
          <a href="new-arrivals.html" class="mobile-drawer-link ${activePage === 'new-arrivals' ? 'active' : ''}">
            <span>✨ New Arrivals</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </a>
          <a href="best-sellers.html" class="mobile-drawer-link ${activePage === 'best-sellers' ? 'active' : ''}">
            <span>🔥 Best Sellers</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </a>
          <a href="offers.html" class="mobile-drawer-link ${activePage === 'offers' ? 'active' : ''}">
            <span>🏷️ Special Offers</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </a>
        </div>

        <div class="mobile-drawer-footer">
          <a href="wishlist.html" class="btn-wishlist">
            ♡ Wishlist ${wishlistCount > 0 ? `(${wishlistCount})` : ''}
          </a>
          <a href="profile.html" class="btn-profile">
            👤 Profile
          </a>
        </div>
      </nav>
    </div>

    <!-- Mobile Shop Category Picker Bottom Sheet Modal -->
    <div class="drawer-overlay" id="shopCategoryModal" style="z-index: 1200;" role="dialog" aria-modal="true" aria-label="Select Shop Category">
      <div class="drawer-content" style="max-height:80vh; border-radius:var(--radius-lg) var(--radius-lg) 0 0; padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid var(--pjr-light-grey);">
          <div>
            <span style="font-size:0.7rem; font-weight:700; color:var(--pjr-teal); text-transform:uppercase; letter-spacing:0.12em;">PJR CATALOG</span>
            <h3 style="margin:0; font-size:1.25rem; color:var(--pjr-deep-navy);">Select Category</h3>
          </div>
          <button class="close-btn" id="closeShopCategoryModal">✕</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:1rem; overflow-y:auto; padding-bottom:1rem;">
          <!-- Men Card -->
          <a href="mens.html" class="shop-cat-card" style="text-decoration:none;">
            <div style="position:relative; height:110px; border-radius:var(--radius-md); overflow:hidden; box-shadow:var(--shadow-md);">
              <img src="assets/images/hero-men.png" style="width:100%; height:100%; object-fit:cover;" />
              <div style="position:absolute; inset:0; background:linear-gradient(90deg, rgba(0,27,42,0.85) 0%, rgba(0,27,42,0.3) 100%); display:flex; align-items:center; justify-content:space-between; padding:0 1.25rem; color:white;">
                <div>
                  <h4 style="color:white; margin:0; font-size:1.2rem;">Men's Apparel</h4>
                  <span style="font-size:0.78rem; opacity:0.85; color:var(--pjr-teal-light);">Suits, Shirts &amp; Footwear</span>
                </div>
                <span style="background:rgba(255,255,255,0.2); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center;">→</span>
              </div>
            </div>
          </a>

          <!-- Women Card -->
          <a href="womens.html" class="shop-cat-card" style="text-decoration:none;">
            <div style="position:relative; height:110px; border-radius:var(--radius-md); overflow:hidden; box-shadow:var(--shadow-md);">
              <img src="assets/images/hero-women.png" style="width:100%; height:100%; object-fit:cover;" />
              <div style="position:absolute; inset:0; background:linear-gradient(90deg, rgba(0,27,42,0.85) 0%, rgba(0,27,42,0.3) 100%); display:flex; align-items:center; justify-content:space-between; padding:0 1.25rem; color:white;">
                <div>
                  <h4 style="color:white; margin:0; font-size:1.2rem;">Women's Couture</h4>
                  <span style="font-size:0.78rem; opacity:0.85; color:var(--pjr-teal-light);">Dresses, Gowns &amp; Heels</span>
                </div>
                <span style="background:rgba(255,255,255,0.2); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center;">→</span>
              </div>
            </div>
          </a>

          <!-- Accessories Card -->
          <a href="accessories.html" class="shop-cat-card" style="text-decoration:none;">
            <div style="position:relative; height:110px; border-radius:var(--radius-md); overflow:hidden; box-shadow:var(--shadow-md);">
              <img src="assets/images/hero-accessories.png" style="width:100%; height:100%; object-fit:cover;" />
              <div style="position:absolute; inset:0; background:linear-gradient(90deg, rgba(0,27,42,0.85) 0%, rgba(0,27,42,0.3) 100%); display:flex; align-items:center; justify-content:space-between; padding:0 1.25rem; color:white;">
                <div>
                  <h4 style="color:white; margin:0; font-size:1.2rem;">Luxury Accessories</h4>
                  <span style="font-size:0.78rem; opacity:0.85; color:var(--pjr-teal-light);">Watches, Belts &amp; Bags</span>
                </div>
                <span style="background:rgba(255,255,255,0.2); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center;">→</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation Bar -->
    <nav class="mobile-bottom-nav" id="mobileBottomNav" aria-label="Mobile navigation">
      <ul>
        <li>
          <a href="index.html" class="mobile-nav-item ${activePage === 'home' ? 'active' : ''}">
            <svg width="22" height="22" fill="${activePage === 'home' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </a>
        </li>
        <li>
          <button class="mobile-nav-item ${['men','women','accessories'].includes(activePage) ? 'active' : ''}" id="mobileShopTrigger">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            Shop
          </button>
        </li>
        <li>
          <a href="wishlist.html" class="mobile-nav-item ${activePage === 'wishlist' ? 'active' : ''}" style="position:relative;">
            <svg width="22" height="22" fill="${activePage === 'wishlist' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            ${wishlistCount > 0 ? `<span class="mobile-nav-badge">${wishlistCount}</span>` : ''}
            Wishlist
          </a>
        </li>
        <li>
          <button class="mobile-nav-item ${activePage === 'cart' ? 'active' : ''}" id="mobileCartTrigger" style="position:relative;">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            ${itemCount > 0 ? `<span class="mobile-nav-badge">${itemCount}</span>` : ''}
            Cart
          </button>
        </li>
        <li>
          <a href="profile.html" class="mobile-nav-item ${activePage === 'profile' ? 'active' : ''}">
            <svg width="22" height="22" fill="${activePage === 'profile' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </a>
        </li>
      </ul>
    </nav>
  `;
}

export function initNavbarEvents() {
  // Event delegation — all navbar interactions
  document.addEventListener('click', (e) => {
    // Desktop search
    if (e.target.closest('#searchTrigger')) {
      store.openModal('search');
    }

    // Desktop cart
    if (e.target.closest('#cartTrigger')) {
      store.openModal('cart');
    }

    // Mobile cart (bottom nav)
    if (e.target.closest('#mobileCartTrigger')) {
      store.openModal('cart');
    }

    // Mobile shop category picker trigger
    if (e.target.closest('#mobileShopTrigger')) {
      const modal = document.getElementById('shopCategoryModal');
      modal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Close shop category picker
    if (e.target.closest('#closeShopCategoryModal') || e.target.id === 'shopCategoryModal') {
      const modal = document.getElementById('shopCategoryModal');
      modal?.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Mobile hamburger — open drawer
    if (e.target.closest('#mobileMenuTrigger')) {
      const drawer = document.getElementById('mobileNavDrawer');
      const btn = document.getElementById('mobileMenuTrigger');
      drawer?.classList.add('active');
      btn?.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Close drawer — X button
    if (e.target.closest('#mobileDrawerClose')) {
      closeMobileDrawer();
    }

    // Close drawer — click on overlay backdrop
    if (e.target === document.getElementById('mobileNavDrawer')) {
      closeMobileDrawer();
    }

    // Mega menu subcategory links
    const megaLink = e.target.closest('.mega-link');
    if (megaLink) {
      const subcat = megaLink.dataset.subcat;
      if (subcat) store.setFilter('subcategory', subcat);
    }
  });

  // Close drawer on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileDrawer();
  });
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobileNavDrawer');
  const btn = document.getElementById('mobileMenuTrigger');
  drawer?.classList.remove('active');
  btn?.classList.remove('active');
  document.body.style.overflow = '';
}
