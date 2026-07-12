/**
 * Footer
 * Dark site footer with brand, nav links, legal links, and CTA buttons.
 * Buttons open modals via Bootstrap data attributes — no handlers needed.
 */

const Footer = () => (
  <footer className="footer-section py-5">
    <div className="container">
      <div className="row g-4 mb-4">
        {/* Brand + tagline */}
        <div className="col-lg-4 mb-2">
          <div className="fs-4 fw-bold text-white mb-2">💬 QuoteGen</div>
          <p
            className="small"
            style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}
          >
            Daily wisdom curated for you. Personalized quotes from the topics
            you love, delivered automatically.
          </p>
        </div>

        {/* Product nav */}
        <div className="col-6 col-lg-2 offset-lg-2">
          <div className="text-white fw-semibold small mb-3">Product</div>
          <ul className="list-unstyled small">
            {[
              ["#features", "Features"],
              ["#pricing", "Pricing"],
              ["#testimonials", "Testimonials"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <li key={label} className="mb-2">
                <a href={href} className="text-white-50 text-decoration-none">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="col-6 col-lg-2">
          <div className="text-white fw-semibold small mb-3">Legal</div>
          <ul className="list-unstyled small">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (label) => (
                <li key={label} className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none">
                    {label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* CTA buttons */}
        <div className="col-lg-2">
          <div className="text-white fw-semibold small mb-3">Get started</div>
          <button
            type="button"
            className="btn btn-primary btn-sm w-100 mb-2"
            data-bs-toggle="modal"
            data-bs-target="#registerModal"
          >
            Register free
          </button>
          <button
            type="button"
            className="btn btn-outline-light btn-sm w-100"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
          >
            Sign in
          </button>
        </div>
      </div>

      <hr style={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <div
        className="d-flex flex-column flex-md-row justify-content-between align-items-center small"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        <span>
          © {new Date().getFullYear()} Quote Generator — Built with the MERN
          stack
        </span>
        <span className="mt-2 mt-md-0">
          Made with ❤️ for learners everywhere
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
