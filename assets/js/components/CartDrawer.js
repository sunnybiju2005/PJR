/* PJR Live Slide-Over Cart Drawer Component */
import { store } from '../state.js';

export function renderCartDrawer() {
  const isOpen = store.activeModal === 'cart';
  const { subtotal, gst, shipping, total, itemCount } = store.getCartTotals();
  const freeShippingNeeded = Math.max(0, 1999 - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / 1999) * 100);

  return `
    <div class="drawer-overlay ${isOpen ? 'active' : ''}" id="cartDrawerOverlay">
      <div class="drawer-content" id="cartDrawer">
        <div class="drawer-header">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <svg width="22" height="22" fill="none" stroke="var(--pjr-deep-navy)" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <h3 style="margin:0; font-size:1.3rem;">Shopping Bag (${itemCount})</h3>
          </div>
          <button class="close-btn" id="closeCartDrawer">✕</button>
        </div>

        <div style="padding:1rem 1.5rem; background:var(--pjr-teal-soft); border-bottom:1px solid rgba(0,108,110,0.15);">
          ${freeShippingNeeded === 0 ? `
            <div style="font-size:0.85rem; font-weight:700; color:var(--pjr-teal); display:flex; align-items:center; gap:0.4rem;">
              <span>🎉</span> You qualify for <strong>FREE Express Express Delivery!</strong>
            </div>
          ` : `
            <div style="font-size:0.85rem; color:var(--pjr-dark-slate); margin-bottom:0.4rem;">
              Add <strong>₹${freeShippingNeeded.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong>
            </div>
            <div style="height:6px; background:var(--pjr-light-grey); border-radius:3px; overflow:hidden;">
              <div style="height:100%; width:${freeShippingProgress}%; background:var(--pjr-teal); transition:width 0.4s ease;"></div>
            </div>
          `}
        </div>

        <div class="drawer-body">
          ${store.cart.length === 0 ? `
            <div style="text-align:center; padding:4rem 1rem; color:var(--pjr-steel-grey);">
              <div style="font-size:3rem; margin-bottom:1rem;">🛍️</div>
              <h4 style="margin-bottom:0.5rem; color:var(--pjr-deep-navy);">Your bag is empty</h4>
              <p style="font-size:0.9rem; margin-bottom:1.5rem;">Discover perfect fit pieces in our new collection.</p>
              <button class="btn btn-teal" id="cartShopNow">Explore Catalog</button>
            </div>
          ` : `
            <div style="display:flex; flex-direction:column; gap:1.25rem;">
              ${store.cart.map((item, index) => `
                <div style="display:flex; gap:1rem; padding-bottom:1.25rem; border-bottom:1px solid var(--pjr-light-grey); position:relative;">
                  <img src="${item.image}" alt="${item.title}" style="width:72px; height:90px; border-radius:var(--radius-xs); object-fit:cover; background:var(--pjr-bg-grey);" />
                  
                  <div style="flex:1;">
                    <h5 style="font-size:0.95rem; margin-bottom:0.25rem; padding-right:1.5rem;">${item.title}</h5>
                    <div style="font-size:0.8rem; color:var(--pjr-steel-grey); margin-bottom:0.5rem;">
                      Size: <span style="font-weight:600; color:var(--pjr-dark-slate);">${item.size}</span> | Color: <span style="font-weight:600; color:var(--pjr-dark-slate);">${item.color}</span>
                    </div>
                    
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                      <div style="display:flex; align-items:center; border:1px solid var(--pjr-light-grey); border-radius:var(--radius-full);">
                        <button class="cart-qty-btn" data-index="${index}" data-action="minus" style="padding:0.2rem 0.6rem; border:none; background:transparent; cursor:pointer;">-</button>
                        <span style="font-size:0.85rem; font-weight:700; padding:0 0.5rem;">${item.quantity}</span>
                        <button class="cart-qty-btn" data-index="${index}" data-action="plus" style="padding:0.2rem 0.6rem; border:none; background:transparent; cursor:pointer;">+</button>
                      </div>

                      <span style="font-weight:700; color:var(--pjr-deep-navy);">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button class="cart-remove-btn" data-index="${index}" style="position:absolute; top:0; right:0; border:none; background:transparent; cursor:pointer; color:var(--pjr-steel-grey); font-size:1.1rem;" title="Remove item">✕</button>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        ${store.cart.length > 0 ? `
          <div class="drawer-footer">
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.25rem; font-size:0.9rem;">
              <div style="display:flex; justify-content:space-between; color:var(--pjr-steel-grey);">
                <span>Bag Subtotal</span>
                <span style="font-weight:600; color:var(--pjr-dark-slate);">₹${subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style="display:flex; justify-content:space-between; color:var(--pjr-steel-grey);">
                <span>GST (18% Govt Tax)</span>
                <span style="font-weight:600; color:var(--pjr-dark-slate);">₹${gst.toLocaleString('en-IN')}</span>
              </div>
              <div style="display:flex; justify-content:space-between; color:var(--pjr-steel-grey);">
                <span>Express Shipping</span>
                <span style="font-weight:600; color:var(--pjr-teal);">${shipping === 0 ? 'FREE' : '₹' + shipping}</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:1.15rem; font-weight:800; color:var(--pjr-deep-navy); padding-top:0.75rem; border-top:1px dashed var(--pjr-light-grey);">
                <span>Total Amount</span>
                <span>₹${total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button class="btn btn-primary" id="cartProceedCheckout" style="width:100%; padding:1rem; font-size:1.05rem;">
              Proceed To Secure Checkout 🔒
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function initCartEvents() {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'closeCartDrawer' || e.target.id === 'cartDrawerOverlay') {
      store.closeModal();
      return;
    }

    if (e.target.id === 'cartShopNow') {
      store.closeModal();
      document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const qtyBtn = e.target.closest('.cart-qty-btn');
    if (qtyBtn) {
      const idx = parseInt(qtyBtn.dataset.index, 10);
      const action = qtyBtn.dataset.action;
      const currentQty = store.cart[idx].quantity;
      store.updateCartQty(idx, action === 'plus' ? currentQty + 1 : currentQty - 1);
      return;
    }

    const removeBtn = e.target.closest('.cart-remove-btn');
    if (removeBtn) {
      const idx = parseInt(removeBtn.dataset.index, 10);
      store.removeFromCart(idx);
      return;
    }

    if (e.target.id === 'cartProceedCheckout') {
      store.openModal('checkout');
    }
  });
}
