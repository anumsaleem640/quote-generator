"use strict";

/**
 * Generates the graphical HTML view for the 404 Not Found Screen.
 * @param {Object} data Request data variables
 * @returns {string} Compiled HTML page string
 */

export const generateNotFoundHtml = ({ method, requestedPath }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Page Not Found</title>
      <style>
        :root {
          --bg-color: #0d1117;
          --panel-bg: #161b22;
          --accent-red: #da3637;
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
        .error-container {
          background-color: var(--panel-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          padding: 40px 30px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .error-code {
          font-size: 72px;
          font-weight: 800;
          color: var(--accent-red);
          margin: 0 0 10px 0;
          line-height: 1;
        }
        h1 {
          font-size: 22px;
          margin: 0 0 20px 0;
          font-weight: 600;
        }
        .details-box {
          background-color: #0d1117;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 16px;
          text-align: left;
          font-family: monospace;
          font-size: 14px;
          margin-bottom: 25px;
        }
        .detail-line {
          margin: 4px 0;
        }
        .label {
          color: var(--text-muted);
        }
        .value {
          color: #ff7b72;
        }
        .suggestion {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .btn {
          display: inline-block;
          background-color: #21262d;
          border: 1px solid var(--border-color);
          color: #58a6ff;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .btn:hover {
          background-color: #30363d;
          border-color: #8b949e;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-code">404</div>
        <h1>Resource Not Found</h1>

        <p class="suggestion">
          The link you requested could not be found. Please check the API endpoint path documentation or spelling.
        </p>

        <div class="details-box">
          <div class="detail-line"><span class="label">Method:</span> <span class="value" style="color: #58a6ff;">${method}</span></div>
          <div class="detail-line"><span class="label">Route Path:</span> <span class="value">${requestedPath}</span></div>
        </div>

        <a href="/api" class="btn">Return to API Dashboard</a>
      </div>
    </body>
    </html>
  `;
};
