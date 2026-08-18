/**
 * ORDER MANAGEMENT VIEW
 * Lists all active orders and their item quantities with status tracking.
 */

const OrdersComponent = {
  render(container) {
    const state = window.warehouseState;
    const orders = [...state.getOrders()].sort((a, b) => {
      return (b.createdAtTimestamp || 0) - (a.createdAtTimestamp || 0);
    });
    const totalUnits = orders.reduce((sum, order) => {
      const orderUnits = order.items.reduce((itemSum, item) => itemSum + (Number(item.qty) || 0), 0);
      return sum + orderUnits;
    }, 0);
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const dispatchedCount = orders.filter(o => o.status === 'dispatched').length;
    const riskyCount = orders.filter(o => o.status === 'risky').length;

    container.innerHTML = `
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Total Orders</span>
            <div class="metric-icon-wrap cyan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">${orders.length}</span>
            <span class="metric-delta positive">${totalUnits} units</span>
          </div>
          <span class="metric-sub">Across all active fulfilment queue states</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Pending</span>
            <div class="metric-icon-wrap amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">${pendingCount}</span>
            <span class="metric-delta positive">Awaiting wave</span>
          </div>
          <span class="metric-sub">Orders not yet assigned to a picker</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Dispatched</span>
            <div class="metric-icon-wrap emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value">${dispatchedCount}</span>
            <span class="metric-delta positive">In transit</span>
          </div>
          <span class="metric-sub">Orders already handed to carrier</span>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Risky Orders</span>
            <div class="metric-icon-wrap rose">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <div class="metric-value-wrap">
            <span class="metric-value" style="color: var(--accent-rose);">${riskyCount}</span>
            <span class="metric-delta negative">Requires review</span>
          </div>
          <span class="metric-sub">Exception holds and compliance checks</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 340px 1fr; gap: 20px;">
        <div class="glass-panel" style="padding: 16px; min-height: 480px;">
          <div class="panel-header" style="padding: 0 0 14px 0; border-bottom: 1px solid var(--border-subtle); margin-bottom: 12px;">
            <div>
              <h2 class="panel-title">My Orders</h2>
              <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Recent orders placed by customers</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${orders.length === 0 ? `
              <div style="padding: 18px; border: 1px dashed var(--border-subtle); border-radius: 12px; color: var(--text-muted); text-align: center;">
                No orders found.
              </div>
            ` : orders.map(order => {
              const totalQty = order.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
              return `
                <div onclick="window.app.inspectOrder('${order.id}')" style="cursor: pointer; background: rgba(14, 24, 38, 0.9); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 12px 12px 10px; transition: all 0.2s ease;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                    <div>
                      <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">${order.id}</div>
                      <div style="font-weight: 700; color: #fff; font-size: 14px;">${order.customer.name}</div>
                    </div>
                    <span class="status-pill ${order.status}">${order.status}</span>
                  </div>
                  <div style="margin-top: 10px; color: var(--text-secondary); font-size: 12px; line-height: 1.6;">
                    <div><strong style="color: #fff;">${totalQty}</strong> units • ${order.priority}</div>
                    <div>${order.originLocation || 'Not specified'}</div>
                    <div>${order.items.map(item => `${item.name} (${item.qty})`).join(', ')}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="glass-panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Order Details</h2>
              <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Customer orders, quantities, carriers, and fulfillment statuses.</p>
            </div>
            <div class="panel-actions">
              <button class="btn btn-primary btn-sm" onclick="window.app.openAddOrderModal()">+ Add Order</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items & Quantity</th>
                  <th>Zone</th>
                  <th>Carrier</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${orders.length === 0 ? `
                  <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No orders found for the current filter.</td>
                  </tr>
                ` : orders.map(order => {
                  const totalQty = order.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
                  return `
                    <tr>
                      <td class="font-mono">
                        <a href="javascript:void(0)" onclick="window.app.inspectOrder('${order.id}')" style="color: var(--accent-cyan); text-decoration: none; font-weight: 700;">
                          ${order.id}
                        </a>
                      </td>
                      <td>
                        <div style="font-weight: 600; color: #fff;">${order.customer.name}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">Placed: ${order.createdAt || 'Just now'}</div>
                      </td>
                      <td>
                        <div style="font-weight: 600; color: #fff;">${order.originLocation || 'Not specified'}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${order.priority}</div>
                      </td>
                      <td>
                        <div style="font-weight: 600; color: #fff;">${totalQty} units</div>
                        <div style="font-size: 11px; color: var(--text-muted); line-height: 1.6;">
                          ${order.items.map(item => `${item.name} (${Number(item.qty) || 0})`).join('<br>')}
                        </div>
                      </td>
                      <td><span class="bin-code">${order.zone}</span></td>
                      <td>
                        <div style="font-weight: 600; color: #fff;">${order.carrier}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">Tracking: ${order.trackingNumber || 'Pending'}</div>
                      </td>
                      <td>
                        <span class="status-pill ${order.status}">${order.status}</span>
                        <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 6px;">Placed → ${order.confirmedAt || 'Waiting'} → ${order.dispatchedAt || 'Pending'}</div>
                      </td>
                      <td>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                          <button class="btn btn-secondary btn-sm" onclick="window.app.inspectOrder('${order.id}')">View</button>
                          ${order.status !== 'dispatched' ? `
                            <button class="btn btn-emerald btn-sm" onclick="window.app.confirmOrder('${order.id}')">Confirm</button>
                          ` : ''}
                          ${order.status !== 'dispatched' ? `
                            <button class="btn btn-primary btn-sm" onclick="window.app.dispatchSingleOrder('${order.id}')">Dispatch</button>
                          ` : ''}
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
};

window.OrdersComponent = OrdersComponent;
