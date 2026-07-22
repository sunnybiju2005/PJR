/* PJR Trending Collection — Editorial Masonry Layout */
import { store } from '../state.js';

/**
 * Grid layout patterns for the masonry tiles.
 * Cycles through these for visual variety.
 */
const TILE_LAYOUTS = [
  { class: 'tall', badge: 'TRENDING' },
  { class: 'wide', badge: 'HOT PICK' },
  { class: '',     badge: 'MUST HAVE' },
  { class: '',     badge: 'TRENDING' },
];

export function renderMasonry() {
  const allProducts = store.products || [];

  // Use products explicitly marked as Trending by Admin App
  let trendingProducts = allProducts.filter(p => Boolean(p.isTrending));

  // Graceful fallback: if Admin hasn't marked any products as Trending yet,
  // show the first 4 newest products so the section is never empty
  if (trendingProducts.length === 0) {
    trendingProducts = allProducts.slice(0, 4);
  }

  // Still nothing (store not loaded yet) — hide section
  if (trendingProducts.length === 0) {
    return '';
  }

  // Limit to 4 tiles for the masonry grid to keep the layout balanced
  const tiles = trendingProducts.slice(0, 4);

  return `
    <section class="section mobile-hidden-section" id="trending">
      <div class="container">
        <div style="text-align:center; max-width:600px; margin:0 auto 2.5rem;">
          <span class="section-subtitle">VISUAL EDITORIAL</span>
          <h2 class="section-title">Trending Collection</h2>
          <p class="text-muted">Explore high-fashion editorial looks curated by PJR fashion directors.</p>
        </div>

        <div class="masonry-grid">
          ${tiles.map((p, idx) => {
            const layout = TILE_LAYOUTS[idx] || TILE_LAYOUTS[0];
            const img = (p.imageUrls || p.images || [])[0] || 'assets/images/hero-men.png';
            const priceStr = p.price ? `₹${Number(p.price).toLocaleString('en-IN')}` : '';

            return `
              <div class="masonry-item ${layout.class}"
                data-qv-id="${p.id}"
                style="cursor:pointer;"
              >
                <img
                  src="${img}"
                  alt="${p.title}"
                  loading="lazy"
                  onerror="this.src='assets/images/hero-men.png'"
                />
                <div class="masonry-overlay">
                  <span class="badge badge-teal" style="width:fit-content; margin-bottom:0.45rem; font-size:0.6rem; letter-spacing:0.1em;">
                    ${layout.badge}
                  </span>
                  <h3 style="color:var(--pjr-pure-white); margin:0 0 0.2rem; font-size:1.05rem; line-height:1.25; font-weight:700;">
                    ${p.title}
                  </h3>
                  <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
                    <span style="font-size:0.78rem; color:rgba(255,255,255,0.75);">${p.brand}</span>
                    ${priceStr ? `<span style="font-size:0.88rem; font-weight:700; color:var(--pjr-teal-light);">${priceStr}</span>` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initMasonryEvents() {
  document.addEventListener('click', (e) => {
    const tile = e.target.closest('.masonry-item[data-qv-id]');
    if (!tile) return;
    const pId = tile.dataset.qvId;
    const product = (store.products || []).find(p => p.id === pId);
    if (product) store.openModal('quickView', product);
  });
}
