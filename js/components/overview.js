/**
 * EXECUTIVE OPERATIONS COMMAND VIEW
 * High-level KPIs, fulfillment pipeline funnel, floor activity feed, and quick actions
 */

const OverviewComponent = {
  render(container) {
    const state = window.warehouseState;
    const metrics = state.getMetrics();
    const allOrders = state.orders;
    const recentActivity = state.activityLog;
    const inventoryItems = state.inventoryItems || [];

    container.innerHTML = `
      <!-- Operational Metric Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Active Orders</span>
            <div class="metric-icon-wrap cyan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">${metrics.totalOrders}</span>
            <span class="metric-delta positive">+12% vs avg</span>
          </div>
          <span class="metric-sub">${metrics.pending} awaiting wave assignment</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">In Picking Queue</span>
            <div class="metric-icon-wrap blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">${metrics.inPicking}</span>
            <span class="metric-delta positive">${metrics.avgVelocity} units/hr</span>
          </div>
          <span class="metric-sub">${state.pickers.filter(p => p.status === 'Picking').length} active pickers on floor</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Dispatched Today</span>
            <div class="metric-icon-wrap emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">${metrics.dispatched}</span>
            <span class="metric-delta positive">98.4% On-Time SLA</span>
          </div>
          <span class="metric-sub">${metrics.packedStaged} staged at dock doors</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Flagged / Risky</span>
            <div class="metric-icon-wrap rose">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value" style="color: var(--accent-rose);">${metrics.risky}</span>
            <span class="metric-delta negative">Requires Action</span>
          </div>
          <span class="metric-sub">Stockout, Geo fraud, Hazmat alerts</span>
        </div>
      </div>

      <div class="glass-panel" style="margin-top: 0;">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M3 7.5L12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5"/><path d="M3 16.5l9 4.5 9-4.5"/></svg>
              Inventory Snapshot
            </h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Critical stock levels across key warehouse SKUs</p>
          </div>
        </div>

        <div class="table-responsive">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Bin</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${inventoryItems.map(item => {
                const statusClass = item.status === 'Out of Stock' ? 'risky' : item.status === 'Low Stock' ? 'pending' : 'dispatched';
                return `
                  <tr>
                    <td><strong>${item.name}</strong></td>
                    <td class="font-mono">${item.sku}</td>
                    <td>${item.category}</td>
                    <td class="font-mono">${item.bin}</td>
                    <td>${item.stock}</td>
                    <td><span class="status-pill ${statusClass}">${item.status}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Interactive Fulfillment Pipeline Funnel -->
      <div class="glass-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Live Fulfillment Pipeline
            </h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Real-time stage tracking across inbound orders through carrier transit</p>
          </div>
          <div class="panel-actions">
            <button class="btn btn-secondary btn-sm" id="btn-quick-inbound">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              + Simulate Inbound Order
            </button>
          </div>
        </div>

        <div class="pipeline-track">
          <div class="pipeline-stage">
            <div class="stage-title">
              <span>1. Pending Wave</span>
              <span class="status-pill pending">${metrics.pending}</span>
            </div>
            <div class="stage-count">${metrics.pending}</div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill amber" style="width: ${(metrics.pending / (metrics.totalOrders || 1)) * 100}%"></div>
            </div>
            <span class="stage-footer">Awaiting zone assignment</span>
          </div>

          <div class="pipeline-stage">
            <div class="stage-title">
              <span>2. In Picking</span>
              <span class="status-pill picking">${metrics.inPicking}</span>
            </div>
            <div class="stage-count">${metrics.inPicking}</div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill blue" style="width: ${(metrics.inPicking / (metrics.totalOrders || 1)) * 100}%"></div>
            </div>
            <span class="stage-footer">${metrics.avgVelocity} units/hr floor speed</span>
          </div>

          <div class="pipeline-stage">
            <div class="stage-title">
              <span>3. Packed & Staged</span>
              <span class="status-pill staged">${metrics.packedStaged}</span>
            </div>
            <div class="stage-count">${metrics.packedStaged}</div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width: ${(metrics.packedStaged / (metrics.totalOrders || 1)) * 100}%"></div>
            </div>
            <span class="stage-footer">Assigned to Dock bays</span>
          </div>

          <div class="pipeline-stage">
            <div class="stage-title">
              <span>4. Dispatched</span>
              <span class="status-pill dispatched">${metrics.dispatched}</span>
            </div>
            <div class="stage-count">${metrics.dispatched}</div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill emerald" style="width: ${(metrics.dispatched / (metrics.totalOrders || 1)) * 100}%"></div>
            </div>
            <span class="stage-footer">In transit with carriers</span>
          </div>

          <div class="pipeline-stage" style="border-color: rgba(244, 63, 94, 0.3); background: rgba(244, 63, 94, 0.05);">
            <div class="stage-title">
              <span style="color: var(--accent-rose);">5. Risky Holds</span>
              <span class="severity-badge critical">${metrics.risky}</span>
            </div>
            <div class="stage-count" style="color: var(--accent-rose);">${metrics.risky}</div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill rose" style="width: ${(metrics.risky / (metrics.totalOrders || 1)) * 100}%"></div>
            </div>
            <span class="stage-footer">Security & stockout checks</span>
          </div>
        </div>
      </div>

      <!-- Bottom Split Grid: Live Order Stream & Real-Time Warehouse Log -->
      <div style="display: grid; grid-template-columns: 2fr 1.2fr; gap: 20px;">
        
        <!-- Active Live Orders Table -->
        <div class="glass-panel">
          <div class="panel-header">
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              Active Floor Orders
            </h2>
            <span style="font-size: 12px; color: var(--text-muted);">${allOrders.length} Total Registered</span>
          </div>

          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Zone / Items</th>
                  <th>Status</th>
                  <th>Carrier</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${allOrders.slice(0, 7).map(order => `
                  <tr>
                    <td class="font-mono">
                      <a href="javascript:void(0)" onclick="window.app.inspectOrder('${order.id}')" style="color: var(--accent-cyan); text-decoration: none; font-weight: 700;">
                        ${order.id}
                      </a>
                    </td>
                    <td>
                      <div style="font-weight: 600;">${order.customer.name}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${order.priority}</div>
                    </td>
                    <td>
                      <span class="bin-code">${order.zone}</span>
                      <span style="font-size: 12px; color: var(--text-secondary); margin-left: 6px;">${order.items.length} SKUs (${order.items.reduce((s,i)=>s+i.qty,0)} pcs)</span>
                    </td>
                    <td>
                      <span class="status-pill ${order.status}">${order.status}</span>
                    </td>
                    <td>
                      <div style="font-size: 12px; font-weight: 500;">${order.carrier}</div>
                      <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${order.trackingNumber || 'Pending'}</div>
                    </td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="window.app.inspectOrder('${order.id}')">
                        Inspect
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Floor Activity Ticker Feed -->
        <div class="glass-panel">
          <div class="panel-header">
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Live Warehouse Ticker
            </h2>
            <span class="status-pill dispatched" style="font-size: 10px;">Connected Live</span>
          </div>

          <div class="activity-feed">
            ${recentActivity.map(act => `
              <div class="activity-item ${act.type}">
                <div class="activity-icon">
                  ${act.type === 'dispatched' ? '🚚' : act.type === 'risky' ? '⚠️' : act.type === 'picking' ? '📦' : '⚡'}
                </div>
                <div class="activity-text">
                  <div>${act.text}</div>
                  <div class="activity-time">${act.time}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // Attach listeners
    const btnInbound = container.querySelector('#btn-quick-inbound');
    if (btnInbound) {
      btnInbound.onclick = () => {
        const order = state.createNewInboundOrder();
        window.app.showToast(`Inbound order ${order.id} generated and routed to ${order.zone}!`, 'success');
      };
    }
  }
};

window.OverviewComponent = OverviewComponent;
