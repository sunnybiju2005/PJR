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
    ${renderCategories()}
    ${renderBrandTicker()}
    ${renderNewArrivals()}
    ${renderMasonry()}

    ${renderBestSellers()}

  `;
}
