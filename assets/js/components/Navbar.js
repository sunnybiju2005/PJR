/* PJR Sticky Glassmorphism Navbar with Desktop Mega Menu & HTML Page Links */
import { store } from '../state.js';
import { MEN_SUBCATEGORIES, WOMEN_SUBCATEGORIES } from '../mockData.js';

export function renderNavbar(activePage = 'home') {
  const { itemCount } = store.getCartTotals();
  const wishlistCount = store.wishlist.length;

  return `
    <nav class="navbar transparent" id="mainNavbar">
      <div class="container nav-container">
        <a href="index.html" class="brand-logo">
          <span class="brand-name">PJR</span>
          <span class="brand-tagline">Multiple Brands & Perfect Fit</span>
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
                  ${MEN_SUBCATEGORIES.filter(s => s.group === 'Apparel').map(s => `
                    <a href="mens.html?subcat=${s.id}" class="mega-link" data-subcat="${s.id}">${s.name}</a>
                  `).join('')}
                </div>
                <div class="mega-column">
                  <h5>Footwear</h5>
                  ${MEN_SUBCATEGORIES.filter(s => s.group === 'Footwear').map(s => `
                    <a href="mens.html?subcat=${s.id}" class="mega-link" data-subcat="${s.id}">${s.name}</a>
                  `).join('')}
                </div>
                <div class="mega-column">
                  <h5>Accessories</h5>
                  ${MEN_SUBCATEGORIES.filter(s => s.group === 'Accessories').map(s => `
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
                  <h5>Couture & Tops</h5>
                  ${WOMEN_SUBCATEGORIES.filter(s => s.group === 'Apparel').map(s => `
                    <a href="womens.html?subcat=${s.id}" class="mega-link" data-subcat="${s.id}">${s.name}</a>
                  `).join('')}
                </div>
                <div class="mega-column">
                  <h5>Luxury Footwear</h5>
                  ${WOMEN_SUBCATEGORIES.filter(s => s.group === 'Footwear').map(s => `
                    <a href="womens.html?subcat=${s.id}" class="mega-link" data-subcat="${s.id}">${s.name}</a>
                  `).join('')}
                </div>
                <div class="mega-column">
                  <h5>Accessories & Jewels</h5>
                  ${WOMEN_SUBCATEGORIES.filter(s => s.group === 'Accessories').map(s => `
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
  `;
}

export function initNavbarEvents() {
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.remove('transparent');
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.add('transparent');
        navbar.classList.remove('scrolled');
      }
    });
  }

  document.getElementById('searchTrigger')?.addEventListener('click', () => store.openModal('search'));
  document.getElementById('cartTrigger')?.addEventListener('click', () => store.openModal('cart'));

  document.querySelectorAll('.mega-link').forEach(link => {
    link.addEventListener('click', () => {
      const subcat = link.dataset.subcat;
      if (subcat) store.setFilter('subcategory', subcat);
    });
  });
}
