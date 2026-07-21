/* PJR Comprehensive Product Detail & Quick View Modal */
import { store } from '../state.js';
import { MOCK_REVIEWS } from '../mockData.js';

export function renderProductModal() {
  const product = store.selectedProduct;
  const isOpen = store.activeModal === 'quickView' && product;

  if (!isOpen) return `<div class="modal-overlay" id="productModal"></div>`;

  const isWishlist = store.isInWishlist(product.id);

  return `
    <div class="modal-overlay active" id="productModal">
      <div class="modal-content" style="padding:0; overflow:hidden;">
        <button class="close-btn" id="closeProductModal" style="position:absolute; top:1.25rem; right:1.25rem; z-index:20; background:rgba(255,255,255,0.8); width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center;">✕</button>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));">
          <!-- Gallery -->
          <div style="background:var(--pjr-bg-grey); padding:2rem; display:flex; flex-direction:column; gap:1rem;">
            <div style="aspect-ratio:3/4; border-radius:var(--radius-md); overflow:hidden; box-shadow:var(--shadow-sm); position:relative;">
              <img id="mainProductImg" src="${product.images[0]}" alt="${product.title}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.3s ease;" />
              ${product.discount ? `<span class="badge badge-discount" style="position:absolute; top:1rem; left:1rem;">-${product.discount}% OFF</span>` : ''}
            </div>

            <div style="display:flex; gap:0.75rem; overflow-x:auto; padding-bottom:0.5rem;">
              ${product.images.map((img, idx) => `
                <button class="thumb-btn ${idx === 0 ? 'active' : ''}" data-img-src="${img}" style="width:64px; height:80px; border-radius:var(--radius-xs); border:2px solid ${idx === 0 ? 'var(--pjr-teal)' : 'transparent'}; overflow:hidden; cursor:pointer; padding:0; flex-shrink:0;">
                  <img src="${img}" style="width:100%; height:100%; object-fit:cover;" />
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Product Details -->
          <div style="padding:2.5rem; display:flex; flex-direction:column;">
            <span class="product-brand">${product.brand}</span>
            <h2 style="font-size:1.8rem; margin-bottom:0.5rem; color:var(--pjr-deep-navy);">${product.title}</h2>
            
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem;">
              <div class="rating-stars">★★★★★</div>
              <span style="font-weight:600; color:var(--pjr-dark-slate);">${product.rating}</span>
              <span style="color:var(--pjr-steel-grey); font-size:0.9rem;">(${product.reviewsCount} verified reviews)</span>
            </div>

            <div style="display:flex; align-items:baseline; gap:1rem; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--pjr-light-grey);">
              <span style="font-size:1.8rem; font-weight:800; color:var(--pjr-deep-navy);">₹${product.price.toLocaleString('en-IN')}</span>
              ${product.originalPrice ? `<span style="font-size:1.1rem; text-decoration:line-through; color:var(--pjr-steel-grey);">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
              <span style="font-size:0.85rem; color:var(--pjr-teal); font-weight:700;">Inclusive of all taxes</span>
            </div>

            <!-- Stock alert -->
            <div style="margin-bottom:1.25rem; font-size:0.85rem; color:var(--pjr-warning); font-weight:600; display:flex; align-items:center; gap:0.5rem;">
              <span>⚠️</span>
              <span>Only ${product.stock} items left in stock - order soon!</span>
            </div>

            <!-- Size Picker -->
            <div style="margin-bottom:1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <label class="form-label" style="margin:0;">Select Size (PJR Perfect Fit System)</label>
                <a href="javascript:void(0)" style="font-size:0.8rem; color:var(--pjr-teal); font-weight:600; text-decoration:none;">Size Guide 📐</a>
              </div>
              <div class="size-picker" id="modalSizePicker">
                ${product.sizes.map((s, i) => `
                  <button class="size-btn ${i === 1 || product.sizes.length === 1 ? 'active' : ''}" data-size="${s}">${s}</button>
                `).join('')}
              </div>
            </div>

            <!-- Color Swatches -->
            <div style="margin-bottom:1.5rem;">
              <label class="form-label">Color Variant</label>
              <div class="color-picker" id="modalColorPicker">
                ${product.colors.map((c, i) => `
                  <div class="color-dot ${i === 0 ? 'active' : ''}" data-color="${c.name}" style="background:${c.hex};" title="${c.name}"></div>
                `).join('')}
              </div>
            </div>

            <!-- Quantity Selector -->
            <div style="margin-bottom:2rem; display:flex; align-items:center; gap:1rem;">
              <label class="form-label" style="margin:0;">Quantity</label>
              <div style="display:flex; align-items:center; border:1px solid var(--pjr-light-grey); border-radius:var(--radius-full); overflow:hidden;">
                <button id="modalQtyMinus" style="padding:0.4rem 0.8rem; border:none; background:transparent; cursor:pointer; font-weight:700;">-</button>
                <span id="modalQtyVal" style="padding:0 0.8rem; font-weight:700; font-size:0.95rem;">1</span>
                <button id="modalQtyPlus" style="padding:0.4rem 0.8rem; border:none; background:transparent; cursor:pointer; font-weight:700;">+</button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display:flex; gap:1rem; margin-top:auto;">
              <button class="btn btn-teal" id="modalAddToCart" style="flex:1;">
                Add To Cart
              </button>
              <button class="btn btn-primary" id="modalBuyNow" style="flex:1;">
                Buy Now
              </button>
            </div>

            <!-- Specs & Reviews Tabs -->
            <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--pjr-light-grey);">
              <h4 style="font-size:1rem; margin-bottom:0.75rem;">Fabric & Care Specifications</h4>
              <ul style="font-size:0.88rem; color:var(--pjr-steel-grey); padding-left:1.2rem; display:flex; flex-direction:column; gap:0.4rem;">
                ${Object.entries(product.specifications || {}).map(([k, v]) => `
                  <li><strong>${k}:</strong> ${v}</li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initProductModalEvents() {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'closeProductModal' || e.target.id === 'productModal') {
      store.closeModal();
      return;
    }

    const thumb = e.target.closest('.thumb-btn');
    if (thumb) {
      document.querySelectorAll('.thumb-btn').forEach(b => b.style.borderColor = 'transparent');
      thumb.style.borderColor = 'var(--pjr-teal)';
      const mainImg = document.getElementById('mainProductImg');
      if (mainImg) mainImg.src = thumb.dataset.imgSrc;
      return;
    }

    const sizeBtn = e.target.closest('#modalSizePicker .size-btn');
    if (sizeBtn) {
      document.querySelectorAll('#modalSizePicker .size-btn').forEach(b => b.classList.remove('active'));
      sizeBtn.classList.add('active');
      return;
    }

    const colorDot = e.target.closest('#modalColorPicker .color-dot');
    if (colorDot) {
      document.querySelectorAll('#modalColorPicker .color-dot').forEach(b => b.classList.remove('active'));
      colorDot.classList.add('active');
      return;
    }

    if (e.target.id === 'modalQtyMinus') {
      const el = document.getElementById('modalQtyVal');
      let val = parseInt(el.textContent, 10);
      if (val > 1) el.textContent = val - 1;
      return;
    }

    if (e.target.id === 'modalQtyPlus') {
      const el = document.getElementById('modalQtyVal');
      let val = parseInt(el.textContent, 10);
      el.textContent = val + 1;
      return;
    }

    if (e.target.id === 'modalAddToCart' || e.target.id === 'modalBuyNow') {
      const product = store.selectedProduct;
      if (!product) return;
      const activeSize = document.querySelector('#modalSizePicker .size-btn.active')?.dataset.size || 'M';
      const activeColor = document.querySelector('#modalColorPicker .color-dot.active')?.dataset.color || 'Default';
      const qty = parseInt(document.getElementById('modalQtyVal')?.textContent || '1', 10);

      store.addToCart(product, activeSize, activeColor, qty);

      if (e.target.id === 'modalBuyNow') {
        store.openModal('checkout');
      } else {
        store.openModal('cart');
      }
    }
  });
}
