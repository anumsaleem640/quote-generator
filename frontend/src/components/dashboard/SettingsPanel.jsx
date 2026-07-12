import { useState } from "react";
import { updateSettings } from "../../services/userService.js";

/**
 * SettingsPanel
 * Three-option radio group for the quote refresh interval.
 *
 * On selection: immediately calls the API and invokes onSaved with the
 * updated user so the Dashboard can restart the timer with the new value.
 *
 * Props:
 *  currentInterval — the user's current setting ('1min'|'1hour'|'1day')
 *  onSaved         — callback(updatedUser) invoked on a successful save
 */

const OPTIONS = [
  {
    value: "1min",
    label: "Every Minute",
    desc: "Best for moments when you want constant fresh inspiration.",
    icon: "⚡",
    badgeColor: "#ef4444",
  },
  {
    value: "1hour",
    label: "Every Hour",
    desc: "A steady stream — a new perspective every time you open the app.",
    icon: "🕐",
    badgeColor: "#6366f1",
  },
  {
    value: "1day",
    label: "Once a Day",
    desc: "One daily quote to reflect on throughout the whole day.",
    icon: "🌅",
    badgeColor: "#f59e0b",
  },
];

const SettingsPanel = ({ currentInterval, onSaved }) => {
  const [selected, setSelected] = useState(currentInterval || "1hour");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    if (selected === currentInterval) return; // nothing changed
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await updateSettings(selected);
      setSuccess("Refresh interval updated!");
      if (onSaved) onSaved(data.data.user);
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h5 className="fw-bold mb-1">⏱ Refresh Interval</h5>
      <p className="text-muted small mb-4">
        How often should a new quote appear automatically?
      </p>

      {error && (
        <div className="alert alert-danger  py-2 small mb-3">{error}</div>
      )}
      {success && (
        <div className="alert alert-success py-2 small mb-3">{success}</div>
      )}

      <div className="d-flex flex-column gap-3 mb-4">
        {OPTIONS.map(({ value, label, desc, icon, badgeColor }) => {
          const isActive = selected === value;
          return (
            <label
              key={value}
              className={`d-flex align-items-center gap-3 p-3 rounded-3 border cursor-pointer ${
                isActive
                  ? "border-primary bg-primary bg-opacity-10"
                  : "border-light-subtle"
              }`}
              style={{ cursor: "pointer", transition: "all 0.15s" }}
            >
              <input
                type="radio"
                name="refreshInterval"
                value={value}
                checked={isActive}
                onChange={() => {
                  setSelected(value);
                  setError("");
                  setSuccess("");
                }}
                className="form-check-input m-0 flex-shrink-0"
              />
              <span
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  background: badgeColor + "22",
                  fontSize: "1.1rem",
                }}
              >
                {icon}
              </span>
              <div>
                <div className="fw-semibold small">{label}</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {desc}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-primary px-4 fw-semibold"
          onClick={handleSave}
          disabled={saving || selected === currentInterval}
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
            "Save interval"
          )}
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
