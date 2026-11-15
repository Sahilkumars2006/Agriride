# AgriRide — Rent Smarter. Farm Better.

> A production-grade, full-stack Agricultural Equipment Rental Marketplace connecting farmers who need agricultural machinery with verified equipment owners.

[![Tech Stack: React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20TailwindCSS-174D35.svg)](#tech-stack)
[![Backend: Django](https://img.shields.io/badge/Backend-Django%20%7C%20DRF%20%7C%20JWT-65A66C.svg)](#tech-stack)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg)](#tech-stack)

---

## 🌾 Project Overview

**AgriRide** addresses one of the most critical socio-economic challenges faced by small and marginal farmers: prohibitive capital expenditure for modern agricultural machinery. By facilitating transparent, on-demand, peer-to-peer equipment rentals, AgriRide improves machinery utilization and provides affordable access to tractors, harvesters, drone sprayers, and rotavators.

### Core Roles
- **Farmers:** Discover, compare, filter, check availability, and request bookings for agricultural equipment with transparent hourly/daily pricing.
- **Equipment Owners:** List machinery, upload specifications and photos, set pricing, manage availability calendars, accept/reject booking requests, and track earnings.
- **Administrators:** Oversee user registrations, approve equipment listings, inspect booking lifecycles, and monitor marketplace analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React, Recharts |
| **Backend** | Python 3.14+, Django 5+, Django REST Framework, Simple JWT, Django CORS Headers |
| **Database** | PostgreSQL, Django ORM |
| **Visual Design** | Custom Design System inspired by modern AgTech platforms (Forest Green, Leaf Green, Harvest Gold) |

---

## 📁 Repository Structure

```text
AgriRide/
├── frontend/             # React + Vite + Tailwind CSS Single Page Application
│   ├── public/           # Static assets, logos, and icons
│   ├── src/
│   │   ├── assets/       # Media and image fallbacks
│   │   ├── components/   # Reusable UI components (common, marketplace, dashboard)
│   │   ├── context/      # React contexts (AuthContext, MarketplaceContext)
│   │   ├── data/         # Sample agricultural machinery data & schemas
│   │   ├── pages/        # Route pages (Landing, Marketplace, Detail, Dashboards, Auth)
│   │   ├── services/     # Axios API client & services
│   │   ├── App.jsx       # Root router & layout wrapper
│   │   └── index.css     # Global styles & Tailwind configuration
├── backend/              # Django + Django REST Framework API (Day 2+)
│   ├── manage.py
│   ├── agriride_backend/ # Project settings, URLs, WSGI
│   └── apps/             # Modular Django apps (users, equipment, bookings)
├── PROJECT_STATUS.md     # Active development tracker & roadmap
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) & npm (v9+)
- Python 3.10+
- PostgreSQL (v14+)

### Frontend Setup (Day 1)
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to explore the AgriRide marketplace and landing page.

---

## 📄 License
Developed for academic engineering presentation & portfolio demonstration.
