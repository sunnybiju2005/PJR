/* PJR Dedicated Customer Profile & Address Management Page */
import { store } from '../state.js';
import { PRODUCTS } from '../mockData.js';
import { renderAddressCard } from '../components/AddressManager.js';
import { auth, signOut } from '../firebaseConfig.js';

let activeProfileTab = 'addresses'; // 'addresses', 'orders', 'wishlist', 'settings'

export function renderProfilePage() {
  const user = store.user;

  // Guard: if not logged in, show a prompt to sign in
  if (!user.isLoggedIn) {
    return `
      <div style="min-height:80vh; display:flex; align-items:center; justify-content:center; background:var(--pjr-bg-grey);">
        <div style="text-align:center; padding:3rem;">
          <div style="font-size:4rem; margin-bottom:1rem;">🔐</div>
          <h2 style="margin-bottom:0.5rem;">Please Sign In</h2>
          <p style="color:var(--pjr-steel-grey); margin-bottom:1.5rem;">You need to be logged in to view your profile.</p>
          <button class="btn btn-teal" id="profileSignInBtn" style="padding:0.85rem 2rem; font-size:1rem;">Sign In to PJR</button>
        </div>
      </div>
    `;
  }

  const addresses = store.addresses;
  const order = store.activeOrder;
  const wishlistProducts = PRODUCTS.filter(p => store.wishlist.includes(p.id));

  const steps = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
  const currentStepIndex = steps.indexOf(order.status);
  const progressPercent = (currentStepIndex / (steps.length - 1)) * 100;


  return `
    <!-- Header Banner -->
    <div style="background:var(--pjr-deep-navy); color:var(--pjr-pure-white); padding:8rem 0 3rem; border-bottom:1px solid rgba(255,255,255,0.1);">
      <div class="container" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.5rem;">
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <div style="width:68px; height:68px; border-radius:50%; background:var(--pjr-teal); color:var(--pjr-pure-white); display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:800; box-shadow:var(--shadow-teal-glow);">
            ${user.name[0]}
          </div>
          <div>
            <h1 style="color:var(--pjr-pure-white); font-size:2.2rem; margin:0 0 0.2rem;">${user.name}</h1>
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <span class="badge badge-teal">VIP Tier Member</span>
              <span style="font-size:0.88rem; color:rgba(255,255,255,0.7);">${user.email}</span>
            </div>
          </div>
        </div>

        <button class="btn btn-teal" id="pageAddNewAddressBtn" style="padding:0.75rem 1.4rem;">
          ➕ Add New Address & Map Pin
        </button>
      </div>
    </div>

    <!-- Main Profile Content Area -->
    <section class="section" style="background:var(--pjr-bg-grey); min-height:65vh;">
      <div class="container">
        <div style="display:grid; grid-template-columns: 260px 1fr; gap:2.5rem; align-items:start;">
          
          <!-- Sleek Sidebar Navigation -->
          <div class="glass-card" style="padding:1.25rem; background:var(--pjr-deep-navy); color:var(--pjr-pure-white);">
            <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.15em; color:var(--pjr-teal-light); font-weight:700; margin-bottom:1rem; padding-left:0.5rem;">
              ACCOUNT MENU
            </div>

            <nav style="display:flex; flex-direction:column; gap:0.5rem;">
              <button class="profile-nav-btn ${activeProfileTab === 'addresses' ? 'active' : ''}" data-profile-tab="addresses">
                📍 Saved Addresses (${addresses.length})
              </button>
              <button class="profile-nav-btn ${activeProfileTab === 'orders' ? 'active' : ''}" data-profile-tab="orders">
                📦 Order Tracking
              </button>
              <button class="profile-nav-btn ${activeProfileTab === 'wishlist' ? 'active' : ''}" data-profile-tab="wishlist">
                ❤️ Saved Wishlist (${wishlistProducts.length})
              </button>
              <button class="profile-nav-btn ${activeProfileTab === 'settings' ? 'active' : ''}" data-profile-tab="settings">
                👤 Profile Settings
              </button>
            </nav>

            <button class="btn btn-outline-white" id="profileLogoutBtn" style="width:100%; margin-top:2rem; font-size:0.85rem; padding:0.6rem;">
              Logout Account
            </button>
          </div>

          <style>
            .profile-nav-btn {
              background: transparent !important;
              border: none !important;
              color: rgba(255,255,255,0.75) !important;
              padding: 0.85rem 1rem !important;
              text-align: left !important;
              border-radius: var(--radius-sm) !important;
              font-size: 0.92rem !important;
              font-weight: 600 !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
              display: flex !important;
              align-items: center !important;
              gap: 0.6rem !important;
            }
            .profile-nav-btn:hover, .profile-nav-btn.active {
              background: rgba(0, 108, 110, 0.3) !important;
              color: var(--pjr-pure-white) !important;
              transform: translateX(4px);
            }
            .profile-nav-btn.active {
              border-left: 3px solid var(--pjr-teal) !important;
              background: var(--pjr-teal) !important;
            }
          </style>

          <!-- Right Content Panel -->
          <div class="glass-card" style="padding:2.5rem; background:var(--pjr-pure-white);">
            ${activeProfileTab === 'addresses' ? `
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.75rem; padding-bottom:1rem; border-bottom:1px solid var(--pjr-light-grey);">
                  <div>
                    <span class="section-subtitle">AMAZON & FLIPKART STYLE</span>
                    <h2 style="margin:0; font-size:1.8rem;">Saved Delivery Addresses</h2>
                  </div>

                  <button class="btn btn-teal" id="pageAddNewAddressBtn2" style="padding:0.6rem 1.1rem; font-size:0.85rem;">
                    ➕ Add New Address & Map Pin
                  </button>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
                  ${addresses.map(a => renderAddressCard(a)).join('')}
                </div>
              </div>
            ` : ''}

            ${activeProfileTab === 'orders' ? `
              <div>
                <span class="section-subtitle">LIVE REALTIME TRACKING</span>
                <h2 style="margin-bottom:1.5rem; font-size:1.8rem;">Order #${order.orderId}</h2>

                <div style="background:var(--pjr-bg-grey); padding:2rem; border-radius:var(--radius-md); border:1px solid var(--pjr-light-grey); margin-bottom:2rem;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; font-size:0.9rem; flex-wrap:wrap; gap:0.5rem;">
                    <span>Order Date: <strong>${order.date}</strong></span>
                    <span style="color:var(--pjr-teal); font-weight:700;">Express Dispatch Priority</span>
                  </div>

                  <div class="timeline-track" style="margin:2.5rem 0;">
                    <div class="timeline-progress" style="width:${progressPercent}%;"></div>
                    <div class="timeline-step ${currentStepIndex >= 0 ? 'completed' : ''}"><div class="step-icon">1</div><span class="step-label">Placed</span></div>
                    <div class="timeline-step ${currentStepIndex >= 1 ? 'completed' : ''}"><div class="step-icon">2</div><span class="step-label">Confirmed</span></div>
                    <div class="timeline-step ${currentStepIndex >= 2 ? 'completed' : ''}"><div class="step-icon">3</div><span class="step-label">Packed</span></div>
                    <div class="timeline-step ${currentStepIndex >= 3 ? 'active' : ''}"><div class="step-icon">4</div><span class="step-label">Shipped</span></div>
                    <div class="timeline-step ${currentStepIndex >= 4 ? 'completed' : ''}"><div class="step-icon">5</div><span class="step-label">Delivered</span></div>
                  </div>

                  <div style="font-size:0.9rem; color:var(--pjr-steel-grey); border-top:1px solid var(--pjr-light-grey); padding-top:1rem; margin-top:1rem;">
                    <strong>Destination Address:</strong> ${order.address || (addresses[0] ? addresses[0].fullAddress : '')}
                  </div>
                </div>

                <h4 style="margin-bottom:1rem;">Order Items</h4>
                <div style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${order.items.map(item => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; background:var(--pjr-pure-white); border:1px solid var(--pjr-light-grey); border-radius:var(--radius-sm);">
                      <div>
                        <div style="font-weight:700; color:var(--pjr-deep-navy); font-size:1rem;">${item.title}</div>
                        <div style="font-size:0.85rem; color:var(--pjr-steel-grey);">Quantity: ${item.qty}</div>
                      </div>
                      <span style="font-weight:800; color:var(--pjr-teal); font-size:1.1rem;">₹${item.price.toLocaleString('en-IN')}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${activeProfileTab === 'wishlist' ? `
              <div>
                <h2 style="margin-bottom:1.5rem; font-size:1.8rem;">Saved Wishlist</h2>
                ${wishlistProducts.length === 0 ? `
                  <p class="text-muted">Your wishlist is empty.</p>
                ` : `
                  <div class="grid-2">
                    ${wishlistProducts.map(p => `
                      <div style="display:flex; gap:1rem; border:1px solid var(--pjr-light-grey); border-radius:var(--radius-md); padding:1rem; background:var(--pjr-pure-white);">
                        <img src="${p.images[0]}" style="width:80px; height:100px; object-fit:cover; border-radius:var(--radius-xs);" />
                        <div style="flex:1;">
                          <div style="font-size:0.75rem; color:var(--pjr-teal); font-weight:700;">${p.brand}</div>
                          <h4 style="font-size:1rem; margin-bottom:0.4rem;">${p.title}</h4>
                          <div style="font-weight:800; color:var(--pjr-deep-navy); margin-bottom:0.75rem;">₹${p.price.toLocaleString('en-IN')}</div>
                          <button class="btn btn-teal add-cart-btn" data-cart-id="${p.id}" style="padding:0.4rem 0.8rem; font-size:0.8rem;">Move to Bag 🛍️</button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>
            ` : ''}

            ${activeProfileTab === 'settings' ? `
              <div>
                <h2 style="margin-bottom:1.5rem; font-size:1.8rem;">Personal Profile Settings</h2>
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-input" value="${user.name}" />
                </div>
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-input" value="${user.email}" readonly />
                </div>
                <div class="form-group">
                  <label class="form-label">Mobile Number</label>
                  <input type="text" class="form-input" value="+91 98765 43210" />
                </div>
                <button class="btn btn-primary" style="margin-top:1rem;">Save Profile Changes</button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initProfilePageEvents() {
  document.addEventListener('click', async (e) => {
    const navBtn = e.target.closest('.profile-nav-btn');
    if (navBtn) {
      activeProfileTab = navBtn.dataset.profileTab;
      store.notify();
      return;
    }

    if (e.target.id === 'pageAddNewAddressBtn' || e.target.id === 'pageAddNewAddressBtn2') {
      store.openModal('editAddress');
    }

    if (e.target.id === 'profileLogoutBtn') {
      try {
        await signOut(auth);
        store.logout();
      } catch (err) {
        console.error('Logout error:', err);
      }
      window.location.hash = '#home';
    }

    if (e.target.id === 'profileSignInBtn') {
      store.openModal('account');
    }
  });
}
