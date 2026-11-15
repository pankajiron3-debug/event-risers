# 🚀 Event Risers — Indian Enterprise B2B Corporate SaaS

> **Web & Software Developer Internship Capstone Project**  
> An executive-grade B2B SaaS application tailored for the **Indian Corporate Market**, featuring **CMS Data Management**, **In-Memory Automated GST PDF Billing (₹ INR)**, and **Corporate Email Dispatch**.

---

## 🇮🇳 Indian B2B Corporate Market Localization

1. **Indian Rupee (`₹ INR`) Currency Standard:**
   - All monetary figures formatted with the Indian comma system (`en-IN`, e.g., `₹ 6,50,000.00`).
   - Top analytics cards, client table, onboarding forms, and PDF invoices exclusively use `₹ INR`.

2. **GST Compliance & In-Memory PDF Billing:**
   - Vector invoice generation via `pdfkit` (streaming buffer in memory, zero disk footprint).
   - Itemized breakdown: Base Contract Amount + **18% GST** (9% CGST + 9% SGST / Integrated GST) = **Total Payable in ₹ INR**.
   - SAC Code: **998596** (Event Management Services).
   - Corporate details: *Event Risers Corporate Solutions Pvt. Ltd.*, GSTIN: `07AAACE9821F1Z8`, Corporate PAN: `AAACE9821F`.
   - Banking Remittance: RTGS / NEFT / IMPS via HDFC Bank Corporate Treasury Branch.

3. **Realistic Indian Corporate Demo Data:**
   - *Tata Elxsi Ltd.* — Contact: *Rohan Deshmukh (VP Marketing)* — Event: *Annual Tech Leadership Conclave* — Valuation: `₹ 6,50,000`
   - *Razorpay Software Pvt. Ltd.* — Contact: *Ananya Iyer (Head of Events)* — Event: *Fintech Innovation Summit* — Valuation: `₹ 4,80,000`
   - *Mahindra & Mahindra Corporate* — Contact: *Vikramaditya Nair (Director Operations)* — Event: *National Dealers Meet* — Valuation: `₹ 8,20,000`
   - Prefill demo partner: *Infosys BPM Ltd.* (Priya Sharma, `₹ 5,50,000`).

---

## 🏗️ Architecture & Tech Stack

```
event-risers/
├── backend/
│   ├── config/
│   │   └── db.js                    # Resilient Mongoose connection logic
│   ├── models/
│   │   └── Client.js                # Corporate client schema with Indian event categories
│   ├── controllers/
│   │   ├── clientController.js      # CRUD operations & aggregated analytics pipeline
│   │   └── billingController.js     # In-memory GST PDF generation & email automation
│   ├── routes/
│   │   ├── clientRoutes.js          # /api/clients endpoints
│   │   └── billingRoutes.js         # /api/billing endpoints
│   ├── middleware/
│   │   └── errorMiddleware.js       # Crash-proof asyncHandler & global error handler
│   ├── utils/
│   │   ├── pdfGenerator.js          # In-memory GST vector invoice generator (PDFKit)
│   │   └── emailService.js          # Nodemailer with automatic Ethereal fallback & GST breakdown
│   ├── .env                         # Server environment configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Express application entrypoint
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx           # Dark slate header with Indian B2B SaaS badge
    │   │   ├── AnalyticsCards.jsx   # Top-level dynamic KPIs in ₹ INR
    │   │   ├── ClientForm.jsx       # Collapsible onboarding form with Indian placeholders
    │   │   ├── SearchBar.jsx        # Real-time search & registry count
    │   │   └── ClientTable.jsx      # Registry table with multi-stage action buttons (₹ INR)
    │   ├── services/
    │   │   └── api.js               # Centralized Axios client (VITE_API_URL)
    │   ├── App.jsx                  # Main dashboard state & interactive toast notifications
    │   ├── main.jsx                 # React root renderer
    │   └── index.css                # Tailwind CSS styling & custom scrollbars
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    ├── .env                         # Frontend environment configuration
    ├── .env.example
    └── package.json
```

---

## ⚡ Key Highlights for Internship Presentation

1. **Top Summary Analytics Cards (₹ INR):**
   - Real-time aggregated metrics (**Total Corporate Clients**, **Total Invoices Generated**, **Total Contract Valuation in ₹ INR**) computed directly via MongoDB aggregation pipeline.

2. **Real-Time Multi-Stage Automation Button:**
   - Clicking `"Generate & Email Invoice"` transitions that specific row through three distinct phases:
     $$\text{Idle} \longrightarrow \text{"Generating PDF..."} \longrightarrow \text{"Sending Email..."} \longrightarrow \text{"Done!"} \longrightarrow \text{Reset (3s)}$$

3. **Zero-Disk In-Memory GST PDF Billing:**
   - PDFs are streamed and concatenated into a memory buffer (`Buffer.concat`) using `pdfkit`. No temporary files are written to disk.

4. **Zero-Config Ethereal Email Sandbox Fallback:**
   - If no custom SMTP credentials are provided in `.env`, the system provisions an ephemeral Ethereal test inbox.
   - The returned `previewUrl` is surfaced directly in an interactive toast notification with a clickable button: **"Open Live Email Preview"**.

---

## 🚀 Quickstart Guide

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```
*Server boots on `http://localhost:5000`.*

### 2. Start the Frontend Dashboard
```bash
cd frontend
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## ⚙️ Environment Variables Configuration

### `backend/.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/event_risers

# Optional: Custom Corporate SMTP Credentials
# Leave empty to use zero-config Ethereal test inbox with browser preview links!
EMAIL_USER=
EMAIL_PASS=
EMAIL_SERVICE=
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 Production Deployment Guide

### Deploy Backend to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (runs `node server.js`)
4. Add Environment Variables in the Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `NODE_ENV`: `production`
   - `PORT`: Leave Render's default or set `5000`.
   - `EMAIL_USER` & `EMAIL_PASS` (Optional, defaults to automatic Ethereal sandbox).

### Deploy Frontend to Vercel
1. Create a new Project on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Configure the project settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g. `https://your-backend.onrender.com`).
5. Click **Deploy**. Vercel will build and serve your SPA with zero CORS issues.

