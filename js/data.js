/**
 * SMART WAREHOUSE SEED DATASET & DOMAIN MODELS
 * High-fidelity data for Order Picking, Dispatching, Risk Management, and Warehouse Mapping
 */

const SEED_DATA = {
  zones: [
    { id: 'A', name: 'Zone A - Fast Velocity Tech', type: 'High-Turnover', bays: 6, aisles: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'], temp: 'Ambient (21°C)' },
    { id: 'B', name: 'Zone B - Consumer Goods & Apparel', type: 'Standard', bays: 6, aisles: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'], temp: 'Ambient (22°C)' },
    { id: 'C', name: 'Zone C - Heavy & Bulk Pallet', type: 'Bulky', bays: 6, aisles: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'], temp: 'Ambient (20°C)' },
    { id: 'D', name: 'Zone D - Cold Chain & Fragile', type: 'Cold Storage', bays: 4, aisles: ['D1', 'D2', 'D3', 'D4'], temp: 'Controlled (4°C)' }
  ],

  docks: [
    { id: 'DOCK-01', name: 'Dock Bay 01', carrier: 'FedEx Express', status: 'loading', truckId: 'FDX-8821', destination: 'Chicago Hub (ORD)', capacityPct: 82, cutoffTime: '22:30', departureEta: '25 min' },
    { id: 'DOCK-02', name: 'Dock Bay 02', carrier: 'DHL Worldwide', status: 'loading', truckId: 'DHL-4402', destination: 'Frankfurt Gateway (FRA)', capacityPct: 94, cutoffTime: '23:00', departureEta: '10 min' },
    { id: 'DOCK-03', name: 'Dock Bay 03', carrier: 'UPS Ground', status: 'staged', truckId: 'UPS-1190', destination: 'Dallas Metro (DFW)', capacityPct: 65, cutoffTime: '23:45', departureEta: '55 min' },
    { id: 'DOCK-04', name: 'Dock Bay 04', carrier: 'Amazon Freight', status: 'loading', truckId: 'AMZ-9930', destination: 'Seattle Sort (SEA)', capacityPct: 45, cutoffTime: '00:15', departureEta: '1h 20m' },
    { id: 'DOCK-05', name: 'Dock Bay 05', carrier: 'BlueDart Air', status: 'available', truckId: null, destination: 'Staging Area', capacityPct: 0, cutoffTime: '01:00', departureEta: 'Idle' },
    { id: 'DOCK-06', name: 'Dock Bay 06', carrier: 'Internal Fleet #4', status: 'staged', truckId: 'WH-FLT-04', destination: 'Regional Retail Stores', capacityPct: 78, cutoffTime: '22:45', departureEta: '35 min' },
    { id: 'DOCK-07', name: 'Dock Bay 07', carrier: 'FedEx Ground', status: 'available', truckId: null, destination: 'Staging Area', capacityPct: 0, cutoffTime: '02:00', departureEta: 'Idle' },
    { id: 'DOCK-08', name: 'Dock Bay 08', carrier: 'Maersk Logistics', status: 'loading', truckId: 'MSK-7714', destination: 'Port Newark Staging', capacityPct: 88, cutoffTime: '23:15', departureEta: '40 min' }
  ],

  pickers: [
    { id: 'PCK-101', name: 'Marcus Vance', avatar: 'MV', zone: 'Zone A', activeOrders: 3, unitsPerHour: 142, accuracyPct: 99.4, status: 'Picking' },
    { id: 'PCK-102', name: 'Elena Rostova', avatar: 'ER', zone: 'Zone A', activeOrders: 2, unitsPerHour: 156, accuracyPct: 99.8, status: 'Picking' },
    { id: 'PCK-103', name: 'Devon Miller', avatar: 'DM', zone: 'Zone B', activeOrders: 4, unitsPerHour: 128, accuracyPct: 98.9, status: 'Picking' },
    { id: 'PCK-104', name: 'Priya Sharma', avatar: 'PS', zone: 'Zone B', activeOrders: 2, unitsPerHour: 148, accuracyPct: 99.6, status: 'Packing' },
    { id: 'PCK-105', name: 'Tariq Al-Mansoor', avatar: 'TA', zone: 'Zone C', activeOrders: 3, unitsPerHour: 96, accuracyPct: 99.1, status: 'Forklift' },
    { id: 'PCK-106', name: 'Automated AGV-09', avatar: '🤖', zone: 'Zone D', activeOrders: 5, unitsPerHour: 180, accuracyPct: 99.9, status: 'Autonomous' }
  ],

  skus: {
    'SKU-99201': { name: 'Titan Pro 4K Wireless Action Cam', category: 'Electronics', zone: 'Zone A', bin: 'A-02-04-B', weightKg: 0.45, stock: 124, price: 299 },
    'SKU-99202': { name: 'AeroSound Noise-Cancelling Headphones', category: 'Electronics', zone: 'Zone A', bin: 'A-03-01-A', weightKg: 0.38, stock: 82, price: 189 },
    'SKU-99203': { name: 'Quantum Core NVMe 2TB SSD', category: 'Electronics', zone: 'Zone A', bin: 'A-05-02-C', weightKg: 0.12, stock: 340, price: 149 },
    'SKU-88301': { name: 'ThermaShield Insulated Parka (L)', category: 'Apparel', zone: 'Zone B', bin: 'B-01-03-A', weightKg: 1.20, stock: 65, price: 120 },
    'SKU-88302': { name: 'ErgoComfort Memory Foam Pillow Set', category: 'Home', zone: 'Zone B', bin: 'B-04-02-D', weightKg: 2.10, stock: 48, price: 79 },
    'SKU-88303': { name: 'Precision Barista Stainless Espresso Kit', category: 'Home', zone: 'Zone B', bin: 'B-06-01-B', weightKg: 3.40, stock: 29, price: 210 },
    'SKU-77401': { name: 'Titanium Industrial Drill Press 1200W', category: 'Industrial', zone: 'Zone C', bin: 'C-02-01-A', weightKg: 18.5, stock: 14, price: 450 },
    'SKU-77402': { name: 'Heavy-Duty Hydraulic Floor Jack 3-Ton', category: 'Automotive', zone: 'Zone C', bin: 'C-04-03-C', weightKg: 24.0, stock: 18, price: 180 },
    'SKU-66501': { name: 'CryoCell Bio-Reagent Vaccine Cool-Box', category: 'Pharma', zone: 'Zone D', bin: 'D-01-02-A', weightKg: 1.80, stock: 42, price: 620 },
    'SKU-66502': { name: 'Lithium Iron Smart Battery Pack 48V', category: 'Energy', zone: 'Zone D', bin: 'D-03-01-B', weightKg: 8.50, stock: 26, price: 540 }
  },

  inventoryItems: [
    { name: 'Laptop', sku: 'LT-1001', stock: 24, status: 'In Stock', bin: 'A-01-02', category: 'Electronics' },
    { name: 'Keyboard', sku: 'KB-2045', stock: 0, status: 'Out of Stock', bin: 'A-02-11', category: 'Accessories' },
    { name: 'Mouse', sku: 'MS-5003', stock: 18, status: 'In Stock', bin: 'A-02-07', category: 'Accessories' },
    { name: 'Earphones', sku: 'EP-3309', stock: 8, status: 'Low Stock', bin: 'B-03-04', category: 'Audio' },
    { name: 'Buds', sku: 'BU-1907', stock: 0, status: 'Out of Stock', bin: 'B-05-02', category: 'Audio' }
  ],

  orders: [
    {
      id: 'ORD-84920',
      customer: { name: 'Jonathan Reynolds', email: 'j.reynolds@acmecorp.com', phone: '+1 (555) 234-8901', address: '742 Evergreen Terrace, Springfield, IL 62704' },
      items: [
        { sku: 'SKU-99201', name: 'Titan Pro 4K Wireless Action Cam', qty: 2, bin: 'A-02-04-B', picked: 2, weight: 0.9 },
        { sku: 'SKU-99203', name: 'Quantum Core NVMe 2TB SSD', qty: 1, bin: 'A-05-02-C', picked: 1, weight: 0.12 }
      ],
      status: 'dispatched',
      priority: 'Urgent',
      zone: 'Zone A',
      pickerId: 'PCK-101',
      pickerName: 'Marcus Vance',
      carrier: 'FedEx Express',
      trackingNumber: 'FDX-9982-1402-901',
      dockId: 'DOCK-01',
      riskScore: 4,
      riskLevel: 'Low',
      riskFlags: [],
      createdAt: '2026-08-17 18:30',
      dispatchedAt: '2026-08-17 21:15',
      slaMinutesLeft: 0,
      totalWeightKg: 1.02,
      totalValue: 747
    },
    {
      id: 'ORD-84921',
      customer: { name: 'Aurelia Sterling', email: 'aurelia.s@fintech-labs.io', phone: '+1 (555) 901-4432', address: '1200 Avenue of the Americas, Floor 34, New York, NY 10036' },
      items: [
        { sku: 'SKU-99202', name: 'AeroSound Noise-Cancelling Headphones', qty: 4, bin: 'A-03-01-A', picked: 4, weight: 1.52 }
      ],
      status: 'staged',
      priority: 'Express',
      zone: 'Zone A',
      pickerId: 'PCK-102',
      pickerName: 'Elena Rostova',
      carrier: 'DHL Worldwide',
      trackingNumber: 'DHL-8834-0192-331',
      dockId: 'DOCK-02',
      riskScore: 8,
      riskLevel: 'Low',
      riskFlags: [],
      createdAt: '2026-08-17 19:40',
      dispatchedAt: null,
      slaMinutesLeft: 35,
      totalWeightKg: 1.52,
      totalValue: 756
    },
    {
      id: 'ORD-84922',
      customer: { name: 'Dmitri Petrov', email: 'dmitri.p@hypernode.ru', phone: '+7 (916) 555-0199', address: 'Unverified Po Box 4099, Unknown County, CA 00000' },
      items: [
        { sku: 'SKU-99203', name: 'Quantum Core NVMe 2TB SSD', qty: 10, bin: 'A-05-02-C', picked: 0, weight: 1.20 },
        { sku: 'SKU-99201', name: 'Titan Pro 4K Wireless Action Cam', qty: 5, bin: 'A-02-04-B', picked: 0, weight: 2.25 }
      ],
      status: 'risky',
      priority: 'Urgent',
      zone: 'Zone A',
      pickerId: null,
      pickerName: 'Unassigned',
      carrier: 'DHL Worldwide',
      trackingNumber: 'PENDING-SECURITY-HOLD',
      dockId: null,
      riskScore: 94,
      riskLevel: 'Critical',
      riskFlags: [
        { type: 'FRAUD_VELOCITY', title: 'High-Value Anomaly ($2,985)', desc: 'Order value is 8.4x higher than standard regional velocity.' },
        { type: 'GEO_MISMATCH', title: 'Address & IP Geolocation Mismatch', desc: 'Billing IP originates from Moscow, while shipping address is an unverified California postal drop.' }
      ],
      createdAt: '2026-08-17 20:10',
      dispatchedAt: null,
      slaMinutesLeft: 15,
      totalWeightKg: 3.45,
      totalValue: 2985
    },
    {
      id: 'ORD-84923',
      customer: { name: 'Apex Logistics LLC', email: 'warehouse-ops@apexlog.com', phone: '+1 (555) 773-9002', address: '450 Industrial Parkway, Dock 12, Columbus, OH 43215' },
      items: [
        { sku: 'SKU-77401', name: 'Titanium Industrial Drill Press 1200W', qty: 2, bin: 'C-02-01-A', picked: 1, weight: 37.0 },
        { sku: 'SKU-77402', name: 'Heavy-Duty Hydraulic Floor Jack 3-Ton', qty: 1, bin: 'C-04-03-C', picked: 0, weight: 24.0 }
      ],
      status: 'picking',
      priority: 'Standard',
      zone: 'Zone C',
      pickerId: 'PCK-105',
      pickerName: 'Tariq Al-Mansoor',
      carrier: 'Internal Fleet #4',
      trackingNumber: 'FLT-04-99120',
      dockId: 'DOCK-06',
      riskScore: 12,
      riskLevel: 'Low',
      riskFlags: [],
      createdAt: '2026-08-17 20:15',
      dispatchedAt: null,
      slaMinutesLeft: 70,
      totalWeightKg: 61.0,
      totalValue: 1080
    },
    {
      id: 'ORD-84924',
      customer: { name: 'St. Jude Research BioLab', email: 'supply@stjude-lab.org', phone: '+1 (555) 888-3411', address: '262 Danny Thomas Pl, Memphis, TN 38105' },
      items: [
        { sku: 'SKU-66501', name: 'CryoCell Bio-Reagent Vaccine Cool-Box', qty: 2, bin: 'D-01-02-A', picked: 2, weight: 3.60 }
      ],
      status: 'packed',
      priority: 'Critical Cold Chain',
      zone: 'Zone D',
      pickerId: 'PCK-106',
      pickerName: 'Automated AGV-09',
      carrier: 'FedEx Express',
      trackingNumber: 'FDX-7741-9923-110',
      dockId: 'DOCK-01',
      riskScore: 18,
      riskLevel: 'Low',
      riskFlags: [],
      createdAt: '2026-08-17 20:30',
      dispatchedAt: null,
      slaMinutesLeft: 22,
      totalWeightKg: 3.60,
      totalValue: 1240
    },
    {
      id: 'ORD-84925',
      customer: { name: 'Valerie Gomez', email: 'valerie.g@cloudtech.co', phone: '+1 (555) 441-2099', address: '88 Tech Boulevard, Austin, TX 78701' },
      items: [
        { sku: 'SKU-66502', name: 'Lithium Iron Smart Battery Pack 48V', qty: 4, bin: 'D-03-01-B', picked: 0, weight: 34.0 }
      ],
      status: 'risky',
      priority: 'Urgent',
      zone: 'Zone D',
      pickerId: null,
      pickerName: 'Unassigned',
      carrier: 'FedEx Ground',
      trackingNumber: 'HOLD-HAZMAT-CERT',
      dockId: null,
      riskScore: 88,
      riskLevel: 'High',
      riskFlags: [
        { type: 'HAZMAT_RESTRICTION', title: 'Class 9 Dangerous Goods (Lithium Pack)', desc: 'Shipment exceeds 30kg air cargo limit. Requires UN3480 DG declaration form before warehouse release.' }
      ],
      createdAt: '2026-08-17 20:45',
      dispatchedAt: null,
      slaMinutesLeft: 40,
      totalWeightKg: 34.0,
      totalValue: 2160
    },
    {
      id: 'ORD-84926',
      customer: { name: 'Ethan Walker', email: 'ethan.w@gmail.com', phone: '+1 (555) 332-1190', address: '502 Pine Street, Apt 3B, Seattle, WA 98101' },
      items: [
        { sku: 'SKU-88301', name: 'ThermaShield Insulated Parka (L)', qty: 1, bin: 'B-01-03-A', picked: 1, weight: 1.20 },
        { sku: 'SKU-88302', name: 'ErgoComfort Memory Foam Pillow Set', qty: 2, bin: 'B-04-02-D', picked: 1, weight: 4.20 }
      ],
      status: 'picking',
      priority: 'Standard',
      zone: 'Zone B',
      pickerId: 'PCK-103',
      pickerName: 'Devon Miller',
      carrier: 'UPS Ground',
      trackingNumber: 'UPS-1Z992A01239',
      dockId: 'DOCK-03',
      riskScore: 5,
      riskLevel: 'Low',
      riskFlags: [],
      createdAt: '2026-08-17 21:00',
      dispatchedAt: null,
      slaMinutesLeft: 85,
      totalWeightKg: 5.40,
      totalValue: 278
    },
    {
      id: 'ORD-84927',
      customer: { name: 'Quantum Robotics Lab', email: 'orders@q-robotics.de', phone: '+49 (89) 123456', address: 'Bayerstrasse 44, 80335 München, Germany' },
      items: [
        { sku: 'SKU-99201', name: 'Titan Pro 4K Wireless Action Cam', qty: 3, bin: 'A-02-04-B', picked: 0, weight: 1.35 }
      ],
      status: 'risky',
      priority: 'Express',
      zone: 'Zone A',
      pickerId: null,
      pickerName: 'Unassigned',
      carrier: 'DHL Worldwide',
      trackingNumber: 'HOLD-INVENTORY-CHECK',
      dockId: null,
      riskScore: 78,
      riskLevel: 'High',
      riskFlags: [
        { type: 'STOCKOUT_DISCREPANCY', title: 'Inventory Discrepancy at Bin A-02-04-B', desc: 'Picker audit logged 2 physical units remaining vs 124 in database.' }
      ],
      createdAt: '2026-08-17 21:05',
      dispatchedAt: null,
      slaMinutesLeft: 30,
      totalWeightKg: 1.35,
      totalValue: 897
    },
    {
      id: 'ORD-84928',
      customer: { name: 'Sarah Lin', email: 'sarah.lin@creatives.co', phone: '+1 (555) 771-0023', address: '900 Market St, San Francisco, CA 94102' },
      items: [
        { sku: 'SKU-88303', name: 'Precision Barista Stainless Espresso Kit', qty: 1, bin: 'B-06-01-B', picked: 1, weight: 3.40 }
      ],
      status: 'dispatched',
      priority: 'Standard',
      zone: 'Zone B',
      pickerId: 'PCK-104',
      pickerName: 'Priya Sharma',
      carrier: 'Amazon Freight',
      trackingNumber: 'AMZ-TBA99214488',
      dockId: 'DOCK-04',
      riskScore: 2,
      riskLevel: 'Low',
      riskFlags: [],
      createdAt: '2026-08-17 17:15',
      dispatchedAt: '2026-08-17 20:50',
      slaMinutesLeft: 0,
      totalWeightKg: 3.40,
      totalValue: 210
    },
    {
      id: 'ORD-84929',
      customer: { name: 'Liam O’Connor', email: 'liam.oc@dublin-craft.ie', phone: '+353 (1) 496-0123', address: '14 Grand Canal Quay, Dublin 2, Ireland' },
      items: [
        { sku: 'SKU-99202', name: 'AeroSound Noise-Cancelling Headphones', qty: 1, bin: 'A-03-01-A', picked: 0, weight: 0.38 }
      ],
      status: 'pending',
      priority: 'Standard',
      zone: 'Zone A',
      pickerId: null,
      pickerName: 'Unassigned',
      carrier: 'FedEx Express',
      trackingNumber: 'PENDING-PICK',
      dockId: null,
      riskScore: 6,
      riskLevel: 'Low',
      riskFlags: [],
      createdAt: '2026-08-17 21:20',
      dispatchedAt: null,
      slaMinutesLeft: 110,
      totalWeightKg: 0.38,
      totalValue: 189
    },
    {
      id: 'ORD-84930',
      customer: { name: 'Global Heavy Machinery', email: 'procure@ghmachinery.com', phone: '+1 (555) 991-0022', address: '8800 Port Industrial Rd, Houston, TX 77029' },
      items: [
        { sku: 'SKU-77401', name: 'Titanium Industrial Drill Press 1200W', qty: 4, bin: 'C-02-01-A', picked: 4, weight: 74.0 },
        { sku: 'SKU-77402', name: 'Heavy-Duty Hydraulic Floor Jack 3-Ton', qty: 2, bin: 'C-04-03-C', picked: 2, weight: 48.0 }
      ],
      status: 'dispatched',
      priority: 'Freight Heavy',
      zone: 'Zone C',
      pickerId: 'PCK-105',
      pickerName: 'Tariq Al-Mansoor',
      carrier: 'Maersk Logistics',
      trackingNumber: 'MSK-99214400-US',
      dockId: 'DOCK-08',
      riskScore: 7,
      riskLevel: 'Low',
      riskFlags: [],
      createdAt: '2026-08-17 16:45',
      dispatchedAt: '2026-08-17 21:05',
      slaMinutesLeft: 0,
      totalWeightKg: 122.0,
      totalValue: 2160
    }
  ]
};

// Expose globally
window.SEED_DATA = SEED_DATA;
