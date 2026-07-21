/* PJR Router for Dedicated HTML Pages & Standalone Page Views */
import { store } from './state.js';
import { renderHomePage } from './pages/HomePage.js';
import { renderCategoryPage } from './pages/CategoryPage.js';
import { renderProfilePage } from './pages/ProfilePage.js';
import { renderWishlistPage } from './pages/WishlistPage.js';
import { renderCartPage } from './pages/CartPage.js';

export function renderCurrentRoute() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const appEl = document.getElementById('app');
  const pageAttr = appEl?.dataset.page;

  let page = pageAttr || 'home';

  if (!pageAttr) {
    if (path.includes('mens.html') || hash.includes('#men')) page = 'men';
    else if (path.includes('womens.html') || hash.includes('#women')) page = 'women';
    else if (path.includes('accessories.html') || hash.includes('#accessories')) page = 'accessories';
    else if (path.includes('new-arrivals.html') || hash.includes('#new-arrivals')) page = 'new-arrivals';
    else if (path.includes('best-sellers.html') || hash.includes('#best-sellers')) page = 'best-sellers';
    else if (path.includes('offers.html') || hash.includes('#offers')) page = 'offers';
    else if (path.includes('profile.html') || hash.includes('#profile')) page = 'profile';
    else if (path.includes('wishlist.html') || hash.includes('#wishlist')) page = 'wishlist';
    else if (path.includes('cart.html') || hash.includes('#cart')) page = 'cart';
  }

  // Parse URL query parameter for subcategory (e.g. mens.html?subcat=t-shirts)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const subcatParam = urlParams.get('subcat');
    if (subcatParam) {
      store.filters.subcategory = subcatParam;
    }
  }

  switch (page) {
    case 'home':
      return renderHomePage();
    case 'men':
      return renderCategoryPage('men');
    case 'women':
      return renderCategoryPage('women');
    case 'accessories':
      return renderCategoryPage('accessories');
    case 'new-arrivals':
    case 'best-sellers':
    case 'offers':
      return renderCategoryPage(page);
    case 'profile':
      return renderProfilePage();
    case 'cart':
      return renderCartPage();
    case 'wishlist':
      return renderWishlistPage();
    default:
      return renderHomePage();
  }
}

export function getActivePageName() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const appEl = document.getElementById('app');
  const pageAttr = appEl?.dataset.page;

  if (pageAttr) return pageAttr;
  if (path.includes('mens.html') || hash.includes('#men')) return 'men';
  if (path.includes('womens.html') || hash.includes('#women')) return 'women';
  if (path.includes('accessories.html') || hash.includes('#accessories')) return 'accessories';
  if (path.includes('new-arrivals.html') || hash.includes('#new-arrivals')) return 'new-arrivals';
  if (path.includes('best-sellers.html') || hash.includes('#best-sellers')) return 'best-sellers';
  if (path.includes('offers.html') || hash.includes('#offers')) return 'offers';
  if (path.includes('profile.html') || hash.includes('#profile')) return 'profile';
  if (path.includes('wishlist.html') || hash.includes('#wishlist')) return 'wishlist';
  if (path.includes('cart.html') || hash.includes('#cart')) return 'cart';
  return 'home';
}
