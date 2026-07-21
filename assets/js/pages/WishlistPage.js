/* PJR Dedicated Wishlist Page Renderer */
import { store } from '../state.js';
import { PRODUCTS } from '../mockData.js';
import { renderProductCard } from '../components/ProductGrid.js';

export function renderWishlistPage() {
  const wishlistProducts = PRODUCTS.filter(p => store.wishlist.includes(p.id));

  return `
    <div style="background:var(--pjr-deep-navy); color:var(--pjr-pure-white); padding:8rem 0 3.5rem; border-bottom:1px solid rgba(255,255,255,0.1);">
      <div class="container">
        <div style="font-size:0.85rem; color:var(--pjr-teal-light); margin-bottom:0.5rem; font-weight:600;">
          <a href="index.html" style="color:var(--pjr-teal-light); text-decoration:none;">Home</a> &nbsp;/&nbsp; Saved Wishlist
        </div>
        <h1 style="color:var(--pjr-pure-white); margin-bottom:0.5rem; font-size:3rem;">My Wishlist (${wishlistProducts.length})</h1>
        <p style="color:rgba(255,255,255,0.85); max-width:600px; font-size:1.05rem;">
          Your saved haute couture pieces and perfect fit apparel.
        </p>
      </div>
    </div>

    <section class="section" style="background:var(--pjr-bg-grey); min-height:60vh;">
      <div class="container">
        ${wishlistProducts.length === 0 ? `
          <div style="text-align:center; padding:5rem 1rem; background:var(--pjr-pure-white); border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
            <div style="font-size:3.5rem; margin-bottom:1rem;">❤️</div>
            <h3 style="color:var(--pjr-deep-navy); margin-bottom:0.5rem;">Your wishlist is empty</h3>
            <p class="text-muted" style="margin-bottom:1.5rem;">Save items while browsing to view them later.</p>
            <a href="mens.html" class="btn btn-teal">Explore Collections</a>
          </div>
        ` : `
          <div class="grid-4">
            ${wishlistProducts.map(p => renderProductCard(p)).join('')}
          </div>
        `}
      </div>
    </section>
  `;
}
