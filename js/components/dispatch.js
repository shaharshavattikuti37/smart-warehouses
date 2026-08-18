/**
 * ORDER DISPATCH & LOGISTICS DASHBOARD VIEW
 * 8 Loading Docks Visualizer, Carrier Tracking, Shipping Label Generator, and Outbound Manifest Printer
 */

const DispatchComponent = {
  render(container) {
    const state = window.warehouseState;
    const docks = state.docks;
    const dispatchedOrders = state.orders.filter(o => o.status === 'dispatched' || o.status === 'staged' || o.status === 'packed');

    container.innerHTML = `
      <!-- Loading Docks Visualizer Grid (8 Bays) -->
      <div class="glass-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Active Outbound Loading Docks (Bays 01 – 08)
            </h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Real-time bay staging, trailer loading capacity, and scheduled carrier turnaround</p>
          </div>
          <div class="panel-actions">
            <span class="status-pill staged">${docks.filter(d => d.status === 'loading' || d.status === 'staged').length} Active Trailers</span>
          </div>
        </div>

        <div class="dock-grid">
          ${docks.map(dock => {
            const stagedOrdersForDock = state.orders.filter(o => o.dockId === dock.id && (o.status === 'staged' || o.status === 'packed'));

            return `
              <div class="dock-card ${dock.status}">
                <div class="dock-header">
                  <span class="dock-name">${dock.id}</span>
                  <span class="dock-status-tag ${dock.status === 'loading' ? 'picking' : dock.status === 'staged' ? 'staged' : 'dispatched'}" style="background: var(--bg-card);">
                    ${dock.status}
                  </span>
                </div>

                <div class="dock-truck-info">
                  <div class="dock-carrier-badge">
                    <span>🚚 ${dock.carrier}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted);">
                    ${dock.truckId ? `Vehicle: <strong>${dock.truckId}</strong>` : 'Bay Available for Staging'}
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted);">
                    Destination: <strong>${dock.destination}</strong>
                  </div>
                </div>

                <!-- Trailer Capacity Fill -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span style="color: var(--text-muted);">Trailer Fill</span>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${dock.capacityPct}%</span>
                  </div>
                  <div class="progress-bar-wrap">
                    <div class="progress-bar-fill ${dock.capacityPct > 80 ? 'amber' : 'emerald'}" style="width: ${dock.capacityPct}%"></div>
                  </div>
                </div>

                <!-- Footer Departure / Dispatch Action -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; padding-top: 8px; border-top: 1px solid var(--border-subtle); font-size: 11.5px;">
                  <div>
                    <span style="color: var(--text-muted);">Departure:</span>
                    <strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${dock.departureEta}</strong>
                  </div>

                  ${dock.status !== 'available' ? `
                    <button class="btn btn-emerald btn-sm" onclick="window.app.batchDispatchDock('${dock.id}')">
                      Dispatch Truck
                    </button>
                  ` : `
                    <span style="color: var(--text-muted); font-size: 11px;">Ready for Ingress</span>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Outbound Carrier Shipments & Manifest Table -->
      <div class="glass-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Outbound Manifest & Staged Orders
            </h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Generate carrier bills of lading, print thermal shipping labels, and verify carrier hand-offs</p>
          </div>

          <div class="panel-actions">
            <button class="btn btn-secondary" onclick="window.app.printShippingManifest()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print Master Manifest
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Recipient / Destination</th>
                <th>Carrier & Service</th>
                <th>Tracking Number</th>
                <th>Weight / Value</th>
                <th>Staged Dock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${dispatchedOrders.map(order => `
                <tr>
                  <td class="font-mono">
                    <strong style="color: var(--accent-cyan);">${order.id}</strong>
                  </td>
                  <td>
                    <div style="font-weight: 600;">${order.customer.name}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${order.customer.address}</div>
                    <div style="font-size: 10.5px; color: var(--text-secondary); margin-top: 4px;">From: ${order.originLocation || 'Not specified'}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600;">${order.carrier}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">${order.priority}</div>
                  </td>
                  <td class="font-mono" style="font-size: 12px;">
                    ${order.trackingNumber || 'Awaiting Staging'}
                  </td>
                  <td>
                    <div style="font-family: var(--font-mono); font-size: 12px;">${order.totalWeightKg} kg</div>
                    <div style="font-size: 11px; color: var(--text-muted);">$${order.totalValue}</div>
                    <div style="font-size: 10.5px; color: var(--text-secondary); margin-top: 4px;">${order.items.map(item => `${item.name} (${item.qty})`).join(', ')}</div>
                  </td>
                  <td>
                    ${order.dockId ? `<span class="bin-code">${order.dockId}</span>` : '<span style="color: var(--text-muted); font-size: 11px;">Unassigned</span>'}
                  </td>
                  <td>
                    <span class="status-pill ${order.status}">${order.status}</span>
                    <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 6px;">
                      ${order.riskLevel === 'Critical' || order.riskLevel === 'High' || order.riskFlags?.length ? '⚠️ Not safely dispatched' : '✅ Safely dispatched'}
                    </div>
                  </td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <button class="btn btn-secondary btn-sm" onclick="window.app.showShippingLabel('${order.id}')" title="Print Shipping Label">
                        🏷️ Label
                      </button>
                      ${order.status !== 'dispatched' ? `
                        <button class="btn btn-emerald btn-sm" onclick="window.app.dispatchSingleOrder('${order.id}')">
                          Dispatch
                        </button>
                      ` : `
                        <span style="font-size: 11px; color: var(--accent-emerald); font-weight: 600;">✓ In Transit</span>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};

window.DispatchComponent = DispatchComponent;
