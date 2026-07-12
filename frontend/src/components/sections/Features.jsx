/**
 * Features
 * Six-card grid explaining what the product does.
 * Each card lifts on hover via the .feature-card CSS transition in index.css.
 */

const FEATURES = [
  {
    icon: "🎯",
    title: "Personalised Categories",
    desc: "Choose up to 5 topics on the free plan — Motivation, Wisdom, Humor, and more. Upgrade to Premium for unlimited access.",
  },
  {
    icon: "⚡",
    title: "Auto-Refresh",
    desc: "Set your quote to refresh every minute, every hour, or once a day. Your feed updates automatically — no action required.",
  },
  {
    icon: "📱",
    title: "Web & Mobile",
    desc: "Use the web dashboard in any browser or our native iOS and Android app built with React Native.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Passwords hashed with bcrypt. Sessions secured with JWT. Your data is never sold or shared with third parties.",
  },
  {
    icon: "🎨",
    title: "Manual Refresh",
    desc: "Don't want to wait? Hit Refresh at any time for an instant new quote from your selected categories.",
  },
  {
    icon: "🚀",
    title: "Premium Perks",
    desc: "Upgrade for unlimited categories, priority content updates, and advanced personalisation settings.",
  },
];

const Features = () => (
  <section className="section-padding bg-light" id="features">
    <div className="container">
      {/* Section heading */}
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-3">
          Features
        </span>
        <h2 className="display-6 fw-bold mb-3">Everything you need</h2>
        <p className="text-muted lead mx-auto" style={{ maxWidth: "520px" }}>
          A focused, distraction-free quote experience built for people who
          value intentional growth.
        </p>
      </div>

      {/* Card grid */}
      <div className="row g-4">
        {FEATURES.map(({ icon, title, desc }) => (
          <div key={title} className="col-md-6 col-lg-4">
            <div className="feature-card card h-100 p-4 text-center">
              <div className="feature-icon">{icon}</div>
              <h5 className="fw-bold mb-2">{title}</h5>
              <p className="text-muted small mb-0">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
