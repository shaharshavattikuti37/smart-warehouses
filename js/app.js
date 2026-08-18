/**
 * MAIN SPA APPLICATION CONTROLLER & ROUTER
 * Orchestrates navigation, modals, audio synthesis, toast alerts, and state events
 */

class SmartWarehouseApp {
  constructor() {
    this.currentView = 'overview';
    this.audioContext = null;
  }

  init() {
    // 1. Setup Hash Router
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Initial route
    if (!window.location.hash) {
      window.location.hash = '#overview';
    } else {
      this.handleRoute();
    }

    // 2. Global State Subscription for Real-time Reactive Re-rendering
    window.warehouseState.subscribe(() => {
      this.renderCurrentView();
      this.updateSidebarBadges();
    });

    // 3. Search & Header Controls
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        window.warehouseState.setFilters({ searchQuery: e.target.value });
      });
    }

    // 4. Simulator Switch
    const simToggle = document.getElementById('sim-toggle-btn');
    if (simToggle) {
      simToggle.addEventListener('click', () => {
        const isSim = !window.warehouseState.isSimulating;
        window.warehouseState.toggleSimulation(isSim);
        simToggle.textContent = isSim ? '⏸️ Pause Sim' : '▶️ Resume Sim';
        const pulse = document.querySelector('.sim-pulse');
        if (pulse) pulse.className = `sim-pulse ${isSim ? '' : 'paused'}`;
        this.showToast(isSim ? 'Live Warehouse Simulation Resumed' : 'Simulation Paused', 'info');
      });
    }

    // 5. Reset Data button
    const resetBtn = document.getElementById('sim-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset warehouse data back to initial seed state?')) {
          window.warehouseState.resetToSeed();
          this.showToast('Warehouse state reset to default seed', 'info');
        }
      });
    }

    // Update badges
    this.updateSidebarBadges();
  }

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'overview';
    this.currentView = hash;

    // Update Nav Links Active Class
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      const linkHash = link.getAttribute('href').replace('#', '');
      if (linkHash === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Page Header Titles
    const titleEl = document.getElementById('page-title-text');
    const descEl = document.getElementById('page-desc-text');
    
    const titles = {
      'dashboard': { title: 'Executive Operations Command', desc: 'Real-time warehouse performance, fulfillment pipeline, and live floor telemetry' },
      'overview': { title: 'Executive Operations Command', desc: 'Real-time warehouse performance, fulfillment pipeline, and live floor telemetry' },
      'inventory': { title: 'Inventory Status & Stock Visibility', desc: 'Live stock positions, critical shortages, and replenishment signals across product lines' },
      'orders': { title: 'Order Management & Fulfillment', desc: 'Customer orders, shipping priorities, and delivery progress for outbound operations' },
      'allocation': { title: 'Smart Allocation & Slotting', desc: 'Stock placement, picking route optimization, and reserve allocation decisions' },
      'picking': { title: 'Order Picking & Wave Management', desc: 'Active picking batches, picker productivity, and bin barcode verification' },
      'exceptions': { title: 'Risky Orders & Exception Management', desc: 'AI anomaly detection, fraud/geo mismatch alerts, and 1-click overrides' },
      'dispatch': { title: 'Order Dispatch & Outbound Logistics', desc: '8-Bay trailer status, carrier tracking manifests, and shipping labels' },
      'risky': { title: 'Risky Orders & Exception Management', desc: 'AI anomaly detection, fraud/geo mismatch alerts, and 1-click overrides' },
      'floor-map': { title: '2D Warehouse Floor Layout & Heatmap', desc: 'Interactive aisle & bay locator, inventory density, and AGV tracks' },
      'analytics': { title: 'Operations Analytics & SLA Metrics', desc: 'Throughput trends, carrier turnaround SLA, and picking cycle speed' }
    };

    if (titles[hash]) {
      if (titleEl) titleEl.textContent = titles[hash].title;
      if (descEl) descEl.textContent = titles[hash].desc;
    }

    this.renderCurrentView();
  }

  renderCurrentView() {
    const container = document.getElementById('main-content-view');
    if (!container) return;

    switch (this.currentView) {
      case 'dashboard':
      case 'overview':
        window.OverviewComponent.render(container);
        break;
      case 'inventory':
        window.InventoryComponent.render(container);
        break;
      case 'allocation':
        window.OverviewComponent.render(container);
        break;
      case 'orders':
        window.OrdersComponent.render(container);
        break;
      case 'picking':
        window.PickingComponent.render(container);
        break;
      case 'dispatch':
        window.DispatchComponent.render(container);
        break;
      case 'exceptions':
      case 'risky':
        window.RiskyComponent.render(container);
        break;
      case 'floor-map':
        window.FloorMapComponent.render(container);
        break;
      case 'analytics':
        window.AnalyticsComponent.render(container);
        break;
      default:
        window.OverviewComponent.render(container);
    }
  }

  updateSidebarBadges() {
    const metrics = window.warehouseState.getMetrics();
    const bPicking = document.getElementById('badge-nav-picking');
    const bDispatch = document.getElementById('badge-nav-dispatch');
    const bRisky = document.getElementById('badge-nav-risky');

    if (bPicking) bPicking.textContent = metrics.inPicking;
    if (bDispatch) bDispatch.textContent = metrics.dispatched;
    if (bRisky) {
      bRisky.textContent = metrics.risky;
      bRisky.style.display = metrics.risky > 0 ? 'inline-block' : 'none';
    }
  }

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  playBeep(type = 'pick') {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = this.audioContext;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'pick') {
        // High crisp beep
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'dispatch') {
        // Success chord chime
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12); // G5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'warning') {
        // Warning buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // Audio might be blocked by browser policy before first interaction
    }
  }

  // --- ACTIONS ---

  scanPickItem(orderId, itemIndex) {
    this.playBeep('pick');
    window.warehouseState.pickItem(orderId, itemIndex);
    this.showToast(`SKU barcode verified & picked!`, 'success');
  }

  completeWave(orderId) {
    this.playBeep('dispatch');
    window.warehouseState.completePickingWave(orderId);
    this.showToast(`Wave completed for order ${orderId}! Moved to Packing.`, 'success');
  }

  assignPicker(orderId, pickerId) {
    if (!pickerId) return;
    window.warehouseState.assignPickerToOrder(orderId, pickerId);
    this.showToast(`Picker assigned to order ${orderId}`, 'info');
  }

  confirmOrder(orderId) {
    const result = window.warehouseState.confirmOrder(orderId);
    if (!result.success) {
      this.showToast(result.message || 'Your order is not confirmed.', 'danger');
      return;
    }
    this.showToast(`Order ${orderId} confirmed successfully!`, 'success');
  }

  dispatchSingleOrder(orderId) {
    this.playBeep('dispatch');
    window.warehouseState.dispatchOrder(orderId);
    this.showToast(`Order ${orderId} confirmed dispatched!`, 'success');
  }

  batchDispatchDock(dockId) {
    this.playBeep('dispatch');
    window.warehouseState.batchDispatchDock(dockId);
    this.showToast(`Dock ${dockId} truck dispatched successfully!`, 'success');
  }

  // --- MODAL CONTROLLER ---

  openModal(htmlContent) {
    let backdrop = document.getElementById('global-modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'global-modal-backdrop';
      backdrop.className = 'modal-backdrop';
      document.body.appendChild(backdrop);
    }
    backdrop.innerHTML = htmlContent;
    backdrop.classList.add('open');
    backdrop.onclick = (e) => {
      if (e.target === backdrop) this.closeModal();
    };
  }

  closeModal() {
    const backdrop = document.getElementById('global-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
    }
  }

  openAddOrderModal() {
    const inventory = window.warehouseState.inventoryItems || [];
    const options = inventory.map(item => `
      <option value="${item.name}">${item.name} (${item.stock} available)</option>
    `).join('');

    this.openModal(`
      <div class="modal-window" style="max-width: 520px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="modal-title">Add Customer Order</span>
          </div>
          <button class="modal-close-btn" onclick="window.app.closeModal()">✕</button>
        </div>

        <form id="customer-order-form">
          <div class="modal-body">
            <div style="display: grid; gap: 14px;">
              <div>
                <label style="display: block; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Customer Name</label>
                <input id="order-customer-name-input" type="text" placeholder="e.g. Sarah Njogu" style="width: 100%; background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-default); border-radius: 10px; padding: 12px 14px; font-size: 14px;" />
              </div>

              <div>
                <label style="display: block; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Product</label>
                <select id="order-product-select" style="width: 100%; background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-default); border-radius: 10px; padding: 12px 14px; font-size: 14px;">
                  ${options}
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Priority</label>
                <select id="order-priority-select" style="width: 100%; background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-default); border-radius: 10px; padding: 12px 14px; font-size: 14px;">
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">City / Village</label>
                <input id="order-city-input" type="text" placeholder="e.g. Nairobi, Kisumu, or village name" style="width: 100%; background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-default); border-radius: 10px; padding: 12px 14px; font-size: 14px;" />
              </div>

              <div>
                <label style="display: block; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Quantity</label>
                <input id="order-quantity-input" type="number" min="1" value="1" style="width: 100%; background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-default); border-radius: 10px; padding: 12px 14px; font-size: 14px;" />
              </div>

              <div id="order-stock-summary" style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 12px 14px; font-size: 12px; color: var(--text-secondary);"></div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Order</button>
          </div>
        </form>
      </div>
    `);

    const productSelect = document.getElementById('order-product-select');
    const prioritySelect = document.getElementById('order-priority-select');
    const cityInput = document.getElementById('order-city-input');
    const quantityInput = document.getElementById('order-quantity-input');
    const stockSummary = document.getElementById('order-stock-summary');

    const updateSummary = () => {
      const selected = inventory.find(item => item.name === productSelect.value) || inventory[0];
      if (!selected) return;

      quantityInput.max = String(selected.stock || 1);
      if (Number(quantityInput.value) > (selected.stock || 1)) {
        quantityInput.value = Math.max(1, selected.stock || 1);
      }

      stockSummary.innerHTML = `
        <strong style="color: #fff;">${selected.name}</strong><br>
        Available stock: <span style="color: ${selected.stock === 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}; font-weight: 700;">${selected.stock}</span><br>
        Status: <span style="color: ${selected.status === 'Out of Stock' ? 'var(--accent-rose)' : 'var(--accent-amber)'}; font-weight: 700;">${selected.status}</span>
      `;
    };

    const form = document.getElementById('customer-order-form');
    productSelect.addEventListener('change', updateSummary);
    quantityInput.addEventListener('input', updateSummary);

    updateSummary();

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const selectedProduct = inventory.find(item => item.name === productSelect.value);
      const quantity = Number(quantityInput.value) || 1;
      const priority = prioritySelect.value;
      const customerName = (document.getElementById('order-customer-name-input').value || '').trim() || 'Walk-in Customer';
      const originLocation = (cityInput.value || '').trim();

      if (!selectedProduct) {
        this.showToast('Your order is not confirmed. Item not found.', 'danger');
        return;
      }

      const result = window.warehouseState.createCustomerOrder({
        productName: selectedProduct.name,
        quantity,
        priority,
        city: originLocation,
        customerName
      });

      if (!result.success) {
        this.showToast(result.message || 'Your order is not confirmed.', 'danger');
        return;
      }

      this.closeModal();
      this.showToast(`${customerName}: ${quantity} ${selectedProduct.name}(s) added with ${priority} priority. Order is confirmed.`, 'success');
    });
  }

  inspectOrder(orderId) {
    const order = window.warehouseState.getOrderById(orderId);
    if (!order) return;

    const trackingSteps = [
      { label: 'Order placed', done: true, time: order.createdAt || 'Just now' },
      { label: 'Confirmed', done: Boolean(order.confirmedAt || order.status === 'confirmed' || order.status === 'packed' || order.status === 'staged' || order.status === 'dispatched'), time: order.confirmedAt || (order.status === 'confirmed' || order.status === 'packed' || order.status === 'staged' || order.status === 'dispatched' ? 'Confirmed' : 'Waiting') },
      { label: 'Picked', done: ['packed', 'staged', 'dispatched'].includes(order.status), time: order.status === 'dispatched' || order.status === 'staged' || order.status === 'packed' ? 'Completed' : 'Pending' },
      { label: 'Dispatched', done: order.status === 'dispatched', time: order.dispatchedAt || 'Waiting' }
    ];

    this.openModal(`
      <div class="modal-window">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="modal-title font-mono" style="color: var(--accent-cyan);">Order ${order.id}</span>
            <span class="status-pill ${order.status}">${order.status}</span>
          </div>
          <button class="modal-close-btn" onclick="window.app.closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <!-- Customer & Meta -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: var(--bg-secondary); padding: 14px; border-radius: var(--radius-md);">
            <div>
              <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Customer Details</span>
              <div style="font-weight: 700; font-size: 13.5px; color: #fff; margin-top: 2px;">${order.customer.name}</div>
              <div style="font-size: 11.5px; color: var(--text-secondary);">${order.customer.email}</div>
              <div style="font-size: 11.5px; color: var(--text-secondary);">${order.customer.phone}</div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">${order.customer.address}</div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 6px;">Origin: ${order.originLocation || 'Not specified'}</div>
            </div>
            <div>
              <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Shipping & Fulfillment</span>
              <div style="font-size: 12px; margin-top: 4px;">Carrier: <strong>${order.carrier}</strong></div>
              <div style="font-size: 12px;">Priority: <strong style="color: var(--accent-amber);">${order.priority}</strong></div>
              <div style="font-size: 12px;">Zone: <span class="bin-code">${order.zone}</span></div>
              <div style="font-size: 12px;">Tracking: <span class="font-mono" style="color: var(--accent-cyan);">${order.trackingNumber}</span></div>
              <div style="font-size: 12px;">Picker: <strong>${order.pickerName}</strong></div>
              <div style="font-size: 12px;">Dispatch safe: <strong style="color: ${order.riskLevel === 'Critical' || order.riskLevel === 'High' || order.riskFlags?.length ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">${order.riskLevel === 'Critical' || order.riskLevel === 'High' || order.riskFlags?.length ? 'Not safely dispatched' : 'Safely dispatched'}</strong></div>
            </div>
          </div>

          <div style="margin-top: 16px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 12px;">
            <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 10px;">Order Tracking</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${trackingSteps.map((step, index) => `
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; background: ${step.done ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.08)'}; color: #fff; font-size: 11px; border: 1px solid ${step.done ? 'var(--accent-emerald)' : 'var(--border-subtle)'};">
                    ${step.done ? '✓' : index + 1}
                  </div>
                  <div style="flex: 1; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                    <span style="color: ${step.done ? '#fff' : 'var(--text-muted)'}; font-size: 12px; font-weight: 600;">${step.label}</span>
                    <span style="color: var(--text-muted); font-size: 11px; font-family: var(--font-mono);">${step.time}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Items Checklist -->
          <div style="margin-top: 16px;">
            <h3 style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 8px;">Order Line Items (${order.items.length})</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${order.items.map(item => `
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-secondary); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  <div>
                    <span class="bin-code" style="margin-right: 8px;">📍 ${item.bin}</span>
                    <strong style="color: #fff;">${item.name}</strong>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">SKU: ${item.sku} • Unit Wt: ${item.weight} kg</div>
                  </div>
                  <div style="text-align: right;">
                    <span style="font-family: var(--font-mono); font-weight: 700; font-size: 13px; color: ${item.picked >= item.qty ? 'var(--accent-emerald)' : 'var(--accent-amber)'};">
                      ${item.picked} / ${item.qty} Picked
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Risk Status -->
          ${order.riskFlags && order.riskFlags.length > 0 ? `
            <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid var(--accent-rose); border-radius: var(--radius-md); padding: 12px; margin-top: 16px;">
              <div style="font-weight: 700; color: #fb7185; font-size: 12.5px;">⚠️ Active Risk Violations Flagged</div>
              ${order.riskFlags.map(f => `
                <div style="font-size: 12px; color: #fff; margin-top: 4px;">• <strong>${f.title}</strong>: ${f.desc}</div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.app.closeModal()">Close</button>
          <button class="btn btn-primary" onclick="window.app.showShippingLabel('${order.id}')">🏷️ View Label</button>
        </div>
      </div>
    `);
  }

  openRiskResolutionModal(orderId) {
    const order = window.warehouseState.getOrderById(orderId);
    if (!order) return;

    this.openModal(`
      <div class="modal-window" style="max-width: 600px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="modal-title font-mono" style="color: var(--accent-rose);">Resolve Exception: ${order.id}</span>
            <span class="severity-badge ${order.riskLevel.toLowerCase()}">${order.riskLevel}</span>
          </div>
          <button class="modal-close-btn" onclick="window.app.closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <div style="background: rgba(244, 63, 94, 0.08); border-left: 4px solid var(--accent-rose); padding: 12px; border-radius: var(--radius-md);">
            <div style="font-weight: 700; color: #fff;">AI Diagnostics & Flags Detected:</div>
            ${order.riskFlags.map(f => `
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                • <strong style="color: #fb7185;">${f.title}</strong>: ${f.desc}
              </div>
            `).join('')}
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
            <span style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Select Resolution Workflow:</span>
            
            <button class="btn btn-emerald" style="justify-content: flex-start; padding: 12px;" onclick="window.app.executeRiskResolution('${order.id}', 'RELEASE')">
              <div style="text-align: left;">
                <div style="font-weight: 700;">1. Override Risk & Force Release</div>
                <div style="font-size: 11px; opacity: 0.85;">Clear security hold and immediately route order to picking queue.</div>
              </div>
            </button>

            <button class="btn btn-primary" style="justify-content: flex-start; padding: 12px;" onclick="window.app.executeRiskResolution('${order.id}', 'REROUTE_BIN')">
              <div style="text-align: left;">
                <div style="font-weight: 700;">2. Re-Route to Secondary Reserve Bin</div>
                <div style="font-size: 11px; opacity: 0.85;">Automatically swap stockout bin coordinates to backup reserve storage.</div>
              </div>
            </button>

            <button class="btn btn-danger" style="justify-content: flex-start; padding: 12px;" onclick="window.app.executeRiskResolution('${order.id}', 'CANCEL')">
              <div style="text-align: left;">
                <div style="font-weight: 700;">3. Cancel Order & Restock Inventory</div>
                <div style="font-size: 11px; opacity: 0.85;">Reject suspicious order, refund customer, and release inventory allocations.</div>
              </div>
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
        </div>
      </div>
    `);
  }

  executeRiskResolution(orderId, type) {
    window.warehouseState.resolveRisk(orderId, type, 'User resolved via Exception Center');
    this.closeModal();
    this.showToast(`Order ${orderId} risk successfully resolved (${type})!`, 'success');
  }

  showShippingLabel(orderId) {
    const order = window.warehouseState.getOrderById(orderId);
    if (!order) return;

    this.openModal(`
      <div class="modal-window" style="max-width: 500px;">
        <div class="modal-header">
          <span class="modal-title">Carrier Shipping Thermal Label</span>
          <button class="modal-close-btn" onclick="window.app.closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <!-- Thermal Label Box (Black & White standard logistics label) -->
          <div style="background: #ffffff; color: #000000; padding: 20px; border: 2px solid #000; border-radius: 4px; font-family: monospace; line-height: 1.3;">
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px;">
              <div>
                <strong style="font-size: 16px;">${order.carrier.toUpperCase()}</strong>
                <div style="font-size: 10px;">PRIORITY LOGISTICS AIR</div>
              </div>
              <div style="text-align: right;">
                <strong style="font-size: 14px;">${order.zone}</strong>
                <div style="font-size: 10px;">${order.totalWeightKg} KG</div>
              </div>
            </div>

            <div style="font-size: 10px; border-bottom: 1px solid #000; padding-bottom: 6px; margin-bottom: 6px;">
              <strong>SHIP FROM:</strong><br>
              OMNIFLOW SMART WAREHOUSE #04<br>
              1000 LOGISTICS WAY, DOCK ${order.dockId || '01'}<br>
              CHICAGO, IL 60666
            </div>

            <div style="font-size: 11px; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px;">
              <strong>SHIP TO:</strong><br>
              <strong style="font-size: 13px;">${order.customer.name.toUpperCase()}</strong><br>
              ${order.customer.address.toUpperCase()}<br>
              TEL: ${order.customer.phone}
            </div>

            <!-- Barcode Simulation -->
            <div style="text-align: center; padding: 10px 0;">
              <div style="font-family: 'Libre Barcode 39', monospace; font-size: 38px; letter-spacing: 4px; line-height: 1; user-select: none;">
                ||||| | |||| ||| || |||||| | |||||||| || |||
              </div>
              <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">
                TRACKING #: ${order.trackingNumber}
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; border-top: 2px solid #000; padding-top: 6px; font-size: 10px;">
              <span>ORDER: ${order.id}</span>
              <span>ITEMS: ${order.items.reduce((s,i)=>s+i.qty,0)} PCS</span>
              <span>DEPT: OUTBOUND</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.app.closeModal()">Close</button>
          <button class="btn btn-primary" onclick="window.print()">🖨️ Print Label</button>
        </div>
      </div>
    `);
  }

  printShippingManifest() {
    window.print();
  }

  // --- TOAST NOTIFICATIONS ---

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div style="font-size: 16px;">
        ${type === 'success' ? '✓' : type === 'danger' ? '⚠️' : '⚡'}
      </div>
      <div style="flex: 1; font-size: 13px; font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Global App Instance
window.app = new SmartWarehouseApp();
