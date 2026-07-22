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
import { initWishlistPageEvents } from './pages/WishlistPage.js';
import { store } from './state.js';
import { auth, db, doc, setDoc, getDoc, onAuthStateChanged, getRedirectResult } from './firebaseConfig.js';

function renderApp() {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  // Track active input focus state before re-render
  const activeInput = document.activeElement;
  const isSearchFocused = activeInput && activeInput.id === 'liveSearchInput';
  const selectionStart = isSearchFocused ? activeInput.selectionStart : null;
  const selectionEnd = isSearchFocused ? activeInput.selectionEnd : null;

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

  // Restore search input focus if search drawer was active
  if (isSearchFocused) {
    const newSearchInput = document.getElementById('liveSearchInput');
    if (newSearchInput) {
      newSearchInput.focus();
      if (selectionStart !== null && selectionEnd !== null) {
        newSearchInput.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  }

  // Initialize interactive Leaflet Map if address modal is open
  if (store.activeModal === 'editAddress') {
    setTimeout(() => {
      initMapPickerInstance();
    }, 100);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Attach event handlers ONCE to prevent duplicate listeners
    initNavbarEvents();
    initHeroEvents();
    initCategoryEvents();
    initProductEvents();
    initMasonryEvents();
    initCategoryPageEvents();
    initProfilePageEvents();
    initCartPageEvents();
    initWishlistPageEvents();
    initProductModalEvents();
    initCartEvents();
    initCheckoutEvents();
    initAccountEvents();
    initAddressEvents();
    initSearchEvents();

    renderApp();

    // Handle Google redirect result (when popup was blocked & redirect was used)
    getRedirectResult(auth).catch(() => {/* ignore errors on pages without redirect */});

    store.subscribe(() => {
      renderApp();
    });

    // 🔥 Firebase Auth State — auto login/logout when Firebase auth changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          let userData = {
            name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User'),
            email: firebaseUser.email || '',
            createdAt: new Date().toISOString()
          };
          
          if (!userSnap.exists()) {
            await setDoc(userRef, userData, { merge: true });
          } else {
            userData = { ...userData, ...userSnap.data() };
          }

          store.login(userData.name, userData.email);
          store.closeModal();
        } catch (err) {
          console.error("Firestore Error:", err);
          // Fallback login if firestore fails
          const name = firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User');
          store.login(name, firebaseUser.email || '');
          store.closeModal();
        }
      } else {
        store.user = { name: '', email: '', isLoggedIn: false };
        localStorage.removeItem('pjr_user');
        store.notify();
      }
    });
  });
}
