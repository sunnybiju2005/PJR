/* PJR Luxury Checkout Flow Component with Multi-Address Selection */
import { store } from '../state.js';
import { renderAddressCard } from './AddressManager.js';

let currentStep = 1; // 1: Auth, 2: Address Selection, 3: Razorpay Payment, 4: Confirmed

export function renderCheckoutModal() {
  const isOpen = store.activeModal === 'checkout';
  if (!isOpen) return `<div class="modal-overlay" id="checkoutModal"></div>`;

  const { total, subtotal, gst, shipping } = store.getCartTotals();
  const addresses = store.addresses;
  const selectedAddrId = store.selectedAddressId || (addresses[0] ? addresses[0].id : null);

  return `
    <div class="modal-overlay active" id="checkoutModal">
      <div class="modal-content" style="max-width:800px; padding:2rem; overflow-y:auto; max-height:90vh;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--pjr-light-grey);">
          <div>
            <span class="brand-tagline">PJR EXPRESS CHECKOUT</span>
            <h3 style="margin:0; font-size:1.4rem;">Order Checkout</h3>
          </div>
          <button class="close-btn" id="closeCheckoutModal">✕</button>
        </div>

        <!-- Progress Steps -->
        <div class="timeline-track" style="margin-bottom:2.5rem; margin-top:0.5rem;">
          <div class="timeline-progress" style="width:${(currentStep - 1) * 33.3}%;"></div>
          
          <div class="timeline-step ${currentStep >= 1 ? (currentStep === 1 ? 'active' : 'completed') : ''}">
            <div class="step-icon">1</div>
            <span class="step-label">Account</span>
          </div>
          
          <div class="timeline-step ${currentStep >= 2 ? (currentStep === 2 ? 'active' : 'completed') : ''}">
            <div class="step-icon">2</div>
            <span class="step-label">Address</span>
          </div>
          
          <div class="timeline-step ${currentStep >= 3 ? (currentStep === 3 ? 'active' : 'completed') : ''}">
            <div class="step-icon">3</div>
            <span class="step-label">Payment</span>
          </div>
          
          <div class="timeline-step ${currentStep >= 4 ? (currentStep === 4 ? 'active' : 'completed') : ''}">
            <div class="step-icon">4</div>
            <span class="step-label">Success</span>
          </div>
        </div>

        ${currentStep === 1 ? `
          <div>
            <h4 style="margin-bottom:1rem;">Step 1: Express Sign-In</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
              <button class="btn btn-outline" id="googleLoginBtn" style="padding:0.9rem; font-size:0.9rem;">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                Continue with Google
              </button>
              <button class="btn btn-outline" style="padding:0.9rem; font-size:0.9rem;">📱 Continue with Phone OTP</button>
            </div>
            <div style="text-align:center; color:var(--pjr-steel-grey); margin:1rem 0; font-size:0.85rem;">OR USE EMAIL</div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" value="${store.user.email}" readonly />
            </div>
            <button class="btn btn-teal" id="step1Next" style="width:100%; margin-top:1rem;">Proceed To Saved Addresses →</button>
          </div>
        ` : ''}

        ${currentStep === 2 ? `
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
              <h4 style="margin:0;">Step 2: Select Delivery Address</h4>
              <button class="btn btn-teal" id="addNewAddrInCheckoutBtn" style="padding:0.4rem 0.9rem; font-size:0.8rem;">
                ➕ Add New Address & Pin
              </button>
            </div>

            <div style="display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem; max-height:360px; overflow-y:auto; padding-right:0.5rem;">
              ${addresses.map(a => renderAddressCard(a, true, selectedAddrId)).join('')}
            </div>

            <div style="display:flex; gap:1rem;">
              <button class="btn btn-outline" id="step2Back">Back</button>
              <button class="btn btn-teal" id="step2Next" style="flex:1;" ${!selectedAddrId ? 'disabled' : ''}>Proceed To Payment →</button>
            </div>
          </div>
        ` : ''}

        ${currentStep === 3 ? `
          <div>
            <h4 style="margin-bottom:0.5rem;">Step 3: Secure Razorpay Payment Gateway</h4>
            <p style="font-size:0.85rem; color:var(--pjr-danger); font-weight:600; margin-bottom:1rem;">
              ℹ️ Note: Cash On Delivery is disabled to guarantee express priority dispatch.
            </p>

            <div style="background:var(--pjr-bg-grey); padding:1rem; border-radius:var(--radius-sm); margin-bottom:1.5rem;">
              <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:800; color:var(--pjr-deep-navy);">
                <span>Total Payable Amount:</span>
                <span>₹${total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
              <label class="glass-card" style="padding:1rem; display:flex; align-items:center; gap:0.75rem; cursor:pointer;">
                <input type="radio" name="payOption" checked />
                <div>
                  <div style="font-weight:700; color:var(--pjr-deep-navy);">Razorpay Instant Gateway (UPI, GPay, PhonePe, Cards)</div>
                  <div style="font-size:0.8rem; color:var(--pjr-steel-grey);">Zero transaction fee + Instant confirmation</div>
                </div>
              </label>
            </div>

            <div style="display:flex; gap:1rem;">
              <button class="btn btn-outline" id="step3Back">Back</button>
              <button class="btn btn-primary" id="step3Pay" style="flex:1;">Pay ₹${total.toLocaleString('en-IN')} via Razorpay 🔒</button>
            </div>
          </div>
        ` : ''}

        ${currentStep === 4 ? `
          <div style="text-align:center; padding:1rem 0;">
            <div style="font-size:3.5rem; margin-bottom:0.5rem; animation:scaleUp 0.6s ease;">🎉</div>
            <h3 style="color:var(--pjr-deep-navy); margin-bottom:0.4rem;">Order Confirmed!</h3>
            <p style="font-size:0.95rem; color:var(--pjr-steel-grey); margin-bottom:1.5rem;">
              Thank you for shopping with PJR. Your Order ID is <strong>${store.activeOrder.orderId}</strong>.
            </p>
            <div style="display:flex; gap:1rem;">
              <button class="btn btn-teal" id="trackOrderSuccessBtn" style="flex:1;">Track Order Timeline 🚚</button>
              <button class="btn btn-outline" id="finishCheckoutBtn">Back To Store</button>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function initCheckoutEvents() {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'closeCheckoutModal' || e.target.id === 'checkoutModal') {
      store.closeModal();
      currentStep = 1;
      return;
    }

    if (e.target.id === 'step1Next' || e.target.id === 'googleLoginBtn') {
      currentStep = 2;
      store.notify();
      return;
    }

    if (e.target.id === 'addNewAddrInCheckoutBtn') {
      store.openModal('editAddress');
      return;
    }

    const addrCard = e.target.closest('#checkoutModal .address-card');
    if (addrCard) {
      const id = addrCard.dataset.addressId;
      store.selectedAddressId = id;
      store.notify();
      return;
    }

    if (e.target.id === 'step2Back') { currentStep = 1; store.notify(); return; }
    if (e.target.id === 'step2Next') { currentStep = 3; store.notify(); return; }
    if (e.target.id === 'step3Back') { currentStep = 2; store.notify(); return; }

    if (e.target.id === 'step3Pay') {
      e.target.textContent = 'Processing Payment... ⏳';
      setTimeout(() => {
        store.cart = [];
        currentStep = 4;
        store.notify();
      }, 1000);
      return;
    }

    if (e.target.id === 'trackOrderSuccessBtn') {
      currentStep = 1;
      store.openModal('account');
      return;
    }

    if (e.target.id === 'finishCheckoutBtn') {
      currentStep = 1;
      store.closeModal();
    }
  });
}
