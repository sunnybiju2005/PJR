/* PJR Shop By Category Component */
import { store } from '../state.js';

export function renderCategories() {
  const fallbackImages = {
    men:         'assets/images/hero-men.png',
    women:       'assets/images/hero-women.png',
    accessories: 'assets/images/hero-accessories.png',
  };

  // High-quality Unsplash fallbacks (used when Firestore image is empty)
  const unsplashFallbacks = {
    men:         'assets/images/hero-men.png',
    women:       'assets/images/hero-women.png',
    accessories: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  };

  // Enforce correct order: Men → Women → Accessories
  const orderMap = { men: 0, women: 1, accessories: 2 };
  let cats = store.categories.length > 0 ? [...store.categories] : [
    { id: 'men',         name: "Men's Apparel",       count: '142 Items', subtitle: 'Suits, Blazers & Streetwear'     },
    { id: 'women',       name: "Women's Couture",      count: '98 Items',  subtitle: 'Haute Couture & Silk Gowns'     },
    { id: 'accessories', name: 'Luxury Accessories',   count: '64 Items',  subtitle: 'Swiss Watches & Leather Goods'  }
  ];

  // Sort by enforced order map (unknown items go to end)
  cats = cats.sort((a, b) => {
    const ai = orderMap[a.id] ?? 99;
    const bi = orderMap[b.id] ?? 99;
    return ai - bi;
  });

  return `
    <section class="section" id="categories">
      <div class="container">
        <div style="text-align:center; max-width:600px; margin:0 auto 2.5rem;">
          <span class="section-subtitle">CURATED COLLECTIONS</span>
          <h2 class="section-title">Shop By Category</h2>
          <p class="text-muted">Explore high-fashion apparel and luxury accessories tailored to your fit.</p>
        </div>

        <div class="category-cards-grid">
          ${cats.map((cat, idx) => {
            const catId = (cat.id || '').toString().toLowerCase().trim();
            const localImg = cat.imageUrl?.trim() || cat.image?.trim() || '';
            const imgSrc = localImg !== ''
              ? localImg
              : (unsplashFallbacks[catId] || fallbackImages[catId] || 'assets/images/hero-men.png');

            // Third card (Accessories) gets a special class for mobile centering
            const extraClass = idx === 2 ? 'category-card-center' : '';

            return `
              <div class="category-card ${extraClass}" data-category="${catId}">
                <img src="${imgSrc}" alt="${cat.name || 'Category'} Collection" loading="lazy" />
                <div class="category-content">
                  <span class="badge badge-teal" style="width:fit-content; margin-bottom:0.4rem;">${cat.count || 'View All'}</span>
                  <h3 style="color:var(--pjr-pure-white); margin-bottom:0.2rem; font-size:1.25rem;">${cat.name}</h3>
                  <p style="font-size:0.82rem; color:rgba(255,255,255,0.85); margin:0;">${cat.subtitle || 'Shop Exclusive Collection'}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initCategoryEvents() {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const catId = (card.dataset.category || '').toLowerCase();
      if (catId === 'men')                       window.location.href = 'mens.html';
      else if (catId === 'women')                window.location.href = 'womens.html';
      else if (catId.includes('access'))         window.location.href = 'accessories.html';
      else {
        store.setFilter('gender', catId);
        document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
