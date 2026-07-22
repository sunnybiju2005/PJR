/* PJR Featured Brand Component — Single Brand PJR Collections Marquee */

export function renderBrandTicker() {
  // Duplicate PJR COLLECTIONS brand for seamless left-to-right infinite loop
  const brandsList = Array(12).fill('PJR COLLECTIONS');

  return `
    <section class="brand-ticker-section" style="padding: 2rem 0; background: var(--pjr-deep-navy); border-top:1px solid rgba(255,255,255,0.08); border-bottom:1px solid rgba(255,255,255,0.08); overflow:hidden;">
      <div class="container" style="margin-bottom:0.75rem; text-align:center;">
        <span style="font-size:0.72rem; text-transform:uppercase; letter-spacing:0.2em; color:var(--pjr-teal-light); font-weight:700;">
          FEATURED BRAND HOUSE
        </span>
      </div>

      <div class="ticker-wrap">
        <div class="ticker-content-ltr">
          ${brandsList.map(name => `
            <div class="ticker-brand-item">
              <span class="ticker-star">✦</span>
              <span class="ticker-brand-name">${name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
