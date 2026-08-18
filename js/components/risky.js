/**
 * RISKY ORDERS & EXCEPTION MANAGEMENT DASHBOARD VIEW
 * Automated Anomaly Detection, Fraud & Geo Flags, Stockout Warnings, and 1-Click Resolution Engine
 */

const RiskyComponent = {
  activeSeverityFilter: 'all',

  render(container) {
    const state = window.warehouseState;
    const allRiskyOrders = state.orders.filter(o => o.status === 'risky' || o.riskScore > 40);

    const displayOrders = this.activeSeverityFilter === 'all'
      ? allRiskyOrders
      : allRiskyOrders.filter(o => o.riskLevel.toLowerCase() === this.activeSeverityFilter.toLowerCase());

    const criticalCount = allRiskyOrders.filter(o => o.riskLevel === 'Critical').length;
    const highCount = allRiskyOrders.filter(o => o.riskLevel === 'High').length;
    const medCount = allRiskyOrders.filter(o => o.riskLevel === 'Medium').length;

    container.innerHTML = `
      <!-- Top Risk Severity Categories -->
      <div class="risk-summary-grid">
        <div class="risk-category-card ${this.activeSeverityFilter === 'all' ? 'active' : ''}" data-severity="all">
          <div class="risk-cat-title">
            <span>Total Flagged Exceptions</span>
            <span style="font-size: 14px;">⚠️</span>
          </div>
          <div class="risk-cat-count" style="color: #fff;">${allRiskyOrders.length}</div>
          <span style="font-size: 11px; color: var(--text-muted);">Active warehouse holds</span>
        </div>

        <div class="risk-category-card ${this.activeSeverityFilter === 'critical' ? 'active' : ''}" data-severity="critical">
          <div class="risk-cat-title">
            <span>Critical Severity (90%+)</span>
            <span class="severity-badge critical">Critical</span>
          </div>
          <div class="risk-cat-count" style="color: var(--accent-rose);">${criticalCount}</div>
          <span style="font-size: 11px; color: var(--text-muted);">Immediate fraud/geo halt</span>
        </div>

        <div class="risk-category-card ${this.activeSeverityFilter === 'high' ? 'active' : ''}" data-severity="high">
          <div class="risk-cat-title">
            <span>High Severity (70-89%)</span>
            <span class="severity-badge high">High</span>
          </div>
          <div class="risk-cat-count" style="color: #ea580c;">${highCount}</div>
          <span style="font-size: 11px; color: var(--text-muted);">Stockout & Hazmat flags</span>
        </div>

        <div class="risk-category-card ${this.activeSeverityFilter === 'medium' ? 'active' : ''}" data-severity="medium">
          <div class="risk-cat-title">
            <span>Medium / SLA Risk</span>
            <span class="severity-badge medium">Medium</span>
          </div>
          <div class="risk-cat-count" style="color: var(--accent-amber);">${medCount}</div>
          <span style="font-size: 11px; color: var(--text-muted);">SLA cutoff approaching</span>
        </div>
      </div>

      <!-- Flagged Orders Resolution Table -->
      <div class="glass-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-rose)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Warehouse Anomaly & Risk Resolution Queue
            </h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Review automated AI risk diagnostics, inventory discrepancies, and execute 1-click overrides</p>
          </div>
          <div class="panel-actions">
            <span class="severity-badge critical">${allRiskyOrders.length} Orders On Hold</span>
          </div>
        </div>

        ${displayOrders.length === 0 ? `
          <div style="text-align: center; padding: 40px; color: var(--text-muted);">
            <p>No active risky orders found in this severity filter.</p>
          </div>
        ` : `
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Risk Score</th>
                  <th>Customer & Geolocation</th>
                  <th>Identified Anomaly / Violation</th>
                  <th>Impact Value</th>
                  <th>Resolution Actions</th>
                </tr>
              </thead>
              <tbody>
                ${displayOrders.map(order => `
                  <tr>
                    <td class="font-mono">
                      <strong style="color: var(--accent-rose); font-size: 13.5px;">${order.id}</strong>
                      <div style="margin-top: 4px;">
                        <span class="severity-badge ${order.riskLevel.toLowerCase()}">${order.riskLevel}</span>
                      </div>
                    </td>
                    <td>
                      <div class="risk-meter">
                        <span class="risk-score-pill ${order.riskLevel.toLowerCase()}">${order.riskScore}/100</span>
                      </div>
                      <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">AI Confidence: 99.2%</div>
                    </td>
                    <td>
                      <div style="font-weight: 600;">${order.customer.name}</div>
                      <div style="font-size: 11.5px; color: var(--text-secondary); max-width: 240px; white-space: normal;">
                        ${order.customer.address}
                      </div>
                    </td>
                    <td>
                      <div style="font-weight: 700; color: #fff; margin-bottom: 6px;">${order.items.map(item => `${item.name} (${item.qty})`).join(', ')}</div>
                      <div style="font-size: 11px; color: var(--text-secondary);">Priority: ${order.priority || 'Standard'}</div>
                      ${order.riskFlags && order.riskFlags.length > 0 ? order.riskFlags.map(f => `
                        <div style="background: rgba(244, 63, 94, 0.08); border-left: 3px solid var(--accent-rose); padding: 6px 10px; border-radius: 4px; margin-bottom: 6px; max-width: 380px;">
                          <div style="font-weight: 700; color: #fb7185; font-size: 12px;">${f.title}</div>
                          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${f.desc}</div>
                        </div>
                      `).join('') : `
                        <div style="font-size: 12px; color: var(--text-muted);">Standard anomaly flagged during wave generation</div>
                      `}
                    </td>
                    <td>
                      <div style="font-family: var(--font-mono); font-weight: 700; color: #fff;">$${order.totalValue}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${order.items.reduce((s,i)=>s+i.qty,0)} items</div>
                    </td>
                    <td>
                      <div style="display: flex; flex-direction: column; gap: 6px;">
                        <button class="btn btn-primary btn-sm" onclick="window.app.openRiskResolutionModal('${order.id}')">
                          ⚡ Resolve Anomaly
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="window.app.inspectOrder('${order.id}')">
                          Inspect Details
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    // Severity filter click handlers
    container.querySelectorAll('.risk-category-card').forEach(card => {
      card.onclick = () => {
        this.activeSeverityFilter = card.dataset.severity;
        this.render(container);
      };
    });
  }
};

window.RiskyComponent = RiskyComponent;
