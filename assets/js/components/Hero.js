/* PJR Dynamic Hero Section Component — Powered by Firestore (homeimages/heroimage) */
import { store } from '../state.js';

export function renderHero() {
  const heroData = store.heroData || {};
  const banners = store.banners || [];

  // True loading: Firebase hasn't responded AND there is no cached data at all
  const hasCachedData = !!(heroData.url || heroData.imageUrl || heroData.image || heroData.heroImage
    || (Array.isArray(heroData.imageUrls) && heroData.imageUrls[0])
    || heroData.title);
  const isLoading = store.isHeroLoading && !hasCachedData;

  // Determine hero image URL — strictly from Firebase; never fall back to a hardcoded asset
  const modelHeroUrl = store.homepageContent ? store.homepageContent.getHeroImageUrl() : '';
  const heroImageSrc = modelHeroUrl
    || store.heroImageUrl
    || heroData.url || heroData.imageUrl || heroData.image || heroData.heroImage
    || (Array.isArray(heroData.imageUrls) && heroData.imageUrls[0])
    || '';

  // Only title comes from Firebase (no hardcoded default)
  const title       = heroData.title       || store.homepageContent?.heroimage?.title || banners[0]?.title || '';
  // Subtitle, description, button — keep hardcoded defaults as before
  const subtitle    = heroData.subtitle    || banners[0]?.subtitle    || 'EXCLUSIVE COLLECTION';
  const description = heroData.description || banners[0]?.description || 'Premium Brands. Perfect Fit. Fashion for Everyone.';
  const buttonText  = heroData.buttonText  || banners[0]?.buttonText  || 'Shop Collection';
  const link        = heroData.link        || banners[0]?.link        || 'mens.html';

  // Skeleton shimmer shown only on very first ever load with no cache
  if (isLoading) {
    return `
      <section class="hero-section" id="hero">
        <div class="hero-slider-bg">
          <div class="hero-slide active">
            <div style="width:100%;height:100%;background:linear-gradient(90deg,#001B2A 25%,#002B42 50%,#001B2A 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;"></div>
            <div class="hero-overlay"></div>
          </div>
        </div>
        <div class="container hero-content">
          <div style="height:1rem;width:160px;background:linear-gradient(90deg,#002B42 25%,#003D5C 50%,#002B42 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:4px;margin-bottom:1.2rem;"></div>
          <div style="height:3rem;width:75%;max-width:520px;background:linear-gradient(90deg,#002B42 25%,#003D5C 50%,#002B42 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:6px;margin-bottom:1.2rem;"></div>
          <div style="height:1.2rem;width:55%;max-width:360px;background:linear-gradient(90deg,#002B42 25%,#003D5C 50%,#002B42 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:4px;margin-bottom:2.2rem;"></div>
          <div style="height:2.8rem;width:160px;background:linear-gradient(90deg,#002B42 25%,#003D5C 50%,#002B42 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px;"></div>
        </div>
      </section>
    `;
  }

  return `
    <section class="hero-section" id="hero">
      <div class="hero-slider-bg">
        <div class="hero-slide active">
          ${heroImageSrc ? `
            <img
              src="${heroImageSrc}"
              alt="${title || 'Hero'}"
              loading="eager"
              onerror="this.style.display='none';"
            />
          ` : ''}
          <div class="hero-overlay"></div>
        </div>
      </div>

      <div class="container hero-content animate-fade-in">
        <span class="section-subtitle" style="color:var(--pjr-teal-light);">${subtitle}</span>
        ${title ? `<h1 style="color:var(--pjr-pure-white); margin-bottom:1.2rem;">${title}</h1>` : ''}
        <p style="font-size:1.2rem; color:rgba(255,255,255,0.85); margin-bottom:2.2rem; max-width:520px;">${description}</p>

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
