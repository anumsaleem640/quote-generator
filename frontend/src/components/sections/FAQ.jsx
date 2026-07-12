/**
 * FAQ
 * Bootstrap accordion — only one panel open at a time via data-bs-parent.
 * First item is open by default.
 * No JavaScript needed — Bootstrap handles open/close via data attributes.
 */

const FAQ_ITEMS = [
  {
    q: "How does the automatic quote refresh work?",
    a: "Once you choose a refresh interval (1 minute, 1 hour, or 1 day) in your dashboard, the frontend timer triggers a new API call on that schedule. The backend picks a random active quote from your selected categories and returns it. Nothing needs to be refreshed manually.",
  },
  {
    q: "Can I change my categories after signing up?",
    a: "Yes, anytime. Open your dashboard, go to Category Settings, and add or remove categories. Free plan users can select up to 5. Premium users have no limit and the change takes effect immediately.",
  },
  {
    q: "What happens when I hit the 5-category limit on the free plan?",
    a: "You'll see a message explaining the limit. You can swap existing categories for different ones at any time. To add more simultaneously, upgrade to Premium for unlimited category access.",
  },
  {
    q: "Is there a mobile app?",
    a: "Yes — a React Native app for iOS and Android. It connects to the same backend, respects your category and refresh settings from the web dashboard, and lets you fetch a new quote with a single tap.",
  },
  {
    q: "How is my password protected?",
    a: "Your password is hashed with bcrypt (12 salt rounds) before it is ever written to the database. We never store plain text. Sessions are secured with signed JWTs. Even in the event of a data breach, your password cannot be recovered from what we store.",
  },
  {
    q: "Can I cancel my Premium subscription?",
    a: "Absolutely. Cancel any time from your account settings. You keep Premium access until the end of your current billing period, then automatically revert to the free plan with no charges.",
  },
];

const FAQ = () => (
  <section className="section-padding" id="faq">
    <div className="container">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-3">
          FAQ
        </span>
        <h2 className="display-6 fw-bold mb-3">Common questions</h2>
        <p className="text-muted lead">
          Everything you want to know about Quote Generator.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="accordion accordion-flush" id="faqAccordion">
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <div
                key={i}
                className="accordion-item border rounded mb-3 overflow-hidden"
              >
                <h3 className="accordion-header">
                  <button
                    className={`accordion-button fw-semibold small ${i !== 0 ? "collapsed" : ""}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faqItem${i}`}
                    aria-expanded={i === 0}
                    aria-controls={`faqItem${i}`}
                  >
                    {q}
                  </button>
                </h3>
                <div
                  id={`faqItem${i}`}
                  className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body small text-muted lh-lg">
                    {a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <p className="text-muted small mb-3">Still have questions?</p>
            <button
              type="button"
              className="btn btn-primary px-4"
              data-bs-toggle="modal"
              data-bs-target="#registerModal"
            >
              Sign up and explore
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FAQ;
