# OmniFlow — Smart Warehouse & Fulfillment Operations Command Suite

A modern, high-performance, real-time web application for end-to-end Smart Warehouse Management, Order Picking, Outbound Logistics, Risk Anomaly Resolution, and 2D Floor Mapping.

---

## 🌟 Key Dashboards & Modules

### 1. 📊 Operations Overview (Executive Command Center)
- **Real-Time KPIs**: Total Active Orders, In Picking Queue, Dispatched Today, and Flagged Risky Orders.
- **Fulfillment Pipeline**: Step-by-step visual tracker (Pending Wave ➔ In Picking ➔ Packed & Staged ➔ Dispatched ➔ Risky Exceptions).
- **Floor Activity Feed**: Real-time event ticker logging picker completions, truck dispatches, and incoming inbound orders.
- **Quick Order Simulator**: Trigger new incoming orders on-demand.

### 2. 📦 Order Picking & Wave Management (`#picking`)
- **Zone Filtering**: Switch between **Zone A (Tech & High-Velocity)**, **Zone B (Apparel & Home)**, **Zone C (Heavy Bulk Pallets)**, and **Zone D (Cold Chain & Fragile)**.
- **Picker Productivity**: Live units/hour velocity, accuracy rates, and assigned wave queues for floor operators and Autonomous AGV robots.
- **Interactive Scan & Pick**: Live verification checklist with bin coordinates (e.g. `A-02-04-B`), SKU barcode simulation, sound effects, and automated wave completion.

### 3. 🚚 Order Dispatched & Logistics Hub (`#dispatch`)
- **8 Outbound Loading Dock Bays (01–08)**: Live trailer staging status, carrier logos, trailer load fill percentages, and cutoff departure countdowns.
- **Carrier Manifest & Shipments Table**: FedEx Express, DHL Worldwide, UPS Ground, Amazon Freight, BlueDart Air, and Internal Fleet.
- **Printable Thermal Shipping Labels**: 4x6 inch standard thermal barcode labels with ship-from and ship-to waybills.
- **1-Click Batch Dispatch**: Clear and dispatch loading docks upon trailer departure.

### 4. ⚠️ Risky Orders & Exception Management (`#risky`)
- **Automated Anomaly Detection**:
  - **Class 9 Hazmat Dangerous Goods Compliance**: Identifies battery & chemical transport class violations.
  - **Geolocation & IP Address Mismatch**: Flags suspicious foreign orders with unverified postal drops.
  - **Inventory Stockout Discrepancy**: Physical bin count under-reporting vs database records.
  - **SLA Breach Threat**: Alerts for delayed orders approaching same-day carrier cutoff.
- **1-Click Resolution Engine**:
  1. *Override Risk & Force Release*
  2. *Re-Route to Secondary Reserve Storage Bin*
  3. *Cancel Order & Restock Inventory*

### 5. 🗺️ 2D Interactive Warehouse Floor Map (`#floor-map`)
- **Interactive Floor Grid**: Visual layouts for Zones A, B, C, and D with individual storage bays.
- **Dual Heatmap Modes**:
  - 🔥 **Pick Velocity**: Red/amber hot spots for high-frequency picks vs cool green bins.
  - 📊 **Bin Capacity**: Track spatial utilization.
- **Bin Inspector**: Click any storage bin to inspect SKU stock levels, unit weights, and pending queue orders.

### 6. 📈 Operations Analytics & SLA Metrics (`#analytics`)
- **Hourly Fulfillment Throughput**: Interactive SVG curve graph comparing Orders Picked vs Dispatched over 24 hours.
- **Carrier SLA Performance**: On-Time percentage ratings.
- **Cycle Time Benchmarks**: Average pick time (4.2m) and dock turnaround efficiency (28.4m).

---

## 🚀 How to Run the Project

### Option 1: Using Python Dev Server (Recommended)
Run the following in PowerShell or Terminal:
```bash
py server.py
# Or
python server.py
```
Open your browser at: `http://localhost:3000`

### Option 2: Direct File Open
Simply double-click [`index.html`](index.html) in your file explorer to open directly in any modern browser (Chrome, Edge, Firefox, Safari).

---

## ⚙️ Architecture & Features
- **Zero Dependencies**: Pure HTML5, CSS3, and Modular Vanilla JavaScript with zero npm/build steps.
- **Web Audio API**: Built-in sound synthesis for barcode scanning clicks, alert chimes, and dispatch confirmations.
- **Live Background Simulation**: Realistic background ticker that simulates inbound orders, picker progress, and dock turnarounds every few seconds.
- **State Persistence**: Uses `localStorage` to save all state modifications, order transitions, and resolutions.
