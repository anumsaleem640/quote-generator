"use strict";

/**
 * Generates the graphical HTML view for the API Health Monitor Screen.
 * @param {Object} metrics Live health diagnostics variables
 * @returns {string} Compiled HTML page string
 */
export const generateHealthHtml = ({
  status,
  dbStatus,
  uptime,
  memory,
  cpu,
  timestamp,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>System Health Monitor</title>
      <style>
        :root {
          --bg-color: #0d1117;
          --panel-bg: #161b22;
          --accent-green: #2ea44f;
          --accent-blue: #58a6ff;
          --text-main: #c9d1d9;
          --text-muted: #8b949e;
          --border-color: #30363d;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          background-color: var(--bg-color);
          color: var(--text-main);
          margin: 0;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
        }
        .monitor-container {
          background-color: var(--panel-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          width: 100%;
          max-width: 650px;
          padding: 30px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 25px;
        }
        h1 {
          font-size: 22px;
          margin: 0;
          font-weight: 600;
        }
        .status-pill {
          background-color: rgba(46, 164, 79, 0.15);
          color: var(--accent-green);
          border: 1px solid rgba(46, 164, 79, 0.4);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: var(--accent-green);
          border-radius: 50%;
          margin-right: 8px;
          box-shadow: 0 0 8px var(--accent-green);
        }
        .section-title {
          font-size: 14px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin: 25px 0 12px 0;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .metric-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(48, 54, 61, 0.5);
          font-size: 15px;
        }
        .metric-row:last-child {
          border-bottom: none;
        }
        .label {
          color: var(--text-muted);
        }
        .value {
          font-weight: 500;
        }
        .value.ok {
          color: var(--accent-green);
        }
        .btn-group {
          margin-top: 30px;
          display: flex;
          gap: 12px;
        }
        .btn {
          flex: 1;
          text-align: center;
          background-color: #21262d;
          border: 1px solid var(--border-color);
          color: var(--accent-blue);
          text-decoration: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #30363d;
        }
      </style>
    </head>
    <body>
      <div class="monitor-container">
        <div class="header">
          <h1>System Diagnostics</h1>
          <div class="status-pill"><span class="dot"></span>${status}</div>
        </div>

        <div class="section-title">Database Core</div>
        <div class="metric-row">
          <span class="label">MongoDB Connection</span>
          <span class="value ok">${dbStatus}</span>
        </div>

        <div class="section-title">Process Metrics</div>
        <div class="metric-row">
          <span class="label">System Uptime</span>
          <span class="value">${uptime}</span>
        </div>
        <div class="metric-row">
          <span class="label">Memory Allocated (RSS)</span>
          <span class="value">${memory.rss}</span>
        </div>
        <div class="metric-row">
          <span class="label">V8 Heap Active</span>
          <span class="value">${memory.heapUsed} / ${memory.heapTotal}</span>
        </div>
        <div class="metric-row">
          <span class="label">CPU Execution Load</span>
          <span class="value">${cpu}</span>
        </div>

        <div class="section-title">Telemetry Context</div>
        <div class="metric-row">
          <span class="label">Last Heartbeat Checked</span>
          <span class="value" style="font-size: 13px; font-family: monospace;">${timestamp}</span>
        </div>

        <div class="btn-group">
          <a href="/api" class="btn">Dashboard</a>
          <a href="" class="btn" onclick="window.location.reload(); return false;" style="color: var(--text-main);">Refresh Stats</a>
        </div>
      </div>
    </body>
    </html>
  `;
};
