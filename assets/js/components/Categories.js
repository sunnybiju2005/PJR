/* PJR Shop By Category Component — Dynamic from Firestore homeimages collection */
import { store } from '../state.js';

export function renderCategories() {
  const unsplashFallbacks = {
    men:         'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
    women:       'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    accessories: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  };

  // Enforce correct order: Men → Women → Accessories
  const orderMap = { men: 0, women: 1, accessories: 2 };
  let cats = store.categories.length > 0 ? [...store.categories] : [
    { id: 'men',         name: "Men's Apparel",       count: '142 Items', subtitle: 'Suits, Blazers & Streetwear'     },
    { id: 'women',       name: "Women's Couture",      count: '98 Items',  subtitle: 'Haute Couture & Silk Gowns'     },
    { id: 'accessories', name: 'Luxury Accessories',   count: '64 Items',  subtitle: 'Swiss Watches & Leather Goods'  }
  ];

  // Sort by enforced order map
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
            let catId = (cat.id || '').toString().toLowerCase().trim();
            if (catId === 'acessories' || catId.includes('access')) catId = 'accessories';

            // Priority 1: Check store.homepageContent (homeimages/menwear, womenwear, accessories)
            const homeContentImg = store.homepageContent ? store.homepageContent.getCategoryImageUrl(catId) : '';
            const homeContentTitle = store.homepageContent ? store.homepageContent.getCategoryTitle(catId) : '';
            
            // Priority 2: Check store.categories
            const catStoreImg = cat.imageUrl?.trim() || cat.image?.trim() || '';

            // Priority 3: Fallback
            const fallbackImg = unsplashFallbacks[catId] || unsplashFallbacks.men;

            const finalImgSrc = homeContentImg || catStoreImg || fallbackImg;

            // Title: check homeContentTitle -> cat.name -> default
            let catName = homeContentTitle || cat.name || 'Category';
            // Auto-correct any spelling of acessories to Accessories / Luxury Accessories
            if (catName.toLowerCase() === 'acessories') catName = 'Luxury Accessories';
            else if (catName.toLowerCase().includes('acessories')) {
              catName = catName.replace(/acessories/gi, 'Accessories');
            }

            // Third card (Accessories) gets a special class for mobile centering
            const extraClass = idx === 2 ? 'category-card-center' : '';

            return `
              <div class="category-card ${extraClass}" data-category="${catId}">
                <img
                  src="${finalImgSrc}"
                  alt="${catName} Collection"
                  loading="lazy"
                  onerror="this.onerror=null; this.src='${fallbackImg}';"
                />
                <div class="category-content">
                  <span class="badge badge-teal" style="width:fit-content; margin-bottom:0.4rem;">${cat.count || 'View All'}</span>
                  <h3 style="color:var(--pjr-pure-white); margin-bottom:0.2rem; font-size:1.25rem;">${catName}</h3>
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
