/* PJR Comprehensive Product Detail & Quick View Modal + Size Guide Popup */
import { store } from '../state.js';

export function renderProductModal() {
  const product = store.selectedProduct;
  const isOpen = store.activeModal === 'quickView' && product;

  // Determine if product is Women's or Men's for Size Guide Image
  const isWomen = product ? (
    (product.gender || '').toLowerCase().includes('women') ||
    (product.category || '').toLowerCase().includes('women')
  ) : false;

  const sizeGuideImage = isWomen
    ? 'https://res.cloudinary.com/n4jw90yo/image/upload/v1784750886/hazdz4qxiawtlpmddcxv.png'
    : 'https://res.cloudinary.com/n4jw90yo/image/upload/v1784750885/or9ddprei2pgbynbe99b.png';

  const sizeGuideTitle = isWomen ? "Women's Fit & Size Guide" : "Men's Fit & Size Guide";

  // Size Guide Popup Modal HTML
  const sizeGuideModalHtml = `
    <div class="modal-overlay" id="sizeGuideModal" style="z-index:1400;">
      <div class="modal-content" style="max-width:650px; width:92%; max-height:90vh; border-radius:var(--radius-md); padding:1.5rem; background:var(--pjr-pure-white); position:relative; overflow-y:auto; box-shadow:0 15px 35px rgba(0,0,0,0.3); margin:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-bottom:0.75rem; border-bottom:1px solid var(--pjr-light-grey);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.2rem;">📐</span>
            <h3 style="margin:0; font-size:1.2rem; color:var(--pjr-deep-navy);" id="sizeGuideModalHeading">${sizeGuideTitle}</h3>
          </div>
          <button class="close-btn" id="closeSizeGuideModal" style="background:var(--pjr-bg-grey); border:none; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.1rem; color:var(--pjr-deep-navy);" title="Close Size Guide">✕</button>
        </div>
        <div style="text-align:center; padding:0.5rem 0;">
          <img id="sizeGuideModalImg" src="${sizeGuideImage}" alt="${sizeGuideTitle}" style="width:100%; height:auto; max-height:70vh; object-fit:contain; border-radius:var(--radius-xs); display:block; margin:0 auto;" />
        </div>
      </div>
    </div>
  `;

  if (!isOpen) return `<div class="modal-overlay" id="productModal"></div>${sizeGuideModalHtml}`;

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

            <!-- Size Picker & Size Guide Button -->
            <div style="margin-bottom:1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <label class="form-label" style="margin:0;">Select Size (PJR Perfect Fit System)</label>
                <button type="button" id="openSizeGuideBtn" class="open-size-guide-btn" style="font-size:0.82rem; color:var(--pjr-teal); font-weight:600; text-decoration:none; background:none; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:0.25rem;">
                  📐 <span>Size Guide</span>
                </button>
              </div>
              <div class="size-picker" id="modalSizePicker">
                ${product.sizes.map((s, i) => `
                  <button class="size-btn ${i === 1 || product.sizes.length === 1 ? 'active' : ''}" data-size="${s}">${s}</button>
                `).join('')}
              </div>
            </div>

            <!-- Color Swatches -->
            <div style="margin-bottom:1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <label class="form-label" style="margin:0;">Color Variant: <span id="selectedColorLabel" style="font-weight:700; color:var(--pjr-teal);">${product.colors[0]?.name || 'Default'}</span></label>
              </div>
              <div class="color-picker" id="modalColorPicker" style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center;">
                ${product.colors.map((c, i) => `
                  <button type="button"
                          class="color-dot ${i === 0 ? 'active' : ''}"
                          data-color-name="${c.name}"
                          data-color-hex="${c.hex}"
                          style="background:${c.hex}; width:32px; height:32px; border-radius:50%; cursor:pointer; padding:0; outline:none; transition:all 0.2s ease; border:${i === 0 ? '2px solid var(--pjr-teal)' : (c.hex.toLowerCase() === '#ffffff' || c.hex.toLowerCase() === 'white' ? '1px solid #ccc' : '2px solid transparent')}; box-shadow:${i === 0 ? '0 0 0 2px var(--pjr-teal-soft)' : '0 2px 5px rgba(0,0,0,0.15)'};"
                          title="${c.name}">
                  </button>
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

    ${sizeGuideModalHtml}
  `;
}

export function initProductModalEvents() {
  document.addEventListener('click', (e) => {
    // Open Size Guide Modal
    const sizeGuideBtn = e.target.closest('#openSizeGuideBtn, .open-size-guide-btn');
    if (sizeGuideBtn) {
      e.preventDefault();
      e.stopPropagation();
      const product = store.selectedProduct;
      const isWomen = product ? (
        (product.gender || '').toLowerCase().includes('women') ||
        (product.category || '').toLowerCase().includes('women')
      ) : false;

      const imgUrl = isWomen
        ? 'https://res.cloudinary.com/n4jw90yo/image/upload/v1784750886/hazdz4qxiawtlpmddcxv.png'
        : 'https://res.cloudinary.com/n4jw90yo/image/upload/v1784750885/or9ddprei2pgbynbe99b.png';

      const heading = isWomen ? "Women's Fit & Size Guide" : "Men's Fit & Size Guide";

      const modal = document.getElementById('sizeGuideModal');
      const modalImg = document.getElementById('sizeGuideModalImg');
      const modalHeading = document.getElementById('sizeGuideModalHeading');

      if (modal) {
        if (modalImg) modalImg.src = imgUrl;
        if (modalHeading) modalHeading.textContent = heading;
        modal.classList.add('active');
      }
      return;
    }

    // Close Size Guide Modal (X button or outside click)
    if (e.target.id === 'closeSizeGuideModal' || e.target.id === 'sizeGuideModal') {
      const modal = document.getElementById('sizeGuideModal');
      if (modal) modal.classList.remove('active');
      return;
    }

    // Close Product Quick View Modal
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
      document.querySelectorAll('#modalColorPicker .color-dot').forEach(b => {
        b.classList.remove('active');
        const hx = b.dataset.colorHex || '';
        b.style.borderColor = (hx.toLowerCase() === '#ffffff' || hx.toLowerCase() === 'white') ? '#ccc' : 'transparent';
        b.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
      });
      colorDot.classList.add('active');
      colorDot.style.borderColor = 'var(--pjr-teal)';
      colorDot.style.boxShadow = '0 0 0 2px var(--pjr-teal-soft)';

      const colorLabel = document.getElementById('selectedColorLabel');
      if (colorLabel) colorLabel.textContent = colorDot.dataset.colorName || '';
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
      const activeColor = document.querySelector('#modalColorPicker .color-dot.active')?.dataset.colorName || 'Default';
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

