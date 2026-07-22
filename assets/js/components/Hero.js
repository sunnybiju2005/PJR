/* PJR Dynamic Hero Section Component */
import { store } from '../state.js';

export function renderHero() {
  const banners = store.banners || [];
  const activeBanners = banners.length > 0 ? banners : [
    { image: 'assets/images/hero-men.png', title: 'STYLE THAT FITS YOU PERFECTLY', subtitle: 'SPRING / SUMMER 2026 EDITION', description: 'Premium Brands. Perfect Fit. Fashion for Everyone.', buttonText: 'Shop Collection', link: 'mens.html' },
    { image: 'assets/images/hero-women.png', title: 'HAUTE COUTURE & ELEGANCE', subtitle: 'SPRING / SUMMER 2026 EDITION', description: 'Experience silk draped gowns and luxury womenswear.', buttonText: 'Explore Women', link: 'womens.html' },
    { image: 'assets/images/hero-accessories.png', title: 'FINE WATCHES & ACCESSORIES', subtitle: 'SPRING / SUMMER 2026 EDITION', description: 'Precision timepieces and handcrafted leather goods.', buttonText: 'Shop Accessories', link: 'accessories.html' }
  ];

  const firstBanner = activeBanners[0];

  return `
    <section class="hero-section" id="hero">
      <div class="hero-slider-bg">
        ${activeBanners.map((b, idx) => `
          <div class="hero-slide ${idx === 0 ? 'active' : ''}">
            <img src="${b.image || b.imageUrl || 'assets/images/hero-men.png'}" alt="${b.title || 'PJR Banner'}" loading="lazy" />
            <div class="hero-overlay"></div>
          </div>
        `).join('')}
      </div>

      <div class="container hero-content animate-fade-in">
        <span class="section-subtitle" style="color:var(--pjr-teal-light);">${firstBanner.subtitle || 'EXCLUSIVE COLLECTION'}</span>
        <h1 style="color:var(--pjr-pure-white); margin-bottom:1.2rem;">${firstBanner.title || 'STYLE THAT FITS YOU PERFECTLY'}</h1>
        <p style="font-size:1.2rem; color:rgba(255,255,255,0.85); margin-bottom:2.2rem; max-width:520px;">
          ${firstBanner.description || 'Premium Brands. Perfect Fit. Fashion for Everyone.'}
        </p>

        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="${firstBanner.link || 'mens.html'}" class="btn btn-teal" id="heroShopBtn">
            ${firstBanner.buttonText || 'Shop Collection'}
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
      </div>
    </section>
  `;
}

export function initHeroEvents() {
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  if (slides.length > 1) {
    setInterval(() => {
      slides[currentSlide]?.classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide]?.classList.add('active');
    }, 5500);
  }
}
