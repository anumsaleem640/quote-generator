"use strict";

/**
 * Generates the graphical HTML dashboard view for the API Root Gateway.
 * @param {Object} data System analytics properties
 * @returns {string} Compiled HTML page string
 */

export const generateDashboardHtml = ({ environment, uptime, timestamp }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quote Generator API Hub</title>
      <style>
        :root {
          --bg-color: #0d1117;
          --panel-bg: #161b22;
          --accent-green: #238636;
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
        .dashboard {
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
        .badge {
          background-color: rgba(35, 134, 54, 0.15);
          color: #58a6ff;
          border: 1px solid rgba(56, 139, 253, 0.4);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }
        .status-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          background-color: #2ea44f;
          border-radius: 50%;
          margin-right: 8px;
          box-shadow: 0 0 8px #2ea44f;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 30px;
        }
        .card {
          background-color: rgba(255,255,255,0.02);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
        }
        .card-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 6px;
          font-weight: 600;
        }
        .card-value {
          font-size: 16px;
          font-weight: 500;
        }
        .endpoints-title {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 12px;
          font-weight: 600;
        }
        .endpoint-link {
          display: block;
          background-color: #0d1117;
          border: 1px solid var(--border-color);
          color: #58a6ff;
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 14px;
          margin-bottom: 10px;
          transition: border-color 0.2s;
        }
        .endpoint-link:hover {
          border-color: #58a6ff;
        }
      </style>
    </head>
    <body>
      <div class="dashboard">
        <div class="header">
          <h1>Quote Generator Engine</h1>
          <span class="badge"><span class="status-dot"></span>Active</span>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-label">Gateway Status</div>
            <div class="card-value" style="color: #2ea44f;">Operational</div>
          </div>
          <div class="card">
            <div class="card-label">Environment</div>
            <div class="card-value">${environment}</div>
          </div>
          <div class="card">
            <div class="card-label">Uptime</div>
            <div class="card-value">${uptime} seconds</div>
          </div>
          <div class="card">
            <div class="card-label">System Time</div>
            <div class="card-value" style="font-size: 14px;">${timestamp}</div>
          </div>
        </div>

        <div class="endpoints-title">Available Gateways</div>
        <a href="/api/health" class="endpoint-link">GET /api/health → Health System Check</a>
        <a href="/api/quotes" class="endpoint-link" style="color: var(--text-muted); pointer-events: none;">GET /api/quotes → Quotes Router [🔒 Protected]</a>
      </div>
    </body>
    </html>
  `;
};
