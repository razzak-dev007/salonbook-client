# SalonBook Client — Salon Appointment Booking Platform

**Assignment 9 — Category: 002**  
A modern, responsive, and role-based frontend for **SalonBook**, built with Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide icons, and Stripe Checkout.

---

## 📌 Project Overview
SalonBook is a luxury salon appointment booking application designed to deliver a friction-free booking journey for beauty clients while providing a powerful suite of management tools for salon administrators. Clients can search services, filter by category, sort by price, submit appointment requests with slot conflict prevention, and pay securely via Stripe. Administrators can curate services, review and confirm booking requests, manage customer accounts, and monitor immutable Stripe payment logs.

---

## 🚀 Key Features

### 💇 Customer Features
- **Public Service Discovery**: Explore active salon treatments with responsive image cards, pricing, and duration info without needing to log in.
- **Search, Filter & Sorting**:
  - Real-time search by service name and keywords.
  - Category filtering across 7 specialized beauty disciplines.
  - Price sorting (Low to High, High to Low).
- **Service Details & Slot Conflict Prevention**:
  - Protected service details page with full breakdown.
  - Interactive appointment booking modal with date and predefined time slots.
  - Automatic collision detection preventing duplicate active bookings for the same date and slot.
- **Customer Dashboard**:
  - **Overview**: 4 statistical metric cards (Total Requests, Pending, Confirmed, Cancelled).
  - **My Appointments**: Comprehensive booking cards with status badges and details modal.
  - **Cancellation**: Ability to cancel own pending requests.
  - **Stripe Checkout**: One-click "Pay Now" flow for confirmed appointments.
  - **My Profile**: Update name, phone number, and avatar image with live preview.

### 👑 Administrator Features
- **Admin Dashboard**:
  - 6 KPI metric cards (Total Registered Customers, Active Services, Total Bookings, Pending, Confirmed, Successful Payments).
  - Real-time platform revenue calculator.
- **Manage Services**:
  - Full CRUD: Add, update, delete, and toggle active/inactive status.
  - Positive validation on pricing and duration.
  - Image upload proxy integration with ImgBB.
- **Manage Appointments**:
  - View all customer appointment requests.
  - Filter by status and search by customer name.
  - Confirmation control: only pending appointments can be confirmed.
  - Cancellation control for pending or confirmed bookings.
- **Manage Users**:
  - View registered customer directory.
  - Account suspension toggle (Block / Unblock) with server-side enforcement.
- **Transactions**:
  - Read-only immutable ledger of verified Stripe payments with customer, service, and session details.
  - Strict prevention of manual status manipulation.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 15+ (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom luxury salon palette
- **Icons**: Lucide React (`lucide-react`)
- **Notifications**: Sonner (`sonner`)
- **Celebration Effects**: Canvas Confetti (`canvas-confetti`)
- **Authentication State**: Global React Context with HTTPOnly cookie & Bearer token persistence
- **Payment Processing**: Stripe Checkout & Webhooks

---

## 📋 Required Environment Variables
Create a `.env.local` file in the root of the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=SalonBook
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_IMGBB_API_KEY=
```

> **Note**: Never push `.env.local` or secret keys to GitHub.

---

## 💻 Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/razzak-dev007/salonbook-client.git
   cd salonbook-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

The application will be accessible at `http://localhost:3000`.

---

## 🔑 Default Evaluation Credentials
- **Admin Email**: `admin@salonbook.com`
- **Admin Password**: `Admin@123456`
- **Customer Email**: `customer@salonbook.com`
- **Customer Password**: `Customer@123456`

*(The Sign In page also includes convenient one-click "Fill Admin Login" and "Fill Customer Login" buttons for effortless testing).*

---

## 🔗 Repository & Live Deployment Links
- **Live Client Application**: https://salonbook-client.vercel.app
- **Live Server API**: https://salonbook-server.vercel.app
- **Client GitHub Repository**: https://github.com/razzak-dev007/salonbook-client
- **Server GitHub Repository**: https://github.com/razzak-dev007/salonbook-server

---

## 🛡️ License
MIT License. Developed for Assignment 9 (Category: 002).
