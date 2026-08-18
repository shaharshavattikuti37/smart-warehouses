/**
 * ORDER PICKING DASHBOARD VIEW
 * Wave & Zone Picking, Picker Allocation, Interactive Barcode Scanner, and Pick Route Optimizer
 */

const PickingComponent = {
  activeZoneFilter: 'all',

  render(container) {
    const state = window.warehouseState;
    const allPickingOrders = state.orders.filter(o => ['picking', 'pending', 'packed', 'confirmed'].includes(o.status));
    
    // Filter by selected zone
    const displayOrders = this.activeZoneFilter === 'all' 
      ? allPickingOrders 
      : allPickingOrders.filter(o => o.zone.startsWith(`Zone ${this.activeZoneFilter}`));

    const pickers = state.pickers;

    container.innerHTML = `
      <!-- Zone Tabs Selector & Productivity Summary -->
      <div class="glass-panel" style="padding: 16px 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div>
            <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px;">Filter by Warehouse Floor Zone</span>
            <div class="zone-selector-tabs" style="margin-top: 6px;">
              <button class="zone-tab ${this.activeZoneFilter === 'all' ? 'active' : ''}" data-zone="all">
                All Zones <span class="badge">${allPickingOrders.length}</span>
              </button>
              <button class="zone-tab ${this.activeZoneFilter === 'A' ? 'active' : ''}" data-zone="A">
                Zone A (Tech) <span class="badge">${allPickingOrders.filter(o=>o.zone.includes('Zone A')).length}</span>
              </button>
              <button class="zone-tab ${this.activeZoneFilter === 'B' ? 'active' : ''}" data-zone="B">
                Zone B (Apparel & Home) <span class="badge">${allPickingOrders.filter(o=>o.zone.includes('Zone B')).length}</span>
              </button>
              <button class="zone-tab ${this.activeZoneFilter === 'C' ? 'active' : ''}" data-zone="C">
                Zone C (Heavy / Pallet) <span class="badge">${allPickingOrders.filter(o=>o.zone.includes('Zone C')).length}</span>
              </button>
              <button class="zone-tab ${this.activeZoneFilter === 'D' ? 'active' : ''}" data-zone="D">
                Zone D (Cold Chain) <span class="badge">${allPickingOrders.filter(o=>o.zone.includes('Zone D')).length}</span>
              </button>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" id="btn-batch-wave">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Auto-Batch Next Wave
            </button>
          </div>
        </div>
      </div>

      <!-- Active Pickers Floor Roster -->
      <div class="glass-panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Active Floor Pickers & AGV Robots
          </h2>
          <span style="font-size: 12px; color: var(--text-muted);">${pickers.length} Active Floor Operators</span>
        </div>

        <div class="pickers-grid">
          ${pickers.map(p => `
            <div class="picker-card">
              <div class="picker-info">
                <div class="picker-avatar">${p.avatar}</div>
                <div>
                  <div class="picker-name">${p.name}</div>
                  <div class="picker-zone">${p.zone} • <span style="color: var(--accent-cyan); font-weight: 600;">${p.status}</span></div>
                </div>
              </div>
              <div class="picker-stats">
                <div>
                  <span style="color: var(--text-muted); font-size: 11px;">Velocity</span>
                  <div style="font-weight: 700; color: #fff; font-family: var(--font-mono);">${p.unitsPerHour} u/h</div>
                </div>
                <div>
                  <span style="color: var(--text-muted); font-size: 11px;">Accuracy</span>
                  <div style="font-weight: 700; color: var(--accent-emerald); font-family: var(--font-mono);">${p.accuracyPct}%</div>
                </div>
                <div>
                  <span style="color: var(--text-muted); font-size: 11px;">Assigned</span>
                  <div style="font-weight: 700; color: var(--accent-blue); font-family: var(--font-mono);">${p.activeOrders} waves</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Live Wave Picking Queue & Interactive Scan Checklist -->
      <div class="glass-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              Active Picking Batches & Bin Verification
            </h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Verify SKU barcodes at designated bin locations to fulfill batch orders</p>
          </div>
          <div class="panel-actions">
            <span class="status-pill picking">${displayOrders.filter(o=>o.status==='picking').length} In-Progress</span>
          </div>
        </div>

        ${displayOrders.length === 0 ? `
          <div style="text-align: center; padding: 40px; color: var(--text-muted);">
            <p>No active picking orders in this zone.</p>
          </div>
        ` : displayOrders.map(order => {
          const totalItems = order.items.reduce((s, i) => s + i.qty, 0);
          const totalPicked = order.items.reduce((s, i) => s + i.picked, 0);
          const pct = Math.round((totalPicked / (totalItems || 1)) * 100);
          const isComplete = totalPicked >= totalItems;

          return `
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 16px;">
              <!-- Wave Header -->
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <span class="font-mono" style="font-size: 15px; font-weight: 800; color: #fff;">${order.id}</span>
                  <span class="bin-code">${order.zone}</span>
                  <span class="status-pill ${order.status}">${order.status}</span>
                  <span style="font-size: 12px; color: var(--text-secondary);">Customer: <strong>${order.customer.name}</strong></span>
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
                  <span>Priority: <strong style="color: #fff;">${order.priority || 'Standard'}</strong></span>
                  <span>Tracking: <strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${order.trackingNumber || 'PENDING-PICK'}</strong></span>
                  <span>From: <strong style="color: #fff;">${order.originLocation || 'Not specified'}</strong></span>
                  <span>Products: <strong style="color: #fff;">${order.items.map(item => `${item.name} (${item.qty})`).join(', ')}</strong></span>
                </div>

                <div style="display: flex; align-items: center; gap: 12px;">
                  <!-- Picker Assignment -->
                  <div style="font-size: 12px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: var(--text-muted);">Picker:</span>
                    ${order.pickerName !== 'Unassigned' ? `
                      <span style="color: var(--accent-cyan); font-weight: 600;">${order.pickerName}</span>
                    ` : `
                      <select class="filter-select" onchange="window.app.assignPicker('${order.id}', this.value)" style="height: 28px; font-size: 11.5px;">
                        <option value="">+ Assign Picker</option>
                        ${pickers.map(p => `<option value="${p.id}">${p.name} (${p.zone})</option>`).join('')}
                      </select>
                    `}
                  </div>

                  <!-- Complete Action -->
                  ${isComplete ? `
                    <button class="btn btn-emerald btn-sm" onclick="window.app.completeWave('${order.id}')">
                      ✓ Mark Packed & Stage
                    </button>
                  ` : `
                    <button class="btn btn-secondary btn-sm" onclick="window.app.completeWave('${order.id}')">
                      ⚡ Quick-Pick All
                    </button>
                  `}
                </div>
              </div>

              <!-- Pick Progress Bar -->
              <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 4px;">
                  <span style="color: var(--text-muted);">Pick Verification Progress</span>
                  <span style="font-family: var(--font-mono); font-weight: 700; color: ${isComplete ? 'var(--accent-emerald)' : 'var(--accent-cyan)'};">${totalPicked} / ${totalItems} units (${pct}%)</span>
                </div>
                <div class="progress-bar-wrap" style="height: 8px;">
                  <div class="progress-bar-fill ${isComplete ? 'emerald' : 'blue'}" style="width: ${pct}%"></div>
                </div>
              </div>

              <!-- Item SKU Rows -->
              <div>
                ${order.items.map((item, idx) => `
                  <div class="pick-item-row ${item.picked >= item.qty ? 'picked' : ''}">
                    <div class="pick-item-left">
                      <span class="bin-code" style="font-size: 12px; font-weight: 700;">📍 ${item.bin}</span>
                      <div>
                        <div class="item-sku-title">${item.name}</div>
                        <div class="item-meta">
                          <span>SKU: <strong class="font-mono">${item.sku}</strong></span>
                          <span>Unit Weight: ${item.weight} kg</span>
                          <span>Quantity: <strong>${item.qty} pcs</strong></span>
                        </div>
                      </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 14px;">
                      <div style="text-align: right;">
                        <span style="font-size: 11px; color: var(--text-muted);">Verified</span>
                        <div style="font-family: var(--font-mono); font-weight: 800; font-size: 14px; color: ${item.picked >= item.qty ? 'var(--accent-emerald)' : '#fff'};">
                          ${item.picked} / ${item.qty}
                        </div>
                      </div>

                      <button class="btn ${item.picked >= item.qty ? 'btn-emerald' : 'btn-primary'} btn-sm" 
                              onclick="window.app.scanPickItem('${order.id}', ${idx})"
                              ${item.picked >= item.qty ? 'disabled style="opacity: 0.7; cursor: default;"' : ''}>
                        ${item.picked >= item.qty ? '✓ Verified' : '📷 Scan & Pick'}
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>

            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attach zone tab events
    container.querySelectorAll('.zone-tab').forEach(tab => {
      tab.onclick = () => {
        this.activeZoneFilter = tab.dataset.zone;
        this.render(container);
      };
    });

    // Auto-batch wave button
    const btnBatch = container.querySelector('#btn-batch-wave');
    if (btnBatch) {
      btnBatch.onclick = () => {
        const pendingOrders = state.orders.filter(o => o.status === 'pending');
        if (pendingOrders.length === 0) {
          window.app.showToast('No pending orders available to batch. Generate an inbound order first!', 'info');
          return;
        }
        pendingOrders.forEach((o, i) => {
          const picker = state.pickers[i % state.pickers.length];
          state.assignPickerToOrder(o.id, picker.id);
        });
        window.app.showToast(`Batched ${pendingOrders.length} pending orders to active pickers!`, 'success');
      };
    }
  }
};

window.PickingComponent = PickingComponent;
