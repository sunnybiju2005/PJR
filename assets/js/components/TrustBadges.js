/* PJR Trust Badges - Why Choose PJR Component */

export function renderTrustBadges() {
  const features = [
    { icon: '💎', title: 'Premium Brands', desc: '100% authentic designer fashion labels' },
    { icon: '🏷️', title: 'Best Price Guarantee', desc: 'Unmatched value & direct luxury offers' },
    { icon: '✨', title: 'Original Products', desc: 'Sourced directly from verified creators' },
    { icon: '🚀', title: 'Fast Delivery', desc: 'Express 48-hour delivery across India' },
    { icon: '🔄', title: 'Easy 30-Day Returns', desc: 'Hassle-free instant refund policy' },
    { icon: '🔒', title: 'Secure Payments', desc: '256-bit encrypted Razorpay checkout' },
    { icon: '🎧', title: '24/7 Support', desc: 'Dedicated fashion consultant assistance' }
  ];

  return `
    <section class="section" id="why-pjr" style="background:var(--pjr-bg-grey);">
      <div class="container">
        <div style="text-align:center; max-width:600px; margin:0 auto 3.5rem;">
          <span class="section-subtitle">THE PJR GUARANTEE</span>
          <h2 class="section-title">Why Choose PJR</h2>
          <p class="text-muted">Experience fashion designed around precision, authenticity, and unparalleled customer service.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.5rem;">
          ${features.map(f => `
            <div class="glass-card" style="padding:1.75rem; text-align:center; transition:transform 0.3s ease;">
              <div style="font-size:2.2rem; margin-bottom:0.75rem;">${f.icon}</div>
              <h4 style="font-size:1.1rem; margin-bottom:0.4rem; color:var(--pjr-deep-navy);">${f.title}</h4>
              <p style="font-size:0.88rem; color:var(--pjr-steel-grey);">${f.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
