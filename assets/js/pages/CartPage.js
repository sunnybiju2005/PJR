/* PJR Dedicated Cart Page Renderer */
import { store } from '../state.js';
import { renderAddressCard } from '../components/AddressManager.js';

export function renderCartPage() {
  const { subtotal, gst, shipping, total, itemCount } = store.getCartTotals();
  const freeShippingNeeded = Math.max(0, 1999 - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / 1999) * 100);
  const addresses = store.addresses;
  const selectedAddrId = store.selectedAddressId || (addresses[0] ? addresses[0].id : null);

  return `
    <div style="background:var(--pjr-deep-navy); color:var(--pjr-pure-white); padding:8rem 0 3.5rem; border-bottom:1px solid rgba(255,255,255,0.1);">
      <div class="container">
        <div style="font-size:0.85rem; color:var(--pjr-teal-light); margin-bottom:0.5rem; font-weight:600;">
          <a href="index.html" style="color:var(--pjr-teal-light); text-decoration:none;">Home</a> &nbsp;/&nbsp; Shopping Bag
        </div>
        <h1 style="color:var(--pjr-pure-white); margin-bottom:0.5rem; font-size:3rem;">Shopping Bag (${itemCount} items)</h1>
        <p style="color:rgba(255,255,255,0.85); max-width:600px; font-size:1.05rem;">
          Review your selection and proceed to secure Razorpay checkout.
        </p>
      </div>
    </div>

    <section class="section" style="background:var(--pjr-bg-grey); min-height:65vh;">
      <div class="container">
        ${store.cart.length === 0 ? `
          <div style="text-align:center; padding:5rem 1rem; background:var(--pjr-pure-white); border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
            <div style="font-size:3.5rem; margin-bottom:1rem;">🛍️</div>
            <h3 style="color:var(--pjr-deep-navy); margin-bottom:0.5rem;">Your bag is empty</h3>
            <p class="text-muted" style="margin-bottom:1.5rem;">Add perfect fit items to your bag.</p>
            <a href="mens.html" class="btn btn-teal">Shop Men</a>
            <a href="womens.html" class="btn btn-outline" style="margin-left:0.5rem;">Shop Women</a>
          </div>
        ` : `
          <div style="display:grid; grid-template-columns: 1fr 380px; gap:2.5rem; align-items:start;">
            <!-- Left: Cart Items & Delivery Address -->
            <div style="display:flex; flex-direction:column; gap:2rem;">
              
              <!-- Free Shipping Progress -->
              <div style="padding:1.25rem 1.5rem; background:var(--pjr-teal-soft); border-radius:var(--radius-md); border:1px solid rgba(0,108,110,0.15);">
                ${freeShippingNeeded === 0 ? `
                  <div style="font-size:0.95rem; font-weight:700; color:var(--pjr-teal); display:flex; align-items:center; gap:0.5rem;">
                    <span>🎉</span> You qualify for <strong>FREE Priority Express Shipping!</strong>
                  </div>
                ` : `
                  <div style="font-size:0.9rem; color:var(--pjr-dark-slate); margin-bottom:0.5rem;">
                    Add <strong>₹${freeShippingNeeded.toLocaleString('en-IN')}</strong> more to unlock <strong>FREE Shipping</strong>
                  </div>
                  <div style="height:8px; background:var(--pjr-light-grey); border-radius:4px; overflow:hidden;">
                    <div style="height:100%; width:${freeShippingProgress}%; background:var(--pjr-teal); transition:width 0.4s ease;"></div>
                  </div>
                `}
              </div>

              <!-- Cart Items List -->
              <div class="glass-card" style="padding:2rem; background:var(--pjr-pure-white);">
                <h3 style="margin-bottom:1.5rem; font-size:1.4rem;">Selected Items</h3>
                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                  ${store.cart.map((item, index) => `
                    <div style="display:flex; gap:1.25rem; padding-bottom:1.5rem; border-bottom:1px solid var(--pjr-light-grey); position:relative;">
                      <img src="${item.image}" alt="${item.title}" style="width:90px; height:115px; border-radius:var(--radius-xs); object-fit:cover; background:var(--pjr-bg-grey);" />
                      
                      <div style="flex:1;">
                        <h4 style="font-size:1.1rem; margin-bottom:0.4rem; padding-right:2rem;">${item.title}</h4>
                        <div style="font-size:0.88rem; color:var(--pjr-steel-grey); margin-bottom:0.75rem;">
                          Size: <span style="font-weight:700; color:var(--pjr-dark-slate);">${item.size}</span> | Color: <span style="font-weight:700; color:var(--pjr-dark-slate);">${item.color}</span>
                        </div>

                        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
                          <div style="display:flex; align-items:center; border:1px solid var(--pjr-light-grey); border-radius:var(--radius-full);">
                            <button class="cart-qty-btn" data-index="${index}" data-action="minus" style="padding:0.3rem 0.8rem; border:none; background:transparent; cursor:pointer; font-weight:700;">-</button>
                            <span style="font-size:0.95rem; font-weight:700; padding:0 0.8rem;">${item.quantity}</span>
                            <button class="cart-qty-btn" data-index="${index}" data-action="plus" style="padding:0.3rem 0.8rem; border:none; background:transparent; cursor:pointer; font-weight:700;">+</button>
                          </div>

                          <div style="font-size:1.2rem; font-weight:800; color:var(--pjr-deep-navy);">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        </div>
                      </div>

                      <button class="cart-remove-btn" data-index="${index}" style="position:absolute; top:0; right:0; border:none; background:transparent; cursor:pointer; color:var(--pjr-steel-grey); font-size:1.2rem;" title="Remove">✕</button>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Delivery Address Selection -->
              <div class="glass-card" style="padding:2rem; background:var(--pjr-pure-white);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
                  <h3 style="margin:0; font-size:1.4rem;">Select Delivery Address</h3>
                  <button class="btn btn-teal" id="cartAddAddrBtn" style="padding:0.4rem 0.9rem; font-size:0.8rem;">➕ Add Address & Pin</button>
                </div>
                <div style="display:grid; grid-template-columns: 1fr; gap:1rem;">
                  ${addresses.map(a => renderAddressCard(a, true, selectedAddrId)).join('')}
                </div>
              </div>

            </div>

            <!-- Right: Order Summary Sidebar -->
            <div class="glass-card" style="padding:2rem; background:var(--pjr-pure-white); position:sticky; top:100px;">
              <h3 style="margin-bottom:1.5rem; font-size:1.4rem; border-bottom:1px solid var(--pjr-light-grey); padding-bottom:0.75rem;">Order Summary</h3>

              <div style="display:flex; flex-direction:column; gap:0.85rem; font-size:0.95rem; margin-bottom:1.5rem;">
                <div style="display:flex; justify-content:space-between; color:var(--pjr-steel-grey);">
                  <span>Bag Subtotal</span>
                  <span style="font-weight:600; color:var(--pjr-dark-slate);">₹${subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style="display:flex; justify-content:space-between; color:var(--pjr-steel-grey);">
                  <span>Govt GST (18%)</span>
                  <span style="font-weight:600; color:var(--pjr-dark-slate);">₹${gst.toLocaleString('en-IN')}</span>
                </div>
                <div style="display:flex; justify-content:space-between; color:var(--pjr-steel-grey);">
                  <span>Express Shipping</span>
                  <span style="font-weight:700; color:var(--pjr-teal);">${shipping === 0 ? 'FREE' : '₹' + shipping}</span>
                </div>

                <div style="display:flex; justify-content:space-between; font-size:1.3rem; font-weight:800; color:var(--pjr-deep-navy); padding-top:1rem; border-top:1px dashed var(--pjr-light-grey); margin-top:0.5rem;">
                  <span>Grand Total</span>
                  <span>₹${total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button class="btn btn-primary" id="cartPageProceedCheckout" style="width:100%; padding:1.1rem; font-size:1.05rem;">
                Proceed To Razorpay 🔒
              </button>
            </div>
          </div>
        `}
      </div>
    </section>
  `;
}

export function initCartPageEvents() {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'cartPageProceedCheckout') {
      store.openModal('checkout');
    }
    if (e.target.id === 'cartAddAddrBtn') {
      store.openModal('editAddress');
    }
  });
}
