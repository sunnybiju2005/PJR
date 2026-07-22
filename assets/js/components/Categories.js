/* PJR Shop By Category Component */
import { store } from '../state.js';

export function renderCategories() {
  return `
    <section class="section" id="categories">
      <div class="container">
        <div style="text-align:center; max-width:600px; margin:0 auto 3.5rem;">
          <span class="section-subtitle">CURATED COLLECTIONS</span>
          <h2 class="section-title">Shop By Category</h2>
          <p class="text-muted">Explore high-fashion apparel and luxury accessories tailored to your fit.</p>
        </div>

        <div class="grid-3">
          ${store.categories.map(cat => `
            <div class="category-card" data-category="${cat.id}">
              <img src="${cat.image}" alt="${cat.name} Collection" />
              <div class="category-content">
                <span class="badge badge-teal" style="width:fit-content; margin-bottom:0.5rem;">${cat.count}</span>
                <h3 style="color:var(--pjr-pure-white); margin-bottom:0.25rem;">${cat.name}</h3>
                <p style="font-size:0.9rem; color:rgba(255,255,255,0.85);">${cat.subtitle}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initCategoryEvents() {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const catId = card.dataset.category;
      store.setFilter('gender', catId);
      const targetSec = document.getElementById('new-arrivals');
      targetSec?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
