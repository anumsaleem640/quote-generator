import { useEffect, useState } from "react";
import CategorySelector from "../components/dashboard/CategorySelector.jsx";
import ProfilePanel from "../components/dashboard/ProfilePanel.jsx";
import QuoteDisplay from "../components/dashboard/QuoteDisplay.jsx";
import SettingsPanel from "../components/dashboard/SettingsPanel.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useQuoteTimer from "../hooks/useQuoteTimer.js";
import { getQuoteCount } from "../services/quoteService.js";
import { getUserProfile } from "../services/userService.js";

/**
 * Dashboard
 * The authenticated main view.
 *
 * Architecture:
 *  - Loads the full user profile from the API on mount (fresher than
 *    the auth-response snapshot stored in AuthContext).
 *  - Passes the user's quoteRefreshInterval into useQuoteTimer.
 *  - When the user saves a new interval (SettingsPanel) or new categories
 *    (CategorySelector), the Dashboard receives the updated user via
 *    onSaved callbacks and updates local state — triggering useQuoteTimer
 *    to restart with the new interval.
 */

const Dashboard = () => {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [quoteCount, setQuoteCount] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState("quote"); // 'quote' | 'categories' | 'settings'

  // The refresh interval drives useQuoteTimer.
  // Initialise from authUser to avoid a blank interval before the profile loads.
  const [interval, setInterval] = useState(
    authUser?.quoteRefreshInterval || "1hour",
  );

  // ── Load full profile from API ──────────────────────────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileRes, countRes] = await Promise.all([
          getUserProfile(),
          getQuoteCount(),
        ]);
        const fetchedUser = profileRes.data.data.user;
        setUser(fetchedUser);
        setInterval(fetchedUser.quoteRefreshInterval || "1hour");
        setQuoteCount(countRes.data.data.count ?? null);
      } catch (err) {
        console.error("Failed to load profile:", err);
        // Fall back to the auth snapshot so the dashboard still renders
        setUser(authUser);
      } finally {
        setLoadingUser(false);
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Quote timer ─────────────────────────────────────────────────────────────
  // Restarts automatically whenever `interval` changes
  const {
    quote,
    loading: quoteLoading,
    error: quoteError,
    secondsLeft,
    manualRefresh,
  } = useQuoteTimer(interval);

  // ── Callbacks from child panels ─────────────────────────────────────────────
  const handleUserSaved = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser.quoteRefreshInterval) {
      setInterval(updatedUser.quoteRefreshInterval);
    }
    // Re-fetch quote count if categories changed
    getQuoteCount()
      .then(({ data }) => setQuoteCount(data.data.count ?? null))
      .catch(() => {});
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  const displayUser = user || authUser;

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(160deg,#f8faff 0%,#f0f4ff 100%)",
        paddingTop: "80px",
      }}
    >
      <div className="container py-4">
        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="mb-4">
          <h1 className="fw-bold mb-1" style={{ fontSize: "1.75rem" }}>
            Good {getGreeting()},{" "}
            <span style={{ color: "#6366f1" }}>{displayUser?.firstName}</span>{" "}
            👋
          </h1>
          <p className="text-muted small mb-0">
            {interval === "1min" && "Your quote refreshes every minute."}
            {interval === "1hour" && "Your quote refreshes every hour."}
            {interval === "1day" && "Your quote refreshes once a day."}
          </p>
        </div>

        {/* ── Mobile tab nav ────────────────────────────────────────────────── */}
        <ul className="nav nav-pills mb-4 d-lg-none gap-1 flex-nowrap overflow-auto pb-1">
          {[
            { key: "quote", label: "💬 Quote" },
            { key: "categories", label: "📂 Categories" },
            { key: "settings", label: "⚙️ Settings" },
          ].map(({ key, label }) => (
            <li key={key} className="nav-item flex-shrink-0">
              <button
                type="button"
                className={`nav-link ${activeTab === key ? "active" : ""}`}
                onClick={() => setActiveTab(key)}
                style={{ fontSize: "0.82rem", whiteSpace: "nowrap" }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* ── Main layout ───────────────────────────────────────────────────── */}
        <div className="row g-4">
          {/* Left: quote + settings panels */}
          <div className="col-lg-8">
            {/* Quote display — visible on desktop always; on mobile only when tab = quote */}
            <div
              className={`mb-4 ${activeTab !== "quote" ? "d-lg-block d-none" : ""}`}
            >
              <QuoteDisplay
                quote={quote}
                loading={quoteLoading}
                error={quoteError}
                secondsLeft={secondsLeft}
                onRefresh={manualRefresh}
                interval={interval}
              />
            </div>

            {/* Categories — always visible on desktop; tabbed on mobile */}
            <div
              className={activeTab !== "categories" ? "d-lg-block d-none" : ""}
            >
              {!loadingUser && (
                <CategorySelector
                  user={displayUser}
                  onSaved={handleUserSaved}
                />
              )}
            </div>
          </div>

          {/* Right: profile + settings sidebar */}
          <div className="col-lg-4">
            <div
              className={`mb-4 ${activeTab === "categories" ? "d-lg-block d-none" : ""}`}
            >
              <ProfilePanel user={displayUser} quoteCount={quoteCount} />
            </div>

            <div
              className={activeTab !== "settings" ? "d-lg-block d-none" : ""}
            >
              {!loadingUser && (
                <SettingsPanel
                  currentInterval={interval}
                  onSaved={handleUserSaved}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Returns 'morning', 'afternoon', or 'evening' based on the current hour. */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
};

export default Dashboard;
