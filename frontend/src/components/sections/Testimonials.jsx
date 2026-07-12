/**
 * Testimonials
 * Three social-proof cards from fictional users.
 * The decorative opening quote mark is added via CSS ::before in index.css.
 */

const TESTIMONIALS = [
  {
    text: "I start every morning with a new quote from the Wisdom category. It sets the tone for my entire day. Simple, but genuinely impactful.",
    name: "Aisha Rahman",
    role: "Product Manager",
    avatar: "🌟",
  },
  {
    text: "The auto-refresh feature is brilliant. I set it to every hour and I've discovered quotes I'd never have found on my own. Worth every penny of the Premium plan.",
    name: "James O'Brien",
    role: "Software Engineer",
    avatar: "💡",
  },
  {
    text: "I was sceptical at first, but after a month with the Motivation and Leadership categories my mindset genuinely shifted. Completely changed my morning routine.",
    name: "Sara Malik",
    role: "Entrepreneur",
    avatar: "🚀",
  },
];

const Testimonials = () => (
  <section className="section-padding" id="testimonials">
    <div className="container">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-3">
          Testimonials
        </span>
        <h2 className="display-6 fw-bold mb-3">Loved by readers worldwide</h2>
        <p className="text-muted lead">Real words from real users.</p>
      </div>

      <div className="row g-4">
        {TESTIMONIALS.map(({ text, name, role, avatar }) => (
          <div key={name} className="col-md-4">
            <div className="testimonial-card card h-100 p-4 pt-5">
              <p className="text-muted mb-4 lh-lg small">"{text}"</p>

              {/* Author row */}
              <div className="d-flex align-items-center gap-3 mt-auto">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fs-5 flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                  }}
                  aria-hidden="true"
                >
                  {avatar}
                </div>
                <div>
                  <div className="fw-semibold small">{name}</div>
                  <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                    {role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
