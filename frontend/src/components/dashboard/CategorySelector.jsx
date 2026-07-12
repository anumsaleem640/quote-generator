import { useEffect, useState } from "react";
import { getAllCategories } from "../../services/quoteService.js";
import { updateCategories } from "../../services/userService.js";

/**
 * CategorySelector
 * Lets the user pick which categories they want quotes from.
 *
 * Free plan: max 5 categories (limit shown dynamically, from API response
 * or hardcoded fallback). Selecting beyond the limit is blocked with a
 * client-side message — the backend enforces the same rule server-side.
 *
 * Props:
 *  user         — the current user document (for subscriptionType + selectedCategories)
 *  onSaved      — callback invoked with the updated user after a successful save
 *  maxFree      — max categories for free users (default 5)
 */

const MAX_FREE = 5;

const CategorySelector = ({ user, onSaved }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isPremium = user?.subscriptionType === "premium";
  const limit = isPremium ? Infinity : MAX_FREE;

  // ── Load categories on mount ────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getAllCategories();
        setAllCategories(data.data.categories || []);
      } catch {
        setError("Could not load categories. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Sync selected IDs from the user prop ───────────────────────────────────
  useEffect(() => {
    if (user?.selectedCategories) {
      // selectedCategories may be ObjectIds or populated objects — handle both
      setSelected(
        user.selectedCategories.map((c) => (typeof c === "string" ? c : c._id)),
      );
    }
  }, [user]);

  // ── Toggle a category ───────────────────────────────────────────────────────
  const toggle = (id) => {
    setError("");
    setSuccess("");
    setSelected((prev) => {
      if (prev.includes(id)) {
        // Deselecting — always allowed
        return prev.filter((c) => c !== id);
      }
      // Selecting — check the free plan limit
      if (!isPremium && prev.length >= MAX_FREE) {
        setError(
          `Free plan allows up to ${MAX_FREE} categories. ` +
            `Deselect one first, or upgrade to Premium.`,
        );
        return prev;
      }
      return [...prev, id];
    });
  };

  // ── Save changes ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await updateCategories(selected);
      setSuccess("Categories saved! Your quote feed will update shortly.");
      if (onSaved) onSaved(data.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save categories. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="placeholder-glow">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="placeholder col-5 me-2 mb-3 rounded"
              style={{ height: "2.5rem" }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-1">
        <h5 className="fw-bold mb-0">📂 My Categories</h5>
        <span
          className={`badge rounded-pill ${isPremium ? "bg-warning text-dark" : "bg-light text-muted border"}`}
          style={{ fontSize: "0.72rem" }}
        >
          {isPremium
            ? "⭐ Premium — unlimited"
            : `${selected.length} / ${MAX_FREE} selected`}
        </span>
      </div>
      <p className="text-muted small mb-4">
        {isPremium
          ? "Choose as many categories as you like."
          : `Choose up to ${MAX_FREE} categories. Upgrade for unlimited access.`}
      </p>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger   py-2 small mb-3">{error}</div>
      )}
      {success && (
        <div className="alert alert-success  py-2 small mb-3">{success}</div>
      )}

      {/* Category grid */}
      {allCategories.length === 0 ? (
        <div className="text-center text-muted py-4 small">
          No categories available yet. An admin needs to add some first.
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-2 mb-4">
          {allCategories.map((cat) => {
            const isSelected = selected.includes(cat._id);
            const isDisabled =
              !isSelected && !isPremium && selected.length >= MAX_FREE;

            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => toggle(cat._id)}
                disabled={isDisabled}
                title={
                  isDisabled
                    ? `Free plan limit reached (${MAX_FREE} max)`
                    : cat.description || cat.name
                }
                className={`btn btn-sm rounded-pill px-3 py-2 ${
                  isSelected
                    ? "btn-primary"
                    : isDisabled
                      ? "btn-outline-secondary opacity-50"
                      : "btn-outline-secondary"
                }`}
                style={{ fontSize: "0.82rem", transition: "all 0.15s" }}
              >
                {isSelected && "✓ "}
                {cat.name}
                <span
                  className="ms-1 opacity-50"
                  style={{ fontSize: "0.68rem" }}
                >
                  ({cat.quoteCount ?? 0})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Save button */}
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-primary px-4 fw-semibold"
          onClick={handleSave}
          disabled={saving || allCategories.length === 0}
        >
          {saving ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Saving…
            </>
          ) : (
            "Save categories"
          )}
        </button>
      </div>
    </div>
  );
};

export default CategorySelector;
