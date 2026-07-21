/* PJR Luxury Footer Component */

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:3rem; margin-bottom:3.5rem;">
          <div>
            <a href="#" class="brand-logo" style="margin-bottom:1rem;">
              <span class="brand-name" style="color:var(--pjr-pure-white);">PJR</span>
              <span class="brand-tagline">Multiple Brands & Perfect Fit</span>
            </a>
            <p style="font-size:0.9rem; color:rgba(255,255,255,0.7); line-height:1.6; margin-bottom:1.5rem;">
              PJR is a world-class fashion e-commerce destination curated for individuals who demand perfection, luxury craftsmanship, and flawless fit.
            </p>
            <div style="display:flex; gap:1rem; font-size:1.2rem;">
              <a href="https://instagram.com" target="_blank" title="Instagram">📸</a>
              <a href="https://facebook.com" target="_blank" title="Facebook">📘</a>
              <a href="https://wa.me/" target="_blank" title="WhatsApp">💬</a>
              <a href="mailto:support@pjr.com" title="Email">✉️</a>
            </div>
          </div>

          <div>
            <h4 style="color:var(--pjr-pure-white); margin-bottom:1.2rem; font-size:1.1rem;">Customer Care</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.6rem; font-size:0.9rem;">
              <li><a href="#why-pjr">Return & Exchange Policy</a></li>
              <li><a href="#why-pjr">Shipping & Delivery Info</a></li>
              <li><a href="#why-pjr">PJR Perfect Fit Guide</a></li>
              <li><a href="#account" id="footerOrderTrack">Track Your Order</a></li>
              <li><a href="mailto:support@pjr.com">Help & VIP Support</a></li>
            </ul>
          </div>

          <div>
            <h4 style="color:var(--pjr-pure-white); margin-bottom:1.2rem; font-size:1.1rem;">Quick Links</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.6rem; font-size:0.9rem;">
              <li><a href="#categories">Men's Apparel</a></li>
              <li><a href="#categories">Women's Couture</a></li>
              <li><a href="#categories">Luxury Accessories</a></li>
              <li><a href="#new-arrivals">New Arrivals</a></li>
              <li><a href="#best-sellers">Best Sellers</a></li>
            </ul>
          </div>

          <div>
            <h4 style="color:var(--pjr-pure-white); margin-bottom:1.2rem; font-size:1.1rem;">Legal & Policy</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.6rem; font-size:0.9rem;">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Security & Encryption</a></li>
              <li><a href="#">Razorpay Partner Policy</a></li>
            </ul>
          </div>
        </div>

        <div style="padding-top:2rem; border-top:1px solid rgba(255,255,255,0.1); display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; font-size:0.85rem; color:rgba(255,255,255,0.6);">
          <div>
            © 2026 <strong>PJR – Multiple Brands & Perfect Fit</strong>. All Rights Reserved.
          </div>
          <div style="display:flex; align-items:center; gap:1rem;">
            <span>Powered by Shared Firebase Backend & Razorpay</span>
            <span>🔒 SSL Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
