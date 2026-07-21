/* PJR Home Page Renderer */
import { renderHero } from '../components/Hero.js';
import { renderTrustBadges } from '../components/TrustBadges.js';
import { renderCategories } from '../components/Categories.js';
import { renderBrandTicker } from '../components/BrandTicker.js';
import { renderNewArrivals, renderBestSellers } from '../components/ProductGrid.js';
import { renderMasonry } from '../components/Masonry.js';

export function renderHomePage() {
  return `
    ${renderHero()}
    ${renderTrustBadges()}
    ${renderCategories()}
    ${renderBrandTicker()}
    ${renderNewArrivals()}
    ${renderMasonry()}
    
    <!-- Offers Special Banner -->
    <section class="section" style="background:linear-gradient(135deg, var(--pjr-deep-navy) 0%, var(--pjr-teal) 100%); color:var(--pjr-pure-white); position:relative; overflow:hidden;">
      <div class="container" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:2rem; position:relative; z-index:2;">
        <div>
          <span style="font-size:0.85rem; font-weight:700; color:var(--pjr-teal-light); letter-spacing:0.15em; text-transform:uppercase;">EXCLUSIVE VIP CLUB OFFER</span>
          <h2 style="color:var(--pjr-pure-white); margin:0.5rem 0 1rem; font-size:2.4rem;">Get 25% Off Your First Perfect Fit Order</h2>
          <p style="color:rgba(255,255,255,0.85); font-size:1.05rem; max-width:550px;">Use code <strong style="color:var(--pjr-teal-light); border:1px dashed var(--pjr-teal-light); padding:0.2rem 0.5rem; border-radius:4px;">PJR25</strong> at checkout for complimentary express shipping & tailor fit consultation.</p>
        </div>

        <a href="#new-arrivals" class="btn btn-teal" style="padding:1rem 2rem; font-size:1.05rem;">
          Claim VIP Voucher →
        </a>
      </div>
    </section>

    ${renderBestSellers()}

    <!-- Newsletter Section -->
    <section class="section" style="background:var(--pjr-pure-white); text-align:center;">
      <div class="container" style="max-width:600px;">
        <span class="section-subtitle">STAY INSPIRED</span>
        <h2 class="section-title">Subscribe To PJR Gazette</h2>
        <p class="text-muted" style="margin-bottom:2rem;">Be first to receive haute couture drops, private sale invitations, and bespoke styling tips.</p>

        <form id="newsletterForm" style="display:flex; gap:0.5rem; max-width:480px; margin:0 auto;">
          <input type="email" class="form-input" placeholder="Enter your email address..." required style="border-radius:var(--radius-full); padding-left:1.2rem;" />
          <button type="submit" class="btn btn-primary" style="flex-shrink:0;">Join Gazette</button>
        </form>
      </div>
    </section>
  `;
}
