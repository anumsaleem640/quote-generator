/**
 * ProfilePanel
 * Displays the logged-in user's name, email, plan badge, and
 * selected category count. Read-only — no editing in this phase.
 *
 * Props:
 *  user        — the user document from AuthContext or the API
 *  quoteCount  — number of available quotes in the user's categories
 */

const PLAN_STYLES = {
  premium: {
    badge: "bg-warning text-dark",
    label: "⭐ Premium",
    desc: "Unlimited categories · Priority updates",
  },
  free: {
    badge: "bg-light text-muted border",
    label: "✦ Free Plan",
    desc: "Up to 5 categories · Standard refresh",
  },
};

const ProfilePanel = ({ user, quoteCount }) => {
  if (!user) return null;

  const plan = PLAN_STYLES[user.subscriptionType] || PLAN_STYLES.free;
  const initials = [user.firstName?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      {/* Avatar + name row */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
          style={{
            width: 52,
            height: 52,
            background: "linear-gradient(135deg,#6366f1,#06b6d4)",
            fontSize: "1.1rem",
          }}
          aria-hidden="true"
        >
          {initials || "👤"}
        </div>
        <div>
          <div className="fw-bold">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-muted small">{user.email}</div>
        </div>
      </div>

      {/* Plan badge */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-muted small fw-semibold">Current Plan</span>
        <span
          className={`badge rounded-pill px-3 py-2 ${plan.badge}`}
          style={{ fontSize: "0.75rem" }}
        >
          {plan.label}
        </span>
      </div>
      <p className="text-muted small mb-4">{plan.desc}</p>

      <hr className="my-3" />

      {/* Stats */}
      <div className="row g-3 text-center">
        <div className="col-6">
          <div className="fw-bold fs-4" style={{ color: "#6366f1" }}>
            {user.selectedCategories?.length ?? 0}
          </div>
          <div className="text-muted" style={{ fontSize: "0.73rem" }}>
            {user.subscriptionType === "premium"
              ? "Categories"
              : "of 5 categories"}
          </div>
        </div>
        <div className="col-6">
          <div className="fw-bold fs-4" style={{ color: "#06b6d4" }}>
            {quoteCount ?? "—"}
          </div>
          <div className="text-muted" style={{ fontSize: "0.73rem" }}>
            Quotes available
          </div>
        </div>
      </div>

      {/* Upgrade CTA for free users */}
      {user.subscriptionType !== "premium" && (
        <>
          <hr className="my-3" />
          <div
            className="p-3 rounded-3 text-center"
            style={{
              background: "linear-gradient(135deg,#6366f120,#06b6d420)",
            }}
          >
            <p className="small fw-semibold mb-2" style={{ color: "#4f46e5" }}>
              Unlock unlimited categories
            </p>
            <p className="text-muted mb-3" style={{ fontSize: "0.75rem" }}>
              Upgrade to Premium for $9.99/month and remove all limits.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm px-4 fw-semibold w-100"
            >
              ⭐ Upgrade to Premium
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePanel;
