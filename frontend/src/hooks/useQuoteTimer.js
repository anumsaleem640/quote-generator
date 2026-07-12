import { useCallback, useEffect, useRef, useState } from "react";
import { getRandomQuote } from "../services/quoteService.js";

/**
 * useQuoteTimer
 * Custom hook that manages:
 *  1. Fetching a random quote from the API
 *  2. Auto-refreshing at the user's chosen interval
 *  3. A live countdown (seconds remaining until next auto-refresh)
 *  4. A manual refresh function that resets the timer
 *
 * Why a custom hook instead of putting this logic in the component?
 * The Dashboard component stays clean — it just calls useQuoteTimer()
 * and gets back { quote, loading, error, secondsLeft, fetchQuote }.
 * All the timer, cleanup, and state management lives here and is
 * independently testable.
 *
 * @param {string} intervalSetting  — '1min' | '1hour' | '1day'
 * @returns {{ quote, loading, error, secondsLeft, fetchQuote }}
 */

// Map the user-readable setting to milliseconds
const INTERVAL_MS = {
  "1min": 60 * 1000,
  "1hour": 60 * 60 * 1000,
  "1day": 24 * 60 * 60 * 1000,
};

const useQuoteTimer = (intervalSetting = "1hour") => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  // useRef stores the interval without causing re-renders when it changes.
  // This is the recommended pattern for storing timer IDs in React.
  const autoTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  // ── fetchQuote ────────────────────────────────────────────────────────────
  // useCallback with [] — stable reference so useEffect deps don't change
  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getRandomQuote();
      setQuote(data.data.quote);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load a quote. Check your category settings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auto-refresh timer ────────────────────────────────────────────────────
  useEffect(() => {
    const intervalMs = INTERVAL_MS[intervalSetting] || INTERVAL_MS["1hour"];

    // Initial fetch when the hook mounts or the interval changes
    fetchQuote();
    setSecondsLeft(Math.floor(intervalMs / 1000));

    // Auto-refresh: fires once per interval to get the next quote
    autoTimerRef.current = setInterval(() => {
      fetchQuote();
      setSecondsLeft(Math.floor(intervalMs / 1000));
    }, intervalMs);

    // Countdown: ticks down every second for the UI display
    countdownTimerRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Cleanup — CRITICAL: clears both timers when:
    //   a) The component unmounts (user navigates away)
    //   b) intervalSetting changes (the effect re-runs)
    // Without this, old timers continue firing after cleanup, causing
    // setState calls on unmounted components and doubled refresh rates.
    return () => {
      clearInterval(autoTimerRef.current);
      clearInterval(countdownTimerRef.current);
    };
  }, [intervalSetting, fetchQuote]);

  // ── manualRefresh ─────────────────────────────────────────────────────────
  // Fetches a new quote immediately and resets the auto-refresh clock.
  // Exposed so QuoteDisplay's Refresh button can call it directly.
  const manualRefresh = useCallback(async () => {
    const intervalMs = INTERVAL_MS[intervalSetting] || INTERVAL_MS["1hour"];

    // Clear old timers
    clearInterval(autoTimerRef.current);
    clearInterval(countdownTimerRef.current);

    await fetchQuote();
    setSecondsLeft(Math.floor(intervalMs / 1000));

    // Restart auto-refresh from zero
    autoTimerRef.current = setInterval(() => {
      fetchQuote();
      setSecondsLeft(Math.floor(intervalMs / 1000));
    }, intervalMs);

    // Restart countdown
    countdownTimerRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  }, [intervalSetting, fetchQuote]);

  return { quote, loading, error, secondsLeft, manualRefresh };
};

export default useQuoteTimer;
