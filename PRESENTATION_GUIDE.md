# AgriRide — Engineering College Presentation & Defense Kit

**Project Title:** AgriRide: Full-Stack Agricultural Equipment Rental Marketplace  
**Domain:** Agricultural Informatics, Full-Stack Web Engineering, Peer-to-Peer Sharing Economy  
**Tagline:** Rent Smarter. Farm Better.

---

## 1. Abstract

In developing agricultural economies such as India, mechanization is vital for crop productivity and post-harvest efficiency. However, over 86% of agrarian landholders are small and marginal farmers who cannot afford the steep capital expenditure required to purchase tractors, combine harvesters, and precision spraying drones. This results in heavy reliance on informal moneylenders or manual labor bottlenecks. Concurrently, existing machinery owners suffer from asset under-utilization, with tractors idling for 7 to 8 months per year.

**AgriRide** is a full-stack, responsive, and secure web application that implements an on-demand agricultural machinery marketplace. The platform connects farmers with verified local machinery owners through transparent hourly and daily pricing algorithms, cryptographic JWT role-based access control, server-side anti-collision booking schedules, and role-specific dashboards. Built using React, Vite, Tailwind CSS, Django REST Framework, and PostgreSQL, AgriRide provides an accessible, debt-free mechanization pathway for rural farming communities.

---

## 2. Problem Statement & Socio-Economic Impact

| Challenge in Existing Rural Ecosystem | AgriRide Engineered Solution |
| :--- | :--- |
| **High Capital Barrier:** Tractors cost ₹6L–₹14L; harvesters cost ₹25L+. | **Pay-per-use Model:** Farmers rent calibrated machines only for operational hours/days. |
| **Seasonal Idle Capacity:** Machinery idles 60–70% of the year. | **Asset Monetization:** Fleet owners generate ₹40,000–₹1,20,000 monthly in off-seasons. |
| **Middleman Exploitation:** Informal village brokers take 20–30% cuts. | **Direct P2P Handshake:** Transparent automated pricing with a nominal 5% platform escrow fee. |
| **Information Asymmetry:** No visibility into local availability. | **Real-Time Fleet Catalog:** Multi-parameter search by brand, HP, location, and driver inclusion. |

---

## 3. System Architecture & Tech Stack

```text
+-----------------------------------------------------------------------------------+
|                              PRESENTATION LAYER (SPA)                             |
|       React 18 + Vite + Tailwind CSS + Lucide React + React Router DOM            |
|       (Role Portals: Public Marketplace, Farmer Dashboard, Owner Dashboard, Admin)|
+-----------------------------------------+-----------------------------------------+
                                          | Axios HTTP / REST (JWT Bearer Auth)
                                          v
+-----------------------------------------------------------------------------------+
|                               APPLICATION SERVICES                                |
|        Python 3.14+ / Django 5.2 / Django REST Framework / Simple JWT             |
|                                                                                   |
|  [Auth & RBAC]         [Equipment Fleet]      [Pricing & Anti-Collision Engine]  |
|  - Register / Login    - Fleet CRUD           - Atomic Date Locking               |
|  - Token Refresh       - Category Filters     - Base + Deposit + 5% Escrow Fee    |
|  - Role Permissions    - Media Galleries      - Status State Machine              |
+-----------------------------------------+-----------------------------------------+
                                          | Django ORM / Connection Pooling
                                          v
+-----------------------------------------------------------------------------------+
|                               PERSISTENCE LAYER                                   |
|                          PostgreSQL Relational Database                           |
|       (Users, Categories, Equipment, EquipmentImages, Bookings, Notifications)    |
+-----------------------------------------------------------------------------------+
```

---

## 4. Entity-Relationship (ER) Schema Design

```text
  +------------------+         +---------------------+
  |      USERS       | 1     * |      EQUIPMENT      |
  |------------------|---------|---------------------|
  | id (UUID, PK)    |         | id (UUID, PK)       |
  | email (unique)   |         | owner_id (FK->User) |
  | username         |         | category_id (FK)    |
  | role (ENUM)      |         | name, brand, power  |
  | phone, address   |         | price_per_hour      |
  +------------------+         | price_per_day       |
           | 1                 | security_deposit    |
           |                   | location, state     |
           | *                 | available (Boolean) |
  +------------------+         +---------------------+
  |  NOTIFICATIONS   |                    | 1
  |------------------|                    |
  | id (UUID, PK)    |                    | *
  | user_id (FK)     |         +---------------------+
  | title, message   |         |  EQUIPMENT_IMAGES   |
  | is_read (Bool)   |         |---------------------|
  +------------------+         | id (UUID, PK)       |
                               | equipment_id (FK)   |
                               | image_url, is_prim  |
                               +---------------------+
                                          | 1
                                          |
                                          | *
                               +---------------------+
                               |      BOOKINGS       |
                               |---------------------|
                               | id (UUID, PK)       |
                               | farmer_id (FK->User)|
                               | equipment_id (FK)   |
                               | start_date, end_date|
                               | billing_mode        |
                               | duration_units      |
                               | base_amount         |
                               | security_deposit    |
                               | platform_fee        |
                               | total_amount        |
                               | booking_status(ENUM)|
                               +---------------------+
```

---

## 5. Scripted Faculty Demonstration Sequence (13 Steps)

Follow this step-by-step walkthrough during your live presentation:

1. **Step 1: Open the AgriRide Landing Page (`/`)**
   - *Presenter statement:* "Good morning, respected evaluators. This is AgriRide, an on-demand agricultural equipment rental marketplace."
   - Highlight the value proposition: *"Rent Smarter. Farm Better."* Show the high-converting hero section and 4-step workflow.

2. **Step 2: Explain the Agricultural Problem**
   - Click **About Us** in the navigation bar.
   - Explain the 86% small landholder dilemma, prohibitive tractor capital debt, and seasonal idle capacity.

3. **Step 3: Show the Marketplace Catalog (`/marketplace`)**
   - Demonstrate category filtering: click **Tractors**, **Combine Harvesters**, or **Agricultural Drones**.
   - Adjust the **Max Hourly Rate** slider and filter by State (*Punjab, Haryana, Maharashtra*).

4. **Step 4: Log in as a Farmer**
   - Click **Sign In**.
   - Click the 1-click **🌾 Farmer** demo button (`farmer.demo@agriride.org`).
   - Click **Sign In with JWT**. The header updates with the farmer's name and role pill.

5. **Step 5: Search for a Tractor**
   - In the marketplace search bar, type `Mahindra`.
   - The card for *Mahindra Novo 755 DI (74 HP 4WD)* appears.

6. **Step 6: Open Equipment Details**
   - Click **View Specs**.
   - Show the technical specifications table, fuel policy, and owner trust badge.

7. **Step 7: Submit a Rental Booking**
   - Select **Daily Billing Mode** and set duration to `2 Days`.
   - Show the dynamic price breakdown:
     - Base Rate: $2 \times ₹3,200 = ₹6,400$
     - Refundable Security Deposit: $₹2,000$
     - 5% Platform Fee: $₹320$
     - **Grand Total:** $₹8,720$
   - Click **Request Rental Booking**. The server validates dates, computes totals, and saves the booking.

8. **Step 8: Open Farmer Dashboard (`/farmer/dashboard`)**
   - Click on the user's name capsule in the navbar.
   - Point out the newly created booking with status **`⏳ Pending Owner Review`**.

9. **Step 9: Log in as the Equipment Owner**
   - Click the **LogOut** icon.
   - Click **Sign In** $\rightarrow$ click the 1-click **🚜 Owner** demo button (`owner.dhillon@agriride.org`) $\rightarrow$ **Sign In**.

10. **Step 10: Accept the Booking Request**
    - Click the user capsule to open the **Owner Dashboard** (`/owner/dashboard`).
    - Under **Incoming Booking Requests**, show the pending request from Jaswinder Singh.
    - Click the green **Accept** button.
    - *Presenter statement:* "The backend runs an atomic anti-collision check to prevent double bookings, updates the booking status to ACCEPTED, and triggers an in-app notification to the farmer."

11. **Step 11: Demonstrate Fleet Management**
    - Click **My Equipment Fleet** tab to show the owner's listed machinery.
    - Click **List New Machinery** button to open the modal form, demonstrating how an owner can list an implement in under 60 seconds.

12. **Step 12: Return to Farmer Dashboard to Show Status Update**
    - Sign out and sign back in as **Farmer**.
    - Open **Farmer Dashboard**.
    - Show that the booking status is now **`✅ Confirmed by Owner`** (Ready for field dispatch).

13. **Step 13: Open Admin Dashboard (`/admin/dashboard`)**
    - Sign out and log in with the 1-click **🛡️ Admin** demo button (`admin@agriride.org`).
    - Open the **Admin Dashboard**.
    - Present platform-wide metrics: Total registered users, total equipment listings, all bookings audit trail, and gross transaction value.

---

## 6. Pre-Configured Demo Credentials

| Role | Email Address | Password | Permissions & Dashboard |
| :--- | :--- | :--- | :--- |
| **🌾 Farmer** | `farmer.demo@agriride.org` | `Farmer@1234` | Browse, rent machinery, cancel requests, view bookings (`/farmer/dashboard`) |
| **🚜 Owner** | `owner.dhillon@agriride.org` | `Owner@1234` | Manage fleet, accept/decline rentals, earnings analytics (`/owner/dashboard`) |
| **🛡️ Admin** | `admin@agriride.org` | `Admin@1234` | Platform metrics, all bookings audit, user directory (`/admin/dashboard`) |

---

## 7. Future Enhancements

1. **IoT Telematics & GPS Geo-Fencing:** Real-time tractor hours tracking via OBD-II sensors to automate hourly billing upon field entry/exit.
2. **Automated Razorpay Webhooks:** Escrow-based milestone payouts releasing funds upon digital sign-off from both parties.
3. **Multilingual Regional Voice Interface:** Voice-assisted Hindi, Punjabi, and Marathi conversational booking for low-literacy farmers.
