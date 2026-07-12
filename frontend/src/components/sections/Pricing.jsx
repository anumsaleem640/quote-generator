/**
 * Pricing
 * Two-card layout: Free and Premium.
 * The Premium card has a featured border defined in .pricing-card.featured in index.css.
 *
 * Both CTA buttons open #registerModal via Bootstrap data attributes —
 * no JavaScript required.
 */

const FREE_FEATURES = [
  "Up to 5 categories",
  "Random quote delivery",
  "3 refresh intervals (1min / 1hr / 1day)",
  "Web dashboard access",
  "Mobile app access",
];

const PREMIUM_FEATURES = [
  "Unlimited categories",
  "Priority content updates",
  "Advanced personalisation",
  "All free features included",
  "Early access to new features",
];

const CheckItem = ({ text, accent }) => (
  <li className="d-flex align-items-start gap-2 mb-2 small text-muted">
    <span
      className="fw-bold flex-shrink-0"
      style={{ color: accent ? "var(--brand-primary)" : "#22c55e" }}
    >
      ✓
    </span>
    {text}
  </li>
);

const Pricing = () => (
  <section className="section-padding bg-light" id="pricing">
    <div className="container">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-3">
          Pricing
        </span>
        <h2 className="display-6 fw-bold mb-3">Simple, transparent pricing</h2>
        <p className="text-muted lead">
          Start free. Upgrade when you&apos;re ready.
        </p>
      </div>

      <div className="row justify-content-center g-4">
        {/* ── Free Plan ── */}
        <div className="col-md-5">
          <div className="pricing-card card h-100 p-5">
            <h4 className="fw-bold mb-1">Free</h4>
            <p className="text-muted small mb-4">
              Everything you need to get started.
            </p>

            <div className="mb-4 d-flex align-items-end gap-1">
              <span className="price-amount">$0</span>
              <span className="text-muted mb-1">/ forever</span>
            </div>

            <ul className="list-unstyled mb-5">
              {FREE_FEATURES.map((f) => (
                <CheckItem key={f} text={f} />
              ))}
            </ul>

            <button
              type="button"
              className="btn btn-outline-primary w-100 py-2 fw-semibold mt-auto"
              data-bs-toggle="modal"
              data-bs-target="#registerModal"
            >
              Get started free
            </button>
          </div>
        </div>

        {/* ── Premium Plan ── */}
        <div className="col-md-5">
          <div className="pricing-card featured card h-100 p-5">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h4 className="fw-bold mb-0">Premium</h4>
              <span className="pricing-badge">Most popular</span>
            </div>
            <p className="text-muted small mb-4">
              For readers who want the full experience.
            </p>

            <div className="mb-4 d-flex align-items-end gap-1">
              <span className="price-amount">$9</span>
              <span className="text-muted mb-1">.99 / month</span>
            </div>

            <ul className="list-unstyled mb-5">
              {PREMIUM_FEATURES.map((f) => (
                <CheckItem key={f} text={f} accent />
              ))}
            </ul>

            <button
              type="button"
              className="btn btn-primary w-100 py-2 fw-semibold mt-auto shadow"
              data-bs-toggle="modal"
              data-bs-target="#registerModal"
            >
              Start free trial
            </button>
            <p
              className="text-center text-muted mt-2 mb-0"
              style={{ fontSize: "0.75rem" }}
            >
              7-day trial · Cancel anytime
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-muted small mt-4 mb-0">
        Payment gateway integration coming soon.{" "}
        <button
          type="button"
          className="btn btn-link btn-sm p-0"
          data-bs-toggle="modal"
          data-bs-target="#registerModal"
        >
          Register now
        </button>{" "}
        to lock in your early-adopter rate.
      </p>
    </div>
  </section>
);

export default Pricing;
