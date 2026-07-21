/* PJR Hero Section Component */
import { store } from '../state.js';

export function renderHero() {
  return `
    <section class="hero-section" id="hero">
      <div class="hero-slider-bg">
        <div class="hero-slide active">
          <img src="assets/images/hero-men.png" alt="PJR Men's Luxury Fashion" />
          <div class="hero-overlay"></div>
        </div>
        <div class="hero-slide">
          <img src="assets/images/hero-women.png" alt="PJR Women's Luxury Collection" />
          <div class="hero-overlay"></div>
        </div>
        <div class="hero-slide">
          <img src="assets/images/hero-accessories.png" alt="PJR High-End Accessories" />
          <div class="hero-overlay"></div>
        </div>
      </div>

      <div class="container hero-content animate-fade-in">
        <span class="section-subtitle" style="color:var(--pjr-teal-light);">SPRING / SUMMER 2026 EDITION</span>
        <h1 style="color:var(--pjr-pure-white); margin-bottom:1.2rem;">STYLE THAT FITS YOU PERFECTLY</h1>
        <p style="font-size:1.2rem; color:rgba(255,255,255,0.85); margin-bottom:2.2rem; max-width:520px;">
          Premium Brands. Perfect Fit. Fashion for Everyone. Elevate your wardrobe with curated Italian tailoring and haute couture.
        </p>

        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="#new-arrivals" class="btn btn-teal" id="heroShopMen">
            Shop Men
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
          <a href="#new-arrivals" class="btn btn-outline-white" id="heroShopWomen">
            Shop Women
          </a>
          <a href="#why-pjr" class="btn btn-outline-white" style="border:none;">
            Learn More
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
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5500);
  }

  document.getElementById('heroShopMen')?.addEventListener('click', () => {
    store.setFilter('gender', 'men');
  });

  document.getElementById('heroShopWomen')?.addEventListener('click', () => {
    store.setFilter('gender', 'women');
  });
}
