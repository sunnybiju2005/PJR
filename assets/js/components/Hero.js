/* PJR Dynamic Hero Section Component — Powered by Firestore (homeimages/heroimage) */
import { store } from '../state.js';

// Single clean fallback image URL used ONLY if Firebase returns no image at all
const FALLBACK_HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80';

export function renderHero() {
  const isLoading = Boolean(store.isHomepageContentLoading && store.isHeroLoading);
  const heroData = store.heroData || {};
  const banners = store.banners || [];

  // Determine hero image URL from store.homepageContent (homeimages/heroimage imageUrls[0])
  const modelHeroUrl = store.homepageContent ? store.homepageContent.getHeroImageUrl() : '';
  let heroImageSrc = modelHeroUrl || store.heroImageUrl || heroData.url || heroData.imageUrl || heroData.image || heroData.heroImage || '';

  if (!heroImageSrc && banners.length > 0) {
    heroImageSrc = banners[0].image || banners[0].imageUrl || '';
  }

  // Dynamic text content from Firestore document or defaults
  const title = heroData.title || store.homepageContent?.heroimage?.title || (banners[0]?.title) || 'STYLE THAT FITS YOU PERFECTLY';
  const subtitle = heroData.subtitle || (banners[0]?.subtitle) || 'EXCLUSIVE COLLECTION';
  const description = heroData.description || (banners[0]?.description) || 'Premium Brands. Perfect Fit. Fashion for Everyone.';
  const buttonText = heroData.buttonText || (banners[0]?.buttonText) || 'Shop Collection';
  const link = heroData.link || (banners[0]?.link) || 'mens.html';

  return `
    <section class="hero-section" id="hero">
      <div class="hero-slider-bg">
        <div class="hero-slide active">
          ${isLoading ? `
            <div class="hero-loading-skeleton" style="width:100%; height:100%; background:linear-gradient(90deg, #001B2A 25%, #002B42 50%, #001B2A 75%); background-size:200% 100%; animation:shimmer 1.5s infinite;"></div>
          ` : `
            <img
              src="${heroImageSrc || FALLBACK_HERO_IMAGE}"
              alt="${title}"
              loading="eager"
              onerror="this.onerror=null; this.src='${FALLBACK_HERO_IMAGE}';"
            />
          `}
          <div class="hero-overlay"></div>
        </div>
      </div>

      <div class="container hero-content animate-fade-in">
        <span class="section-subtitle" style="color:var(--pjr-teal-light);">${subtitle}</span>
        <h1 style="color:var(--pjr-pure-white); margin-bottom:1.2rem;">${title}</h1>
        <p style="font-size:1.2rem; color:rgba(255,255,255,0.85); margin-bottom:2.2rem; max-width:520px;">
          ${description}
        </p>

        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="${link}" class="btn btn-teal" id="heroShopBtn">
            ${buttonText}
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
      </div>
    </section>
  `;
}

export function initHeroEvents() {
  // Hero slide events initialized if multi-slide is active
}
