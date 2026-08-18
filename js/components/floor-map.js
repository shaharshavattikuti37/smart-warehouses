/**
 * 2D INTERACTIVE WAREHOUSE FLOOR MAP & HEATMAP
 * Visual aisle & bay layouts, velocity heatmaps, bin capacity inspector, and AGV tracks
 */

const FloorMapComponent = {
  heatmapMode: 'velocity', // 'velocity' | 'capacity'

  render(container) {
    const state = window.warehouseState;
    const skus = state.skus;
    const activePickingOrders = state.orders.filter(o => o.status === 'picking');
    const activeBins = new Set();
    activePickingOrders.forEach(o => {
      o.items.forEach(i => activeBins.add(i.bin));
    });

    container.innerHTML = `
      <div class="glass-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              2D Warehouse Floor & Real-Time Inventory Heatmap
            </h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Visual bay locator, pick frequency telemetry, and stock allocation grid</p>
          </div>

          <div class="panel-actions">
            <span style="font-size: 12px; color: var(--text-muted); margin-right: 4px;">Heatmap Mode:</span>
            <button class="btn ${this.heatmapMode === 'velocity' ? 'btn-primary' : 'btn-secondary'} btn-sm" id="btn-mode-velocity">
              🔥 Pick Velocity
            </button>
            <button class="btn ${this.heatmapMode === 'capacity' ? 'btn-primary' : 'btn-secondary'} btn-sm" id="btn-mode-capacity">
              📊 Bin Capacity
            </button>
          </div>
        </div>

        <!-- Legend -->
        <div style="display: flex; align-items: center; gap: 18px; margin-bottom: 16px; font-size: 12px; background: var(--bg-secondary); padding: 10px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <span style="font-weight: 700; color: var(--text-secondary);">LEGEND:</span>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 12px; height: 12px; border-radius: 3px; background: var(--accent-rose);"></div>
            <span>High Activity / Full (>80%)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 12px; height: 12px; border-radius: 3px; background: var(--accent-amber);"></div>
            <span>Moderate (40-80%)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 12px; height: 12px; border-radius: 3px; background: var(--accent-emerald);"></div>
            <span>Low Velocity / Cool</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 12px; height: 12px; border-radius: 3px; border: 2px solid var(--accent-cyan);"></div>
            <span>⚡ Active Pick In Progress</span>
          </div>
        </div>

        <!-- 2D Floor Layout Grid -->
        <div class="floor-grid-layout">
          
          <!-- Zone A -->
          <div class="warehouse-zone-block">
            <div class="zone-block-header">
              <span>ZONE A (Tech & Electronics)</span>
              <span style="font-size: 11px; font-weight: 600; color: var(--accent-cyan);">Ambient (21°C)</span>
            </div>
            <div class="bay-bins-grid">
              ${this.renderBinNode('A-02-04-B', 'SKU-99201', activeBins, 'heat-high')}
              ${this.renderBinNode('A-03-01-A', 'SKU-99202', activeBins, 'heat-medium')}
              ${this.renderBinNode('A-05-02-C', 'SKU-99203', activeBins, 'heat-high')}
              ${this.renderBinNode('A-01-01-A', null, activeBins, 'heat-low')}
              ${this.renderBinNode('A-04-02-B', null, activeBins, 'heat-low')}
              ${this.renderBinNode('A-06-03-C', null, activeBins, 'heat-medium')}
            </div>
          </div>

          <!-- Zone B -->
          <div class="warehouse-zone-block">
            <div class="zone-block-header">
              <span>ZONE B (Apparel & Home)</span>
              <span style="font-size: 11px; font-weight: 600; color: var(--text-secondary);">Ambient (22°C)</span>
            </div>
            <div class="bay-bins-grid">
              ${this.renderBinNode('B-01-03-A', 'SKU-88301', activeBins, 'heat-medium')}
              ${this.renderBinNode('B-04-02-D', 'SKU-88302', activeBins, 'heat-high')}
              ${this.renderBinNode('B-06-01-B', 'SKU-88303', activeBins, 'heat-low')}
              ${this.renderBinNode('B-02-02-A', null, activeBins, 'heat-low')}
              ${this.renderBinNode('B-03-04-C', null, activeBins, 'heat-medium')}
              ${this.renderBinNode('B-05-01-A', null, activeBins, 'heat-low')}
            </div>
          </div>

          <!-- Zone C -->
          <div class="warehouse-zone-block">
            <div class="zone-block-header">
              <span>ZONE C (Heavy Bulk Pallets)</span>
              <span style="font-size: 11px; font-weight: 600; color: var(--accent-amber);">Forklift Access</span>
            </div>
            <div class="bay-bins-grid">
              ${this.renderBinNode('C-02-01-A', 'SKU-77401', activeBins, 'heat-medium')}
              ${this.renderBinNode('C-04-03-C', 'SKU-77402', activeBins, 'heat-high')}
              ${this.renderBinNode('C-01-02-A', null, activeBins, 'heat-low')}
              ${this.renderBinNode('C-03-01-B', null, activeBins, 'heat-low')}
              ${this.renderBinNode('C-05-04-C', null, activeBins, 'heat-medium')}
              ${this.renderBinNode('C-06-02-A', null, activeBins, 'heat-low')}
            </div>
          </div>

          <!-- Zone D -->
          <div class="warehouse-zone-block">
            <div class="zone-block-header">
              <span>ZONE D (Cold Chain & Dangerous)</span>
              <span style="font-size: 11px; font-weight: 600; color: var(--accent-cyan-light);">Controlled (4°C)</span>
            </div>
            <div class="bay-bins-grid">
              ${this.renderBinNode('D-01-02-A', 'SKU-66501', activeBins, 'heat-high')}
              ${this.renderBinNode('D-03-01-B', 'SKU-66502', activeBins, 'heat-high')}
              ${this.renderBinNode('D-02-01-A', null, activeBins, 'heat-low')}
              ${this.renderBinNode('D-04-03-C', null, activeBins, 'heat-medium')}
              ${this.renderBinNode('D-05-02-B', null, activeBins, 'heat-low')}
              ${this.renderBinNode('D-06-01-A', null, activeBins, 'heat-low')}
            </div>
          </div>

        </div>

        <!-- Selected Bin Inspector Modal/Card (Rendered dynamically on click) -->
        <div id="bin-inspector-container" style="margin-top: 20px;"></div>
      </div>
    `;

    // Heatmap mode toggles
    const btnVelocity = container.querySelector('#btn-mode-velocity');
    const btnCapacity = container.querySelector('#btn-mode-capacity');
    if (btnVelocity && btnCapacity) {
      btnVelocity.onclick = () => {
        this.heatmapMode = 'velocity';
        this.render(container);
      };
      btnCapacity.onclick = () => {
        this.heatmapMode = 'capacity';
        this.render(container);
      };
    }
  },

  renderBinNode(binCode, skuId, activeBins, heatClass) {
    const isActive = activeBins.has(binCode);
    const sku = skuId ? window.warehouseState.skus[skuId] : null;

    return `
      <div class="bin-node ${heatClass} ${isActive ? 'active-pick' : ''}" 
           onclick="window.FloorMapComponent.inspectBin('${binCode}', '${skuId || ''}')"
           title="${binCode}: ${sku ? sku.name : 'Empty / Reserve Bin'}">
        <div style="font-size: 9px; color: var(--text-muted);">${binCode.split('-')[0]}-${binCode.split('-')[1]}</div>
        <div style="font-weight: 700; color: #fff;">${binCode.split('-')[2] || binCode}</div>
        ${isActive ? '<span style="font-size: 10px; color: var(--accent-cyan);">⚡ Pick</span>' : ''}
      </div>
    `;
  },

  inspectBin(binCode, skuId) {
    const inspector = document.getElementById('bin-inspector-container');
    if (!inspector) return;

    const sku = skuId ? window.warehouseState.skus[skuId] : null;
    const pendingOrders = window.warehouseState.orders.filter(o => o.items.some(i => i.bin === binCode));

    inspector.innerHTML = `
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-highlight); border-radius: var(--radius-md); padding: 18px; animation: slide-in 0.2s ease;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="bin-code" style="font-size: 14px; font-weight: 800; padding: 4px 10px;">📍 Bin ${binCode}</span>
            <span style="font-size: 13px; font-weight: 700; color: #fff;">${sku ? sku.name : 'Reserve Bay / Unassigned Stock'}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('bin-inspector-container').innerHTML = ''">✕ Close</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 12px; font-size: 12.5px;">
          <div>
            <span style="color: var(--text-muted); font-size: 11px;">Assigned SKU:</span>
            <div class="font-mono" style="font-weight: 700; color: var(--accent-cyan);">${skuId || 'None'}</div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 11px;">Current On-Hand Stock:</span>
            <div class="font-mono" style="font-weight: 700; color: var(--accent-emerald); font-size: 14px;">${sku ? sku.stock : 0} units</div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 11px;">Unit Weight & Price:</span>
            <div style="font-weight: 600; color: #fff;">${sku ? `${sku.weightKg} kg • $${sku.price}` : 'N/A'}</div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 11px;">Pending Orders In Queue:</span>
            <div style="font-weight: 700; color: ${pendingOrders.length > 0 ? 'var(--accent-cyan)' : 'var(--text-muted)'};">${pendingOrders.length} orders</div>
          </div>
        </div>
      </div>
    `;
  }
};

window.FloorMapComponent = FloorMapComponent;
