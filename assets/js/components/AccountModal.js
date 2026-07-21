/* PJR Customer Account — Real Firebase Auth (Google + Email/Password) */
import { store } from '../state.js';
import { PRODUCTS } from '../mockData.js';
import { renderAddressCard } from './AddressManager.js';
import {
  auth, googleProvider,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from '../firebaseConfig.js';

let activeTab = 'addresses';
let authMode = 'login'; // 'login' | 'signup'

/* ── Google SVG Logo ─────────────────────────────────────────────── */
const googleIcon = `<svg width="18" height="18" viewBox="0 0 48 48" style="margin-right:10px;flex-shrink:0;">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
</svg>`;

/* ── Login / Signup Form ─────────────────────────────────────────── */
function renderLoginForm() {
  // Always render both modes — toggle is done via direct DOM (no re-render)
  return `
    <div class="modal-overlay active" id="accountModal">
      <div class="modal-content" style="max-width:440px; padding:2.5rem;">
        <button class="close-btn" id="closeAccountModal" style="position:absolute;top:1.25rem;right:1.25rem;z-index:20;">✕</button>

        <div style="text-align:center;margin-bottom:1.75rem;">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--pjr-teal);display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin:0 auto 1rem;">👤</div>
          <h2 id="authTitle" style="font-size:1.5rem;margin-bottom:0.25rem;">Welcome Back</h2>
          <p id="authSubtitle" style="color:var(--pjr-steel-grey);font-size:0.875rem;">Sign in to your PJR account</p>
        </div>

        <!-- Google Button -->
        <button id="googleSignInBtn" style="
          width:100%; display:flex; align-items:center; justify-content:center;
          padding:0.75rem 1rem; border:1.5px solid #dadce0; border-radius:8px;
          background:#fff; font-size:0.95rem; font-weight:600; color:#3c4043;
          cursor:pointer; transition:box-shadow 0.2s, background 0.2s;
          margin-bottom:1.25rem; font-family:inherit;
        " onmouseover="this.style.background='#f8f9fa';this.style.boxShadow='0 1px 6px rgba(0,0,0,0.12)'"
           onmouseout="this.style.background='#fff';this.style.boxShadow='none'">
          ${googleIcon} Continue with Google
        </button>

        <!-- Divider -->
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;">
          <div style="flex:1;height:1px;background:var(--pjr-light-grey);"></div>
          <span style="font-size:0.8rem;color:var(--pjr-steel-grey);font-weight:500;">or</span>
          <div style="flex:1;height:1px;background:var(--pjr-light-grey);"></div>
        </div>

        <!-- Error Box -->
        <div id="authError" style="display:none;background:#fee2e2;color:#dc2626;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1rem;font-size:0.85rem;border-left:3px solid #dc2626;"></div>

        <!-- Name (hidden by default, shown in signup mode) -->
        <div class="form-group" id="authNameGroup" style="display:none;">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-input" id="authName" placeholder="Enter your full name" autocomplete="name" />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" id="authEmail" placeholder="Enter your email" autocomplete="email" />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" id="authPassword" placeholder="Enter your password" autocomplete="current-password" />
        </div>

        <!-- Submit -->
        <button class="btn btn-teal" id="authSubmitBtn" style="width:100%;padding:0.85rem;font-size:1rem;margin-top:0.5rem;">
          🔑 Sign In
        </button>

        <!-- Toggle mode -->
        <p style="text-align:center;margin-top:1.25rem;font-size:0.875rem;color:var(--pjr-steel-grey);">
          <span id="authToggleText">Don't have an account?</span>
          <button id="authToggleMode" style="background:none;border:none;color:var(--pjr-teal);font-weight:700;cursor:pointer;font-size:0.875rem;padding:0;margin-left:4px;">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  `;
}


/* ── Logged-in Dashboard ─────────────────────────────────────────── */
export function renderAccountModal() {
  const isOpen = store.activeModal === 'account';
  if (!isOpen) return `<div class="modal-overlay" id="accountModal"></div>`;

  if (!store.user.isLoggedIn) return renderLoginForm();

  const order = store.activeOrder;
  const addresses = store.addresses;
  const wishlistProducts = PRODUCTS.filter(p => store.wishlist.includes(p.id));
  const steps = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
  const currentStepIndex = steps.indexOf(order.status);
  const progressPercent = (currentStepIndex / (steps.length - 1)) * 100;

  return `
    <div class="modal-overlay active" id="accountModal">
      <div class="modal-content" style="max-width:920px;padding:0;overflow:hidden;">
        <button class="close-btn" id="closeAccountModal" style="position:absolute;top:1.25rem;right:1.25rem;z-index:20;">✕</button>

        <div style="display:grid;grid-template-columns:230px 1fr;min-height:580px;">
          <!-- Sidebar -->
          <div style="background:var(--pjr-deep-navy);padding:2rem 1.5rem;color:var(--pjr-pure-white);display:flex;flex-direction:column;">
            <div style="margin-bottom:2rem;">
              <div style="width:56px;height:56px;border-radius:50%;background:var(--pjr-teal);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.4rem;margin-bottom:0.75rem;">
                ${(store.user.name || store.user.email || 'U')[0].toUpperCase()}
              </div>
              <h4 style="color:var(--pjr-pure-white);margin-bottom:0.1rem;font-size:1.05rem;">${store.user.name || 'PJR Member'}</h4>
              <span style="font-size:0.75rem;color:var(--pjr-teal-light);">${store.user.email}</span>
            </div>

            <nav style="display:flex;flex-direction:column;gap:0.5rem;">
              <button class="tab-nav-btn ${activeTab === 'addresses' ? 'active' : ''}" data-tab="addresses">📍 Addresses (${addresses.length})</button>
              <button class="tab-nav-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders">📦 My Orders</button>
              <button class="tab-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}" data-tab="wishlist">❤️ Wishlist (${wishlistProducts.length})</button>
              <button class="tab-nav-btn ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">👤 Profile</button>
            </nav>

            <button class="btn btn-outline-white" id="logoutBtn" style="margin-top:auto;font-size:0.85rem;padding:0.6rem;">Logout</button>
          </div>

          <!-- Main Panel -->
          <div style="padding:2.5rem;overflow-y:auto;max-height:88vh;">
            ${activeTab === 'addresses' ? `
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                  <div>
                    <span class="section-subtitle">AMAZON &amp; FLIPKART STYLE</span>
                    <h3 style="margin:0;">Saved Delivery Addresses</h3>
                  </div>
                  <button class="btn btn-teal" id="accountAddNewAddrBtn" style="padding:0.6rem 1.1rem;font-size:0.88rem;">➕ Add New</button>
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;">
                  ${addresses.map(a => renderAddressCard(a)).join('')}
                </div>
              </div>
            ` : ''}

            ${activeTab === 'orders' ? `
              <div>
                <span class="section-subtitle">LIVE ORDER TRACKING</span>
                <h3 style="margin-bottom:1.5rem;">Order #${order.orderId}</h3>
                <div style="background:var(--pjr-bg-grey);padding:1.75rem;border-radius:var(--radius-md);border:1px solid var(--pjr-light-grey);">
                  <div class="timeline-track">
                    <div class="timeline-progress" style="width:${progressPercent}%;"></div>
                    <div class="timeline-step ${currentStepIndex >= 0 ? 'completed' : ''}"><div class="step-icon">1</div><span class="step-label">Placed</span></div>
                    <div class="timeline-step ${currentStepIndex >= 1 ? 'completed' : ''}"><div class="step-icon">2</div><span class="step-label">Confirmed</span></div>
                    <div class="timeline-step ${currentStepIndex >= 2 ? 'completed' : ''}"><div class="step-icon">3</div><span class="step-label">Packed</span></div>
                    <div class="timeline-step ${currentStepIndex >= 3 ? 'active' : ''}"><div class="step-icon">4</div><span class="step-label">Shipped</span></div>
                    <div class="timeline-step ${currentStepIndex >= 4 ? 'completed' : ''}"><div class="step-icon">5</div><span class="step-label">Delivered</span></div>
                  </div>
                </div>
              </div>
            ` : ''}

            ${activeTab === 'wishlist' ? `
              <div>
                <h3 style="margin-bottom:1.5rem;">Saved Wishlist Items</h3>
                ${wishlistProducts.length === 0
                  ? `<p class="text-muted">Your wishlist is empty.</p>`
                  : `<div class="grid-2">${wishlistProducts.map(p => `
                    <div style="display:flex;gap:0.75rem;border:1px solid var(--pjr-light-grey);border-radius:var(--radius-sm);padding:0.75rem;">
                      <img src="${p.images[0]}" style="width:60px;height:75px;object-fit:cover;border-radius:4px;" />
                      <div>
                        <h5 style="font-size:0.9rem;margin-bottom:0.25rem;">${p.title}</h5>
                        <span style="font-weight:700;color:var(--pjr-deep-navy);">₹${p.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>`).join('')}</div>`}
              </div>
            ` : ''}

            ${activeTab === 'profile' ? `
              <div>
                <h3 style="margin-bottom:1.5rem;">Account Profile</h3>
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-input" value="${store.user.name || ''}" readonly />
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-input" value="${store.user.email}" readonly />
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ── Event Handlers ──────────────────────────────────────────────── */
export function initAccountEvents() {
  document.addEventListener('click', async (e) => {

    // Close modal
    if (e.target.id === 'closeAccountModal' || e.target.id === 'accountModal') {
      store.closeModal();
      return;
    }

    // Switch tabs
    const tabBtn = e.target.closest('.tab-nav-btn');
    if (tabBtn) {
      activeTab = tabBtn.dataset.tab;
      store.notify();
      return;
    }

    // Add address
    if (e.target.id === 'accountAddNewAddrBtn') {
      store.openModal('editAddress');
      return;
    }

    // Toggle Sign In ↔ Sign Up — direct DOM, no re-render
    if (e.target.id === 'authToggleMode') {
      authMode = authMode === 'login' ? 'signup' : 'login';
      const isSignUp = authMode === 'signup';

      const nameGroup  = document.getElementById('authNameGroup');
      const title      = document.getElementById('authTitle');
      const subtitle   = document.getElementById('authSubtitle');
      const submitBtn  = document.getElementById('authSubmitBtn');
      const toggleBtn  = document.getElementById('authToggleMode');
      const toggleText = document.getElementById('authToggleText');
      const password   = document.getElementById('authPassword');

      if (nameGroup)  nameGroup.style.display = isSignUp ? 'block' : 'none';
      if (title)      title.textContent        = isSignUp ? 'Create Account' : 'Welcome Back';
      if (subtitle)   subtitle.textContent     = isSignUp ? 'Join PJR — World-Class Luxury Fashion' : 'Sign in to your PJR account';
      if (submitBtn)  submitBtn.textContent    = isSignUp ? '🚀 Create Account' : '🔑 Sign In';
      if (toggleBtn)  toggleBtn.textContent    = isSignUp ? 'Sign In' : 'Sign Up';
      if (toggleText) toggleText.textContent   = isSignUp ? 'Already have an account?' : "Don't have an account?";
      if (password)   password.placeholder     = isSignUp ? 'Create a password (min 6 chars)' : 'Enter your password';

      const errEl = document.getElementById('authError');
      if (errEl) errEl.style.display = 'none';
      return;
    }

    // Google Sign-In — use redirect directly (avoids popup-blocked entirely)
    if (e.target.id === 'googleSignInBtn' || e.target.closest('#googleSignInBtn')) {
      const btn = document.getElementById('googleSignInBtn');
      if (btn) { btn.disabled = true; btn.textContent = 'Redirecting to Google...'; }
      try {
        await signInWithRedirect(auth, googleProvider);
        // Page will navigate away → on return, onAuthStateChanged fires automatically
      } catch (err) {
        showAuthError(getErrorMessage(err));
        if (btn) { btn.disabled = false; btn.innerHTML = `${googleIcon} Continue with Google`; }
      }
      return;
    }

    // Email Submit (Login or Sign Up)
    if (e.target.id === 'authSubmitBtn') {
      const email = document.getElementById('authEmail')?.value.trim();
      const password = document.getElementById('authPassword')?.value.trim();
      const name = document.getElementById('authName')?.value.trim();
      const btn = e.target;

      if (!email || !password) { showAuthError('Please fill in all fields.'); return; }
      if (!email.includes('@')) { showAuthError('Please enter a valid email.'); return; }
      if (authMode === 'signup' && !name) { showAuthError('Please enter your name.'); return; }
      if (password.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }

      btn.disabled = true;
      btn.textContent = authMode === 'signup' ? 'Creating account...' : 'Signing in...';

      try {
        if (authMode === 'signup') {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(cred.user, { displayName: name });
          // onAuthStateChanged will fire and update store
        } else {
          await signInWithEmailAndPassword(auth, email, password);
          // onAuthStateChanged will fire and update store
        }
      } catch (err) {
        showAuthError(getErrorMessage(err));
        btn.disabled = false;
        btn.textContent = authMode === 'signup' ? '🚀 Create Account' : '🔑 Sign In';
      }
      return;
    }

    // Logout
    if (e.target.id === 'logoutBtn') {
      try {
        await signOut(auth);
        store.logout(); // clears local state
      } catch (err) {
        console.error('Logout error:', err);
      }
      return;
    }
  });
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function showAuthError(msg) {
  const el = document.getElementById('authError');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function getErrorMessage(err) {
  switch (err.code) {
    case 'auth/user-not-found':    return 'No account found with this email.';
    case 'auth/wrong-password':    return 'Incorrect password. Try again.';
    case 'auth/email-already-in-use': return 'An account already exists with this email.';
    case 'auth/weak-password':     return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':     return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    case 'auth/invalid-credential': return 'Incorrect email or password.';
    default: return err.message || 'Something went wrong. Please try again.';
  }
}
