/* PJR Luxury Footer Component — Clean & Minimal Mobile Layout */
import { store } from '../state.js';

export function renderFooter() {
  const settings = store.settings || {};
  const storeName = settings.storeName || 'PJR';
  const tagline = settings.tagline || 'Multiple Brands & Perfect Fit';
  const instagram = settings.instagram || 'https://instagram.com';
  const facebook = settings.facebook || 'https://facebook.com';
  const whatsapp = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}`
    : 'https://wa.me/';

  return `
    <footer class="footer">
      <div class="container">

        <!-- Desktop & Mobile Main Footer Layout -->
        <div class="footer-grid">

          <!-- Brand & Story (always visible) -->
          <div class="footer-col brand-col">
            <a href="index.html" class="brand-logo" style="margin-bottom:0.75rem;">
              <span class="brand-name" style="color:var(--pjr-pure-white); font-size:1.6rem;">${storeName}</span>
              <span class="brand-tagline">${tagline}</span>
            </a>
            <p class="footer-desc">
              World-class luxury fashion destination curated for individuals who demand perfection, luxury craftsmanship, and flawless fit.
            </p>

            <!-- Social Icons — Instagram, WhatsApp, Facebook only -->
            <div class="footer-social-icons">
              <a href="${instagram}" target="_blank" title="Instagram" class="social-icon-btn" aria-label="Follow on Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="${whatsapp}" target="_blank" title="WhatsApp" class="social-icon-btn" aria-label="Contact on WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
              </a>
              <a href="${facebook}" target="_blank" title="Facebook" class="social-icon-btn" aria-label="Follow on Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Customer Care — hidden on mobile via CSS -->
          <div class="footer-col footer-col-hide-mobile">
            <h4 class="footer-heading">Customer Care</h4>
            <ul class="footer-links">
              <li><a href="mens.html">Return &amp; Exchange</a></li>
              <li><a href="womens.html">Shipping &amp; Express Delivery</a></li>
              <li><a href="profile.html">Track Order Timeline</a></li>
              <li><a href="mailto:support@pjr.com">Help &amp; VIP Support</a></li>
            </ul>
          </div>

          <!-- Shop Collections — hidden on mobile via CSS -->
          <div class="footer-col footer-col-hide-mobile">
            <h4 class="footer-heading">Collections</h4>
            <ul class="footer-links">
              <li><a href="mens.html">Men's Apparel</a></li>
              <li><a href="womens.html">Women's Couture</a></li>
              <li><a href="accessories.html">Luxury Accessories</a></li>
              <li><a href="new-arrivals.html">New Arrivals</a></li>
              <li><a href="best-sellers.html">Best Sellers</a></li>
            </ul>
          </div>

          <!-- Legal Policies — hidden on mobile via CSS -->
          <div class="footer-col footer-col-hide-mobile">
            <h4 class="footer-heading">Legal</h4>
            <ul class="footer-links">
              <li><a href="index.html">Privacy Policy</a></li>
              <li><a href="index.html">Terms &amp; Conditions</a></li>
              <li><a href="index.html">SSL Encryption</a></li>
            </ul>
          </div>

        </div>

        <!-- Bottom Copyright Row -->
        <div class="footer-bottom-bar">
          <div class="footer-copyright">
            © 2026 <strong>PJR Collections</strong>. All Rights Reserved.
          </div>
          <!-- Trust badges — hidden on mobile via CSS -->
          <div class="footer-trust-badges footer-trust-badges-hide-mobile">
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>⚡ Express Priority Dispatch</span>
          </div>
        </div>

      </div>
    </footer>
  `;
}
