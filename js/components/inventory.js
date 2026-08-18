/**
 * INVENTORY VIEW
 * Displays live stock levels and provides a warehouse stock visibility dashboard.
 */

const InventoryComponent = {
  render(container) {
    const state = window.warehouseState;
    const items = state.inventoryItems || [];

    container.innerHTML = `
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Inventory Items</span>
            <div class="metric-icon-wrap cyan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7.5L12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5"/><path d="M3 16.5l9 4.5 9-4.5"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">${items.length}</span>
            <span class="metric-delta positive">Live stock</span>
          </div>
          <span class="metric-sub">Available warehouse inventory visibility</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Low Stock</span>
            <div class="metric-icon-wrap amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">${items.filter(i => i.status === 'Low Stock').length}</span>
            <span class="metric-delta positive">Reorder soon</span>
          </div>
          <span class="metric-sub">Items near depletion threshold</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Out of Stock</span>
            <div class="metric-icon-wrap rose">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value" style="color: var(--accent-rose);">${items.filter(i => i.status === 'Out of Stock').length}</span>
            <span class="metric-delta negative">Blocked</span>
          </div>
          <span class="metric-sub">Orders cannot be confirmed until restocked</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">In Stock</span>
            <div class="metric-icon-wrap emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l4 4L19 2"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">${items.filter(i => i.status === 'In Stock').length}</span>
            <span class="metric-delta positive">Ready</span>
          </div>
          <span class="metric-sub">Items available for new customer orders</span>
        </div>
      </div>

      <div class="glass-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Inventory Status</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Current warehouse stock positions and item availability.</p>
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
              ${items.map(item => {
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
    `;
  }
};

window.InventoryComponent = InventoryComponent;
