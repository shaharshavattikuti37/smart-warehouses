/**
 * STATE MANAGEMENT & SIMULATION ENGINE
 * Reactive store, event bus, LocalStorage persistence, and live warehouse ticker
 */

class WarehouseState {
  constructor() {
    this.STORAGE_KEY = 'OMNIFLOW_WAREHOUSE_STATE_V1';
    this.listeners = [];
    this.simulationInterval = null;
    this.isSimulating = true;
    this.filterState = {
      searchQuery: '',
      status: 'all',
      zone: 'all',
      riskLevel: 'all',
      carrier: 'all'
    };

    this.loadState();
    this.initSimulation();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.orders = parsed.orders || window.SEED_DATA.orders;
        this.docks = parsed.docks || window.SEED_DATA.docks;
        this.pickers = parsed.pickers || window.SEED_DATA.pickers;
        this.skus = parsed.skus || window.SEED_DATA.skus;
        this.zones = parsed.zones || window.SEED_DATA.zones;
        this.inventoryItems = parsed.inventoryItems || window.SEED_DATA.inventoryItems;
        this.activityLog = parsed.activityLog || this.getInitialActivityLog();
        return;
      }
    } catch (e) {
      console.warn('Could not load from localStorage, initializing fresh seed data.', e);
    }

    // Default Seed Initialization
    this.orders = JSON.parse(JSON.stringify(window.SEED_DATA.orders));
    this.docks = JSON.parse(JSON.stringify(window.SEED_DATA.docks));
    this.pickers = JSON.parse(JSON.stringify(window.SEED_DATA.pickers));
    this.skus = JSON.parse(JSON.stringify(window.SEED_DATA.skus));
    this.zones = JSON.parse(JSON.stringify(window.SEED_DATA.zones));
    this.inventoryItems = JSON.parse(JSON.stringify(window.SEED_DATA.inventoryItems));
    this.activityLog = this.getInitialActivityLog();
    this.saveState();
  }

  saveState() {
    try {
      const dataToSave = {
        orders: this.orders,
        docks: this.docks,
        pickers: this.pickers,
        skus: this.skus,
        zones: this.zones,
        inventoryItems: this.inventoryItems,
        activityLog: this.activityLog.slice(0, 50)
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Error saving state to LocalStorage', e);
    }
  }

  getInitialActivityLog() {
    return [
      { id: 'act-1', type: 'dispatched', text: 'Truck FDX-8821 dispatched 14 orders at Dock 01', time: '5m ago', timestamp: Date.now() - 300000 },
      { id: 'act-2', type: 'risky', text: 'Critical Risk flagged on ORD-84922 (Geolocation mismatch & high velocity)', time: '12m ago', timestamp: Date.now() - 720000 },
      { id: 'act-3', type: 'picking', text: 'Elena Rostova completed Wave #401 in Zone A (100% accuracy)', time: '20m ago', timestamp: Date.now() - 1200000 },
      { id: 'act-4', type: 'system', text: 'AGV-09 Autonomous picker assigned to Zone D Cold Chain batch', time: '35m ago', timestamp: Date.now() - 2100000 }
    ];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState();
    this.listeners.forEach(fn => {
      try {
        fn(this);
      } catch (err) {
        console.error('Subscriber error:', err);
      }
    });
  }

  addActivityLog(type, text) {
    this.activityLog.unshift({
      id: 'act-' + Math.random().toString(36).substr(2, 9),
      type,
      text,
      time: 'Just now',
      timestamp: Date.now()
    });
    if (this.activityLog.length > 50) this.activityLog.pop();
  }

  // --- QUERY SELECTORS ---
  getMetrics() {
    const totalOrders = this.orders.length;
    const inPicking = this.orders.filter(o => o.status === 'picking').length;
    const packedStaged = this.orders.filter(o => o.status === 'packed' || o.status === 'staged').length;
    const dispatched = this.orders.filter(o => o.status === 'dispatched').length;
    const risky = this.orders.filter(o => o.status === 'risky').length;
    const pending = this.orders.filter(o => o.status === 'pending').length;

    // Pick velocity calculation (mock average)
    const avgVelocity = Math.round(this.pickers.reduce((acc, p) => acc + p.unitsPerHour, 0) / this.pickers.length);
    const onTimeRate = 98.4;

    return {
      totalOrders,
      inPicking,
      packedStaged,
      dispatched,
      risky,
      pending,
      avgVelocity,
      onTimeRate
    };
  }

  getOrders(filterOverride = {}) {
    const filters = { ...this.filterState, ...filterOverride };
    return this.orders.filter(order => {
      // Search
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesCust = order.customer.name.toLowerCase().includes(q);
        const matchesCarrier = order.carrier && order.carrier.toLowerCase().includes(q);
        const matchesTrack = order.trackingNumber && order.trackingNumber.toLowerCase().includes(q);
        const matchesSku = order.items.some(i => i.sku.toLowerCase().includes(q) || i.name.toLowerCase().includes(q));
        if (!matchesId && !matchesCust && !matchesCarrier && !matchesTrack && !matchesSku) {
          return false;
        }
      }

      // Status
      if (filters.status && filters.status !== 'all' && order.status !== filters.status) {
        return false;
      }

      // Zone
      if (filters.zone && filters.zone !== 'all' && order.zone !== filters.zone) {
        return false;
      }

      // Risk Level
      if (filters.riskLevel && filters.riskLevel !== 'all' && order.riskLevel !== filters.riskLevel) {
        return false;
      }

      // Carrier
      if (filters.carrier && filters.carrier !== 'all' && order.carrier !== filters.carrier) {
        return false;
      }

      return true;
    });
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id);
  }

  // --- ACTIONS ---

  setFilters(newFilters) {
    this.filterState = { ...this.filterState, ...newFilters };
    this.notify();
  }

  assignPickerToOrder(orderId, pickerId) {
    const order = this.getOrderById(orderId);
    const picker = this.pickers.find(p => p.id === pickerId);
    if (!order || !picker) return;

    order.pickerId = picker.id;
    order.pickerName = picker.name;
    order.status = 'picking';
    this.addActivityLog('picking', `${picker.name} assigned to pick order ${order.id} (${order.zone})`);
    this.notify();
  }

  pickItem(orderId, itemIndex) {
    const order = this.getOrderById(orderId);
    if (!order || !order.items[itemIndex]) return;

    const item = order.items[itemIndex];
    if (item.picked < item.qty) {
      item.picked += 1;
    }

    const allPicked = order.items.every(i => i.picked >= i.qty);
    if (allPicked) {
      order.status = 'packed';
      this.addActivityLog('picking', `Order ${order.id} fully picked and packed. Ready for staging.`);
    }

    this.notify();
  }

  completePickingWave(orderId) {
    const order = this.getOrderById(orderId);
    if (!order) return;

    order.items.forEach(i => i.picked = i.qty);
    order.status = 'packed';
    this.addActivityLog('picking', `Wave completed for ${order.id}. Moved to packing station.`);
    this.notify();
  }

  stageOrderForDock(orderId, dockId) {
    const order = this.getOrderById(orderId);
    const dock = this.docks.find(d => d.id === dockId);
    if (!order || !dock) return;

    order.dockId = dock.id;
    order.status = 'staged';
    if (!order.trackingNumber || order.trackingNumber.startsWith('PENDING')) {
      order.trackingNumber = `${order.carrier.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    this.addActivityLog('dispatched', `Order ${order.id} staged at ${dock.name} for ${dock.carrier}`);
    this.notify();
  }

  confirmOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (!order) {
      return { success: false, message: 'Your order is not confirmed. Order not found.' };
    }

    const missingItem = order.items.find(item => {
      const inventoryItem = this.inventoryItems.find(inv => inv.name.toLowerCase() === item.name.toLowerCase());
      return !inventoryItem || inventoryItem.stock <= 0 || Number(item.qty) > Number(inventoryItem.stock);
    });

    if (missingItem) {
      const inventoryItem = this.inventoryItems.find(inv => inv.name.toLowerCase() === missingItem.name.toLowerCase());
      const available = inventoryItem ? inventoryItem.stock : 0;
      const message = inventoryItem
        ? `Your order is not confirmed. ${missingItem.name} is out of stock. Available stock: ${available}.`
        : `Your order is not confirmed. ${missingItem.name} was not found in inventory.`;
      this.addActivityLog('risky', `${order.id} confirmation failed: ${message}`);
      return { success: false, message };
    }

    order.status = 'confirmed';
    order.confirmedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.addActivityLog('system', `Order ${order.id} confirmed and ready for dispatch.`);
    this.notify();
    return { success: true, order };
  }

  dispatchOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (!order) return;

    order.status = 'dispatched';
    order.dispatchedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.addActivityLog('dispatched', `Order ${order.id} handed over to ${order.carrier}. Tracking: ${order.trackingNumber}`);
    this.notify();
  }

  batchDispatchDock(dockId) {
    const dock = this.docks.find(d => d.id === dockId);
    if (!dock) return;

    const dockOrders = this.orders.filter(o => o.dockId === dock.id && (o.status === 'staged' || o.status === 'packed'));
    dockOrders.forEach(o => {
      o.status = 'dispatched';
      o.dispatchedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    dock.status = 'available';
    dock.truckId = null;
    dock.capacityPct = 0;
    dock.departureEta = 'Departed';

    this.addActivityLog('dispatched', `${dock.name} departing with ${dockOrders.length} orders on ${dock.carrier}!`);
    this.notify();
  }

  resolveRisk(orderId, resolutionType, note) {
    const order = this.getOrderById(orderId);
    if (!order) return;

    order.riskLevel = 'Low';
    order.riskScore = 5;
    order.riskFlags = [];

    if (resolutionType === 'RELEASE') {
      order.status = 'pending';
      order.trackingNumber = 'REL-' + Math.floor(100000 + Math.random() * 900000);
      this.addActivityLog('risky', `Risk override approved on ${order.id}. Released to picking queue.`);
    } else if (resolutionType === 'REROUTE_BIN') {
      order.status = 'picking';
      order.items.forEach(i => {
        i.bin = i.bin.replace('-02-', '-06-'); // Alternate bay
      });
      this.addActivityLog('risky', `Order ${order.id} re-routed to alternate reserve bin location.`);
    } else if (resolutionType === 'CANCEL') {
      this.orders = this.orders.filter(o => o.id !== orderId);
      this.addActivityLog('risky', `Order ${orderId} cancelled and inventory restocked: ${note || 'Manual audit'}`);
    }

    this.notify();
  }

  createCustomerOrder({ productName, quantity, priority = 'Standard', city = '', customerName = '' }) {
    const item = this.inventoryItems.find(i => i.name.toLowerCase() === productName.toLowerCase());
    const qty = Number(quantity) || 1;
    const originLocation = String(city || '').trim() || 'Not specified';
    const normalizedCustomerName = String(customerName || '').trim() || 'Walk-in Customer';

    if (!item) {
      return { success: false, message: 'Selected product was not found in inventory.' };
    }

    if (qty <= 0) {
      return { success: false, message: 'Quantity must be greater than zero.' };
    }

    if (item.stock === 0 || qty > item.stock) {
      this.addActivityLog('risky', `Order blocked: ${item.name} has only ${item.stock} units available and customer requested ${qty}.`);
      return { success: false, message: `${item.name} is out of stock. Available stock: ${item.stock}.` };
    }

    const newId = `ORD-${Date.now().toString().slice(-6)}`;
    const order = {
      id: newId,
      originLocation,
      customer: {
        name: normalizedCustomerName,
        email: 'customer@smartwarehouse.com',
        phone: '+1 (555) 400-1000',
        address: `${originLocation}, Warehouse Floor 1`
      },
      items: [{
        sku: item.sku,
        name: item.name,
        qty,
        bin: item.bin,
        picked: 0,
        weight: 1.2
      }],
      status: 'pending',
      priority,
      zone: 'Zone A',
      pickerId: null,
      pickerName: 'Unassigned',
      carrier: 'UPS Ground',
      trackingNumber: 'PENDING-PICK',
      dockId: null,
      riskScore: 3,
      riskLevel: 'Low',
      riskFlags: [],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAtTimestamp: Date.now(),
      dispatchedAt: null,
      slaMinutesLeft: 90,
      totalWeightKg: +(1.2 * qty).toFixed(2),
      totalValue: (item.stock || 0) * 0 + 0
    };

    this.orders.unshift(order);
    item.stock = Math.max(0, item.stock - qty);
    item.status = item.stock === 0 ? 'Out of Stock' : item.stock <= 5 ? 'Low Stock' : 'In Stock';
    this.addActivityLog('system', `New customer order created: ${order.id} - ${qty} x ${item.name} (${priority})`);
    this.notify();
    return { success: true, order };
  }

  createNewInboundOrder() {
    const skuKeys = Object.keys(this.skus);
    const randomSku1 = this.skus[skuKeys[Math.floor(Math.random() * skuKeys.length)]];
    const randomSku2 = this.skus[skuKeys[Math.floor(Math.random() * skuKeys.length)]];
    const orderNum = Math.floor(84931 + Math.random() * 5000);
    const newId = `ORD-${orderNum}`;

    const names = ['Liam Scott', 'Sophia Chen', 'Carlos Mendez', 'Fatima Zahra', 'Noah Kim', 'Grace O’Malley'];
    const carriers = ['FedEx Express', 'DHL Worldwide', 'UPS Ground', 'Amazon Freight'];

    const newOrder = {
      id: newId,
      customer: {
        name: names[Math.floor(Math.random() * names.length)],
        email: `customer${orderNum}@domain.com`,
        phone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
        address: `${Math.floor(100 + Math.random() * 900)} Skyline Blvd, Suite ${Math.floor(10 + Math.random() * 90)}, Metropolis, NY`
      },
      items: [
        { sku: skuKeys[0], name: randomSku1.name, qty: 1, bin: randomSku1.bin, picked: 0, weight: randomSku1.weightKg },
        { sku: skuKeys[1], name: randomSku2.name, qty: 2, bin: randomSku2.bin, picked: 0, weight: randomSku2.weightKg * 2 }
      ],
      status: 'pending',
      priority: Math.random() > 0.7 ? 'Urgent' : 'Standard',
      zone: randomSku1.zone,
      pickerId: null,
      pickerName: 'Unassigned',
      carrier: carriers[Math.floor(Math.random() * carriers.length)],
      trackingNumber: 'PENDING-PICK',
      dockId: null,
      riskScore: Math.floor(Math.random() * 15),
      riskLevel: 'Low',
      riskFlags: [],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAtTimestamp: Date.now(),
      dispatchedAt: null,
      slaMinutesLeft: 90,
      totalWeightKg: +(randomSku1.weightKg + randomSku2.weightKg * 2).toFixed(2),
      totalValue: randomSku1.price + randomSku2.price * 2
    };

    this.orders.unshift(newOrder);
    this.addActivityLog('system', `New inbound order received: ${newOrder.id} (${newOrder.zone})`);
    this.notify();
    return newOrder;
  }

  // --- SIMULATION ENGINE LOOP ---
  initSimulation() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    this.simulationInterval = setInterval(() => {
      if (!this.isSimulating) return;
      this.runSimulationStep();
    }, 7000); // Ticks every 7 seconds
  }

  toggleSimulation(enabled) {
    this.isSimulating = enabled;
    this.notify();
  }

  runSimulationStep() {
    const dice = Math.random();

    // Case 1: Pickers make progress on active picking orders
    const pickingOrders = this.orders.filter(o => o.status === 'picking');
    if (pickingOrders.length > 0) {
      const targetOrder = pickingOrders[Math.floor(Math.random() * pickingOrders.length)];
      const unpickedItem = targetOrder.items.find(i => i.picked < i.qty);
      if (unpickedItem) {
        unpickedItem.picked += 1;
        const allDone = targetOrder.items.every(i => i.picked >= i.qty);
        if (allDone) {
          targetOrder.status = 'packed';
          this.addActivityLog('picking', `Wave complete: ${targetOrder.id} picked & packed by ${targetOrder.pickerName}`);
        }
        this.notify();
        return;
      }
    }

    // Case 2: Inbound order arrives (30% chance)
    if (dice < 0.3) {
      this.createNewInboundOrder();
      return;
    }

    // Case 3: Pickers pick up pending orders
    const pendingOrders = this.orders.filter(o => o.status === 'pending');
    if (pendingOrders.length > 0 && dice < 0.6) {
      const order = pendingOrders[0];
      const availablePicker = this.pickers.find(p => p.zone === order.zone) || this.pickers[0];
      this.assignPickerToOrder(order.id, availablePicker.id);
      return;
    }

    // Case 4: Pack & Stage orders to Dock doors
    const packedOrders = this.orders.filter(o => o.status === 'packed' && !o.dockId);
    if (packedOrders.length > 0 && dice < 0.8) {
      const order = packedOrders[0];
      const matchingDock = this.docks.find(d => d.carrier === order.carrier) || this.docks[0];
      this.stageOrderForDock(order.id, matchingDock.id);
      return;
    }
  }

  resetToSeed() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.loadState();
    this.notify();
  }
}

// Global Singleton
window.warehouseState = new WarehouseState();
