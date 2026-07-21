/* PJR Customer Account & Multi-Address Management Hub Component */
import { store } from '../state.js';
import { PRODUCTS } from '../mockData.js';
import { renderAddressCard } from './AddressManager.js';

let activeTab = 'addresses'; // 'orders', 'addresses', 'wishlist', 'profile'

export function renderAccountModal() {
  const isOpen = store.activeModal === 'account';
  if (!isOpen) return `<div class="modal-overlay" id="accountModal"></div>`;

  const order = store.activeOrder;
  const addresses = store.addresses;
  const wishlistProducts = PRODUCTS.filter(p => store.wishlist.includes(p.id));

  const steps = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
  const currentStepIndex = steps.indexOf(order.status);
  const progressPercent = (currentStepIndex / (steps.length - 1)) * 100;

  return `
    <div class="modal-overlay active" id="accountModal">
      <div class="modal-content" style="max-width:920px; padding:0; overflow:hidden;">
        <button class="close-btn" id="closeAccountModal" style="position:absolute; top:1.25rem; right:1.25rem; z-index:20;">✕</button>

        <div style="display:grid; grid-template-columns:230px 1fr; min-height:580px;">
          <!-- Sidebar -->
          <div style="background:var(--pjr-deep-navy); padding:2rem 1.5rem; color:var(--pjr-pure-white); display:flex; flex-direction:column;">
            <div style="margin-bottom:2rem;">
              <div style="width:56px; height:56px; border-radius:50%; background:var(--pjr-teal); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.4rem; margin-bottom:0.75rem;">
                ${store.user.name[0]}
              </div>
              <h4 style="color:var(--pjr-pure-white); margin-bottom:0.1rem; font-size:1.05rem;">${store.user.name}</h4>
              <span style="font-size:0.75rem; color:var(--pjr-teal-light);">VIP Tier Member</span>
            </div>

            <nav style="display:flex; flex-direction:column; gap:0.5rem;">
              <button class="tab-nav-btn ${activeTab === 'addresses' ? 'active' : ''}" data-tab="addresses">📍 Delivery Addresses (${addresses.length})</button>
              <button class="tab-nav-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders">📦 My Orders</button>
              <button class="tab-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}" data-tab="wishlist">❤️ Wishlist (${wishlistProducts.length})</button>
              <button class="tab-nav-btn ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">👤 Profile Details</button>
            </nav>

            <button class="btn btn-outline-white" style="margin-top:auto; font-size:0.85rem; padding:0.6rem;">Logout</button>
          </div>

          <!-- Main Panel -->
          <div style="padding:2.5rem; overflow-y:auto; max-height:88vh;">
            ${activeTab === 'addresses' ? `
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                  <div>
                    <span class="section-subtitle">AMAZON & FLIPKART STYLE</span>
                    <h3 style="margin:0;">Saved Delivery Addresses</h3>
                  </div>

                  <button class="btn btn-teal" id="accountAddNewAddrBtn" style="padding:0.6rem 1.1rem; font-size:0.88rem;">
                    ➕ Add New Address & Map Pin
                  </button>
                </div>

                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
                  ${addresses.map(a => renderAddressCard(a)).join('')}
                </div>
              </div>
            ` : ''}

            ${activeTab === 'orders' ? `
              <div>
                <span class="section-subtitle">LIVE ORDER TRACKING</span>
                <h3 style="margin-bottom:1.5rem;">Order #${order.orderId}</h3>

                <div style="background:var(--pjr-bg-grey); padding:1.75rem; border-radius:var(--radius-md); border:1px solid var(--pjr-light-grey); margin-bottom:2rem;">
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
                <div class="grid-2">
                  ${wishlistProducts.map(p => `
                    <div style="display:flex; gap:0.75rem; border:1px solid var(--pjr-light-grey); border-radius:var(--radius-sm); padding:0.75rem;">
                      <img src="${p.images[0]}" style="width:60px; height:75px; object-fit:cover; border-radius:4px;" />
                      <div>
                        <h5 style="font-size:0.9rem; margin-bottom:0.25rem;">${p.title}</h5>
                        <span style="font-weight:700; color:var(--pjr-deep-navy);">₹${p.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${activeTab === 'profile' ? `
              <div>
                <h3 style="margin-bottom:1.5rem;">Account Profile</h3>
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-input" value="${store.user.name}" />
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

export function initAccountEvents() {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'closeAccountModal' || e.target.id === 'accountModal') {
      store.closeModal();
      return;
    }

    const tabBtn = e.target.closest('.tab-nav-btn');
    if (tabBtn) {
      activeTab = tabBtn.dataset.tab;
      store.notify();
      return;
    }

    if (e.target.id === 'accountAddNewAddrBtn') {
      store.openModal('editAddress');
    }
  });
}
