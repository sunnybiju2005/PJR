/* PJR Trending Collection Masonry Showcase */
import { store } from '../state.js';

export function renderMasonry() {
  const items = [
    {
      title: 'Monochrome Editorial Suit',
      subtitle: 'Winter Tailoring 2026',
      image: 'assets/images/hero-men.png',
      class: 'tall',
      gender: 'men'
    },
    {
      title: 'Haute Couture Evening Wear',
      subtitle: 'Runway Exclusive',
      image: 'assets/images/hero-women.png',
      class: 'wide',
      gender: 'women'
    },
    {
      title: 'Swiss Precision Chrono',
      subtitle: 'Limited Edition Timepiece',
      image: 'assets/images/hero-accessories.png',
      class: '',
      gender: 'accessories'
    },
    {
      title: 'Urban Streetwear Capsule',
      subtitle: 'PJR Heavyweight Cotton',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      class: '',
      gender: 'men'
    }
  ];

  return `
    <section class="section" id="trending">
      <div class="container">
        <div style="text-align:center; max-width:600px; margin:0 auto 3.5rem;">
          <span class="section-subtitle">VISUAL EDITORIAL</span>
          <h2 class="section-title">Trending Collection</h2>
          <p class="text-muted">Explore high-fashion editorial looks curated by PJR fashion directors.</p>
        </div>

        <div class="masonry-grid">
          ${items.map(item => `
            <div class="masonry-item ${item.class}" data-masonry-gender="${item.gender}">
              <img src="${item.image}" alt="${item.title}" loading="lazy" />
              <div class="masonry-overlay">
                <span class="badge badge-teal" style="width:fit-content; margin-bottom:0.4rem;">TRENDING NOW</span>
                <h3 style="color:var(--pjr-pure-white); margin-bottom:0.2rem;">${item.title}</h3>
                <p style="font-size:0.88rem; color:rgba(255,255,255,0.8);">${item.subtitle}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initMasonryEvents() {
  document.querySelectorAll('.masonry-item').forEach(item => {
    item.addEventListener('click', () => {
      const g = item.dataset.masonryGender;
      store.setFilter('gender', g);
      document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
