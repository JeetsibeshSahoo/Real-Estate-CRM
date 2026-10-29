# 🏢 AnuEstate — Real Estate Platform & Lead Management CRM

An enterprise-grade, responsive full-stack real estate web application integrated with an intelligent Lead Management CRM and Analytics Dashboard. 

Designed and engineered for **Anuverse Technologies** practical evaluation.

---

## 🌟 Key Features

### 1. Public Real Estate Portal (Client-Facing)
- **High-Impact Homepage:** Hero section with quick search, category pills (Apartments, Villas, Commercial, Studios, Plots), and featured listing carousel.
- **Dynamic Catalog & Filtering:** Search by keywords/locations, filter by property type, budget price range sliders (Min/Max USD), and bedroom count with URL state preservation.
- **Detailed Property Showcase:** Image galleries, price formatting, location tags, architectural specifications, and amenities checklist.
- **Direct Enquiry Lead Capture:** Interactive contact form that automatically registers visitor inquiries into the CRM pipeline with status `New`.

### 2. Lead Management CRM (Business/Agent-Facing)
- **Role-Based Authentication (RBAC):** Secure JWT authentication protecting internal business functions with an instant one-click demo credentials autofill for quick evaluation.
- **Lead Pipeline Workflow:** Real-time tracking of inquiries through lifecycle stages: `New` ➔ `Contacted` ➔ `Interested` ➔ `Converted` ➔ `Lost`.
- **Follow-up Activity Timeline:** Log chronological notes and audit status transitions for every prospect.
- **Search & Filter:** Instant lead discovery by client name, email, phone, or interested property.

### 3. Executive Analytics & Visual Dashboard
- **Real-Time KPI Cards:** Total Properties, Total Leads Captured, Active Enquiries, and Converted Leads with automated Conversion Rate %.
- **Custom Pipeline Bar Chart:** Recharts visualization of lead volume across pipeline stages with custom glassmorphism tooltips.
- **Donut Inventory Distribution:** Category distribution circle chart with center metric stat counter and percentage share breakdown.
- **Recent Enquiries Feed:** Instant overview of the latest incoming property inquiries.

### 4. Property Inventory Management (CRUD)
- Full inventory table with mobile-responsive card view.
- Create and publish new listings with custom specifications, pricing, and images.
- Instant listing deletion and public preview shortcut.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Redux Toolkit (RTK), Tailwind CSS v4, Lucide React, Recharts |
| **Backend** | Node.js, Express.js (ES Modules, RESTful Architecture) |
| **Database** | MongoDB with Mongoose ODM |
| **Security & Auth** | JSON Web Tokens (JWT), bcryptjs password hashing, CORS, protected route middleware |
| **Typography** | Google Fonts (Plus Jakarta Sans) |

---

## 📁 Project Architecture & Structure

```text
Real_Estate/
├── client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── api/                 # Centralized Axios instance & interceptors
│   │   ├── components/          # Reusable UI (Navbar, Footer, PropertyCard, CrmLayout, ScrollToTop)
│   │   ├── pages/               # Views (Home, Properties, PropertyDetails, Login, Dashboard, Leads, CrmProperties)
│   │   ├── redux/               # Redux Toolkit store and auth slices
│   │   ├── App.jsx              # Application routing & conditional layout
│   │   ├── index.css            # Tailwind directives & typography layers
│   │   └── main.jsx             # React entry point with Redux Provider
│   ├── index.html               # Plus Jakarta Sans Google Fonts
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite + Tailwind v4 config
│
├── server/                      # Node.js / Express Backend
│   ├── config/                  # Mongoose MongoDB connection pool
│   ├── controllers/             # Auth, Property, Lead, and Dashboard controllers
│   ├── middleware/              # JWT verification & RBAC authorization
│   ├── models/                  # User, Property, and Lead Mongoose schemas
│   ├── routes/                  # Express RESTful API routers
│   ├── seeder/                  # Database seeder script for instant evaluation
│   ├── .env                     # Server environment configuration
│   ├── package.json             # Backend dependencies
│   └── server.js                # API server entry point
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Installation & Setup Guide

### Prerequisites
- Node.js (v18.x or later installed)
- MongoDB running locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster

---

### 1. Backend Setup

```bash
# Navigate to the server folder
cd server

# Install backend dependencies
npm install

# Create environment configuration (.env)
# Inside server/.env, verify or set the following variables:
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/real_estate_crm
JWT_SECRET=super_secret_jwt_key_real_estate_2026_anuverse
CLIENT_URL=http://localhost:5173

# Seed the database with realistic sample listings and admin account
npm run seed

# Start the backend development server
npm run dev
```
> The API will boot on `http://localhost:5000` with connected MongoDB.

---

### 2. Frontend Setup

Open a second terminal window:

```bash
# Navigate to the client folder
cd client

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```
> The application will open at `http://localhost:5173`.

---

## 🔑 Demo Credentials (Evaluator Quick Access)

You can use the **"Fill Admin"** one-click button on the `/login` screen or manually sign in with:

| Field | Value |
| :--- | :--- |
| **Email** | `admin@realestate.com` |
| **Password** | `adminpassword123` |
| **Role** | System Administrator |

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new internal agent
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Verify token and get current user profile *(Protected)*

### Properties
- `GET /api/properties` — List properties with keyword, city, type, and price filters
- `GET /api/properties/:id` — Get single property details
- `POST /api/properties` — Create new listing *(Protected)*
- `PUT /api/properties/:id` — Update listing *(Protected)*
- `DELETE /api/properties/:id` — Remove listing *(Protected: Admin only)*

### Leads CRM
- `POST /api/leads` — Capture enquiry from public property page
- `GET /api/leads` — List leads with status & text search filters *(Protected)*
- `GET /api/leads/:id` — Get lead details with notes history *(Protected)*
- `PATCH /api/leads/:id/status` — Update pipeline status *(Protected)*
- `POST /api/leads/:id/notes` — Append follow-up note *(Protected)*
- `DELETE /api/leads/:id` — Delete enquiry record *(Protected: Admin only)*

### Dashboard Analytics
- `GET /api/dashboard/stats` — KPI counts, conversion rates, and chart aggregations *(Protected)*

---

## 📄 License
This project is developed as an unpaid practical evaluation assignment for **Anuverse Technologies**.