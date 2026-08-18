/**
 * OPERATIONS ANALYTICS & SLA PERFORMANCE DASHBOARD
 * Pure SVG interactive throughput curves, carrier SLA benchmarks, and risk distribution
 */

const AnalyticsComponent = {
  render(container) {
    const state = window.warehouseState;
    const metrics = state.getMetrics();

    container.innerHTML = `
      <!-- Top Analytics KPIs -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Avg Pick Cycle Time</span>
            <div class="metric-icon-wrap cyan">⏱️</div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">4.2 <span style="font-size: 16px; font-weight: 500; color: var(--text-muted);">min</span></span>
            <span class="metric-delta positive">-18% faster</span>
          </div>
          <span class="metric-sub">Target: &lt; 5.0 mins</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Dock Turnaround</span>
            <div class="metric-icon-wrap emerald">🚛</div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">28.4 <span style="font-size: 16px; font-weight: 500; color: var(--text-muted);">min</span></span>
            <span class="metric-delta positive">98.4% On-Time</span>
          </div>
          <span class="metric-sub">Trailer load to depart</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Pick Accuracy Rate</span>
            <div class="metric-icon-wrap blue">🎯</div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">99.6%</span>
            <span class="metric-delta positive">+0.3%</span>
          </div>
          <span class="metric-sub">Scan verification verified</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Exception & Hold Rate</span>
            <div class="metric-icon-wrap rose">🛡️</div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">${((metrics.risky / (metrics.totalOrders || 1)) * 100).toFixed(1)}%</span>
            <span class="metric-delta warning">3 Auto-Resolved</span>
          </div>
          <span class="metric-sub">Anomaly containment active</span>
        </div>
      </div>

      <!-- Main Charts Split -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
        
        <!-- Hourly Throughput Chart (Pure SVG) -->
        <div class="glass-panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                Hourly Operations Throughput (Picked vs Dispatched)
              </h2>
              <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Units processed across 24-hour fulfillment cycle</p>
            </div>

            <div style="display: flex; gap: 14px; font-size: 12px;">
              <span style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; background: var(--accent-cyan); border-radius: 2px;"></span> Orders Picked
              </span>
              <span style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; background: var(--accent-emerald); border-radius: 2px;"></span> Dispatched
              </span>
            </div>
          </div>

          <!-- SVG Chart -->
          <div style="width: 100%; height: 260px; position: relative; padding: 10px 0;">
            <svg viewBox="0 0 700 240" style="width: 100%; height: 100%; overflow: visible;">
              <defs>
                <linearGradient id="gradPicked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0"/>
                </linearGradient>
                <linearGradient id="gradDispatched" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
                </linearGradient>
              </defs>

              <!-- Grid Lines -->
              <line x1="40" y1="20" x2="680" y2="20" stroke="#223049" stroke-width="1" stroke-dasharray="4"/>
              <line x1="40" y1="70" x2="680" y2="70" stroke="#223049" stroke-width="1" stroke-dasharray="4"/>
              <line x1="40" y1="120" x2="680" y2="120" stroke="#223049" stroke-width="1" stroke-dasharray="4"/>
              <line x1="40" y1="170" x2="680" y2="170" stroke="#223049" stroke-width="1" stroke-dasharray="4"/>
              <line x1="40" y1="220" x2="680" y2="220" stroke="#2d3f60" stroke-width="1.5"/>

              <!-- Y Axis Labels -->
              <text x="25" y="25" fill="#64748b" font-size="11" font-family="monospace">200</text>
              <text x="25" y="75" fill="#64748b" font-size="11" font-family="monospace">150</text>
              <text x="25" y="125" fill="#64748b" font-size="11" font-family="monospace">100</text>
              <text x="25" y="175" fill="#64748b" font-size="11" font-family="monospace">50</text>
              <text x="25" y="224" fill="#64748b" font-size="11" font-family="monospace">0</text>

              <!-- Picked Area & Line -->
              <path d="M 60 190 L 140 160 L 220 120 L 300 90 L 380 60 L 460 45 L 540 70 L 620 50 L 660 65 L 660 220 L 60 220 Z" fill="url(#gradPicked)"/>
              <path d="M 60 190 L 140 160 L 220 120 L 300 90 L 380 60 L 460 45 L 540 70 L 620 50 L 660 65" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>

              <!-- Dispatched Area & Line -->
              <path d="M 60 210 L 140 185 L 220 145 L 300 115 L 380 85 L 460 70 L 540 60 L 620 55 L 660 75 L 660 220 L 60 220 Z" fill="url(#gradDispatched)"/>
              <path d="M 60 210 L 140 185 L 220 145 L 300 115 L 380 85 L 460 70 L 540 60 L 620 55 L 660 75" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>

              <!-- X Axis Labels -->
              <text x="60" y="238" fill="#94a3b8" font-size="11" text-anchor="middle">08:00</text>
              <text x="140" y="238" fill="#94a3b8" font-size="11" text-anchor="middle">10:00</text>
              <text x="220" y="238" fill="#94a3b8" font-size="11" text-anchor="middle">12:00</text>
              <text x="300" y="238" fill="#94a3b8" font-size="11" text-anchor="middle">14:00</text>
              <text x="380" y="238" fill="#94a3b8" font-size="11" text-anchor="middle">16:00</text>
              <text x="460" y="238" fill="#94a3b8" font-size="11" text-anchor="middle">18:00</text>
              <text x="540" y="238" fill="#94a3b8" font-size="11" text-anchor="middle">20:00</text>
              <text x="620" y="238" fill="#94a3b8" font-size="11" text-anchor="middle">22:00</text>
            </svg>
          </div>
        </div>

        <!-- Carrier On-Time SLA Breakdown -->
        <div class="glass-panel">
          <div class="panel-header">
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-amber)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
              Carrier SLA Performance
            </h2>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 10px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 4px;">
                <span style="font-weight: 600;">FedEx Express</span>
                <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-emerald);">99.2%</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill emerald" style="width: 99.2%;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 4px;">
                <span style="font-weight: 600;">DHL Worldwide</span>
                <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-emerald);">98.8%</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill emerald" style="width: 98.8%;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 4px;">
                <span style="font-weight: 600;">UPS Ground</span>
                <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-amber);">96.5%</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill amber" style="width: 96.5%;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 4px;">
                <span style="font-weight: 600;">Internal Fleet Logistics</span>
                <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan);">99.5%</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" style="width: 99.5%;"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }
};

window.AnalyticsComponent = AnalyticsComponent;
