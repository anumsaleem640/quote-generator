import { useEffect, useState } from "react";

/**
 * Hero
 * Full-height opening section with a dark gradient background.
 *
 * The rotating demo quote card auto-cycles through 4 quotes with a
 * CSS opacity fade. This gives visitors an instant feel for the product
 * without being logged in.
 *
 * Both CTA buttons use Bootstrap data attributes to open modals —
 * no onClick handlers needed. Bootstrap's bundled JS handles this.
 */

const DEMO_QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Motivation",
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Wisdom",
  },
  {
    text: "It does not matter how slowly you go, so long as you do not stop.",
    author: "Confucius",
    category: "Perseverance",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Life",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % DEMO_QUOTES.length);
        setVisible(true);
      }, 400); // match the CSS transition duration
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const q = DEMO_QUOTES[current];

  return (
    <section className="hero-section d-flex align-items-center" id="home">
      <div className="container py-5">
        <div className="row align-items-center g-5">
          {/* ── Left: headline + CTAs ───────────────────────────────────── */}
          <div className="col-lg-6">
            <span className="badge bg-primary bg-opacity-25 text-light border border-primary border-opacity-25 mb-3 px-3 py-2">
              ✨ Personalized daily wisdom
            </span>

            <h1 className="display-4 fw-bold mb-4 lh-sm">
              Daily Wisdom,{" "}
              <span className="gradient-text">Curated for You</span>
            </h1>

            <p className="lead text-white-50 mb-5" style={{ lineHeight: 1.8 }}>
              Choose the topics that inspire you. Receive hand-picked quotes
              delivered automatically — every minute, hour, or day.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-primary btn-lg px-5 py-3 fw-semibold shadow"
                data-bs-toggle="modal"
                data-bs-target="#registerModal"
              >
                Start for Free
              </button>
              <a
                href="#pricing"
                className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold"
              >
                View Plans
              </a>
            </div>

            <p className="text-white-50 small mt-3 mb-0">
              No credit card required · Free plan always available
            </p>
          </div>

          {/* ── Right: animated demo quote card ────────────────────────── */}
          <div className="col-lg-6 d-flex justify-content-center">
            <div
              className={`quote-card p-5 w-100 ${visible ? "fade-in" : "fade-out"}`}
              style={{ maxWidth: "480px" }}
              aria-live="polite"
              aria-label="Demo quote"
            >
              <div className="quote-mark" aria-hidden="true">
                "
              </div>
              <p className="fs-5 fw-medium text-white mb-4 lh-lg">{q.text}</p>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-semibold text-white">— {q.author}</div>
                  <div className="small" style={{ color: "#a5b4fc" }}>
                    #{q.category}
                  </div>
                </div>
                <span
                  className="badge rounded-pill px-3 py-2 small"
                  style={{
                    background: "rgba(99,102,241,0.35)",
                    color: "#c7d2fe",
                  }}
                >
                  Auto-refreshing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats strip ─────────────────────────────────────────────── */}
        <div className="row g-4 mt-5 pt-4 border-top border-white border-opacity-10">
          {[
            { value: "10,000+", label: "Quotes in library" },
            { value: "50+", label: "Topic categories" },
            { value: "3", label: "Refresh intervals" },
          ].map(({ value, label }) => (
            <div key={label} className="col-4 text-center">
              <div className="fs-2 fw-bold gradient-text">{value}</div>
              <div className="text-white-50 small">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
