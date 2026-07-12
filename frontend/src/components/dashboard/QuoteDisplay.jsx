import { useEffect, useState } from "react";

/**
 * QuoteDisplay
 * Renders the current quote with its author, category, and a live countdown.
 *
 * Props:
 *  quote        — { quoteText, author, category: { name }, fetchedAt }
 *  loading      — boolean: show skeleton while fetching
 *  error        — string: show error state if the API failed
 *  secondsLeft  — number: seconds until next auto-refresh
 *  onRefresh    — function: called when the user clicks "New Quote"
 *  interval     — string: '1min' | '1hour' | '1day' for the countdown label
 */

/** Convert total seconds to a human-readable string. */
const formatCountdown = (secs) => {
  if (secs >= 3600) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m}m`;
  }
  if (secs >= 60) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  }
  return `${secs}s`;
};

const INTERVAL_LABELS = {
  "1min": "every minute",
  "1hour": "every hour",
  "1day": "every day",
};

const QuoteDisplay = ({
  quote,
  loading,
  error,
  secondsLeft,
  onRefresh,
  interval,
}) => {
  // Fade animation: reset the key when a new quote arrives so the
  // CSS animation replays from the start.
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    if (quote) setFadeKey((k) => k + 1);
  }, [quote]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading && !quote) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5">
        <div className="placeholder-glow">
          <div
            className="placeholder col-3 mb-4 rounded"
            style={{ height: "2rem" }}
          />
          <div
            className="placeholder col-12 mb-2 rounded"
            style={{ height: "1rem" }}
          />
          <div
            className="placeholder col-10 mb-2 rounded"
            style={{ height: "1rem" }}
          />
          <div
            className="placeholder col-8 mb-4 rounded"
            style={{ height: "1rem" }}
          />
          <div
            className="placeholder col-4 rounded"
            style={{ height: "1rem" }}
          />
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
        <div className="fs-1 mb-3">📭</div>
        <h5 className="fw-semibold mb-2">No quote available</h5>
        <p className="text-muted small mb-4">{error}</p>
        <button
          type="button"
          className="btn btn-primary px-4"
          onClick={onRefresh}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div
      key={fadeKey}
      className="card border-0 shadow-sm rounded-4 p-4 p-md-5"
      style={{ animation: "fadeSlideIn 0.45s ease" }}
    >
      {/* ── Category badge + countdown ────────────────────────────────────── */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <span
          className="badge rounded-pill px-3 py-2 fw-semibold"
          style={{
            background: "linear-gradient(90deg,#6366f1,#06b6d4)",
            color: "#fff",
            fontSize: "0.75rem",
          }}
        >
          #{quote.category?.name || "General"}
        </span>

        <div className="d-flex align-items-center gap-2">
          {loading && (
            <span
              className="spinner-border spinner-border-sm text-primary"
              role="status"
              aria-label="Refreshing"
            />
          )}
          <span
            className="badge rounded-pill bg-light text-muted border fw-normal"
            style={{ fontSize: "0.73rem" }}
            title={`Refreshes ${INTERVAL_LABELS[interval] || "automatically"}`}
          >
            ⏱ {formatCountdown(secondsLeft)}
          </span>
        </div>
      </div>

      {/* ── Quote text ───────────────────────────────────────────────────── */}
      <div
        className="fw-bold mb-1"
        style={{
          fontSize: "3rem",
          color: "#6366f1",
          lineHeight: 1,
          opacity: 0.25,
          fontFamily: "Georgia,serif",
        }}
        aria-hidden="true"
      >
        "
      </div>
      <p
        className="fw-medium lh-lg mb-4"
        style={{ fontSize: "1.25rem", color: "#1e293b" }}
        aria-live="polite"
      >
        {quote.quoteText}
      </p>

      {/* ── Author + timestamp ───────────────────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <div className="fw-semibold text-dark">
            — {quote.author || "Unknown"}
          </div>
          {quote.fetchedAt && (
            <div className="text-muted" style={{ fontSize: "0.73rem" }}>
              Fetched at{" "}
              {new Date(quote.fetchedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>

        {/* Manual refresh button */}
        <button
          type="button"
          className="btn btn-primary px-4 py-2 fw-semibold"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Get a new quote"
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "✨ New Quote"
          )}
        </button>
      </div>

      {/* Inline keyframe — avoids needing a separate CSS file */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
};

export default QuoteDisplay;
