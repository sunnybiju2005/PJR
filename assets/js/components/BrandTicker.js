/* PJR Featured Brands Component */
import { store } from '../state.js';

export function renderBrandTicker() {
  // Duplicate array for infinite ticker loop
  const brandsList = [...store.brands, ...store.brands];

  return `
    <section style="padding: 2.5rem 0; background: var(--pjr-deep-navy); border-top:1px solid rgba(255,255,255,0.08); border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container" style="margin-bottom:1rem; text-align:center;">
        <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.2em; color:var(--pjr-teal-light); font-weight:700;">
          FEATURED DESIGNER HOUSES & PARTNERS
        </span>
      </div>

      <div class="ticker-wrap">
        <div class="ticker-content">
          ${brandsList.map(brand => `
            <div style="display:inline-flex; align-items:center; gap:0.75rem; color:var(--pjr-pure-white); font-family:var(--font-heading); font-size:1.4rem; font-weight:700; opacity:0.85; transition:opacity 0.3s ease;">
              <span style="color:var(--pjr-teal);">✦</span>
              <span>${brand.name.toUpperCase()}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
