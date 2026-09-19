document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('site-footer');
  if (!mount) return;

  // Depth-based, so it works for both the `<screen>/code.html` convention
  // and directly-named pages like `legal/terms.html`.
  const pathname = window.location.pathname.replace(/\\/g, '/');
  const segments = pathname.split('/').filter(Boolean);
  const isFile = pathname.endsWith('.html') || pathname.endsWith('.htm');
  const upCount = Math.max(0, segments.length - (isFile ? 1 : 0));
  const prefix = '../'.repeat(upCount);
  const year = new Date().getFullYear();

  if (!document.getElementById('site-footer-styles')) {
    const style = document.createElement('style');
    style.id = 'site-footer-styles';
    style.textContent = `
      .site-footer { border-top: 1px solid rgba(148,163,184,.2); padding: 28px 24px 24px; font-family: 'Public Sans', 'Inter', sans-serif; }
      .site-footer-grid { display: flex; flex-wrap: wrap; gap: 24px; justify-content: space-between; max-width: 28rem; margin: 0 auto; }
      .site-footer-col h4 { margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #D4AF37; }
      .site-footer-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
      .site-footer-col a { font-size: 13px; color: inherit; opacity: .75; text-decoration: none; }
      .site-footer-col a:hover { opacity: 1; text-decoration: underline; }
      .site-footer-bottom { max-width: 28rem; margin: 20px auto 0; padding-top: 16px; border-top: 1px solid rgba(148,163,184,.15); font-size: 11px; opacity: .6; text-align: center; }
    `;
    document.head.appendChild(style);
  }

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="site-footer-grid">
        <div class="site-footer-col">
          <h4>She Ate</h4>
          <ul>
            <li><a href="${prefix}home_discovery/code.html">Home</a></li>
            <li><a href="${prefix}menu_listing/code.html">Menu</a></li>
            <li><a href="${prefix}order_tracking/code.html">Track an order</a></li>
          </ul>
        </div>
        <div class="site-footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="${prefix}help_support/code.html">Help &amp; support</a></li>
            <li><a href="https://wa.me/27823276367" target="_blank" rel="noopener">WhatsApp us</a></li>
          </ul>
        </div>
        <div class="site-footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="${prefix}legal/terms.html">Terms &amp; conditions</a></li>
            <li><a href="${prefix}legal/privacy.html">Privacy policy</a></li>
          </ul>
        </div>
      </div>
      <div class="site-footer-bottom">&copy; ${year} She Ate. Her love language.</div>
    </footer>
  `;
});
