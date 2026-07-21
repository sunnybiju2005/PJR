/* PJR Main Application Entry Point for Dedicated Standalone HTML Pages */
import { renderNavbar, initNavbarEvents } from './components/Navbar.js';
import { renderProductModal, initProductModalEvents } from './components/ProductModal.js';
import { renderCartDrawer, initCartEvents } from './components/CartDrawer.js';
import { renderCheckoutModal, initCheckoutEvents } from './components/CheckoutModal.js';
import { renderAccountModal, initAccountEvents } from './components/AccountModal.js';
import { renderSearchDrawer, initSearchEvents } from './components/SearchDrawer.js';
import { renderAddressModal, initAddressEvents, initMapPickerInstance } from './components/AddressManager.js';
import { renderFooter } from './components/Footer.js';
import { renderCurrentRoute, getActivePageName } from './router.js';
import { initHeroEvents } from './components/Hero.js';
import { initCategoryEvents } from './components/Categories.js';
import { initProductEvents } from './components/ProductGrid.js';
import { initMasonryEvents } from './components/Masonry.js';
import { initCategoryPageEvents } from './pages/CategoryPage.js';
import { initProfilePageEvents } from './pages/ProfilePage.js';
import { initCartPageEvents } from './pages/CartPage.js';
import { store } from './state.js';
import { auth, onAuthStateChanged, getRedirectResult } from './firebaseConfig.js';

function renderApp() {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  const activePage = getActivePageName();

  appEl.innerHTML = `
    ${renderNavbar(activePage)}
    <main>
      ${renderCurrentRoute()}
    </main>
    ${renderFooter()}
    ${renderProductModal()}
    ${renderCartDrawer()}
    ${renderCheckoutModal()}
    ${renderAccountModal()}
    ${renderAddressModal()}
    ${renderSearchDrawer()}
  `;

  // Attach event handlers
  initNavbarEvents();
  initHeroEvents();
  initCategoryEvents();
  initProductEvents();
  initMasonryEvents();
  initCategoryPageEvents();
  initProfilePageEvents();
  initCartPageEvents();
  initProductModalEvents();
  initCartEvents();
  initCheckoutEvents();
  initAccountEvents();
  initAddressEvents();
  initSearchEvents();

  // Initialize interactive Leaflet Map if address modal is open
  if (store.activeModal === 'editAddress') {
    setTimeout(() => {
      initMapPickerInstance();
    }, 100);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    renderApp();

    // Handle Google redirect result (when popup was blocked & redirect was used)
    getRedirectResult(auth).catch(() => {/* ignore errors on pages without redirect */});

    store.subscribe(() => {
      renderApp();
    });

    // 🔥 Firebase Auth State — auto login/logout when Firebase auth changes
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const name = firebaseUser.displayName || firebaseUser.email.split('@')[0];
        store.login(name, firebaseUser.email);
        store.closeModal();
      } else {
        store.user = { name: '', email: '', isLoggedIn: false };
        localStorage.removeItem('pjr_user');
        store.notify();
      }
    });
  });
}
