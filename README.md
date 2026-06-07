# DietX – Holistic Wellness & Intelligent Nutrition Platform

DietX is a premium, feature-rich web application designed for comprehensive health tracking, calorie calculation, personalized diet plans, and medical consultations. Built with modern glassmorphism aesthetics and smooth micro-animations, it offers a seamless and premium user experience.

---

## 🚀 Key Features

*   **Calorie Counter & Logger**: Set custom daily calorie goals, track remaining intake, monitor macro split metrics (proteins, carbs, fats), and log today's food log entries.
*   **Suggested Recipes (Premium)**: Unlock 99+ suggested, calorie-calibrated recipes filtered by meal categories (`mrng breakfast`, `11 mrng snacks`, `noon lunch`, `snacks`, `nyt dinner`) with veg/non-veg dot badges.
*   **Women Health Hub (PCOD/PCOS)**: A dedicated consultation portal for female users to book specialized health consults.
*   **1-on-1 Personal Consultancy**: Professional dietician booking integrations supported by seamless payment verification flow.
*   **Admin Dashboard**: Manage user biometrics, live member feeds, transaction logs, revenue analytics, and export user data to CSVs.
*   **Premium Interactive UI**: Curated harmonious HSL palettes, smooth dark/light glass panels, and interactive responsive animations using Framer Motion.

---

## 🛠 Tech Stack

*   **Frontend**: React (TypeScript), Vite, Tailwind CSS, Framer Motion, Axios, Lucide React Icons.
*   **Backend**: Node.js, Express.js, JWT Authentication, Razorpay payment gateway integration, email notification service.

---

## 📂 Project Structure

```text
dietx/
├── frontend/                # Vite + React Client App
│   ├── src/
│   │   ├── components/      # Shared components (Navbar, AestheticBackground, etc.)
│   │   ├── pages/           # Page views (Dashboard, Nutrition, Sessions, PCOD)
│   │   ├── data/            # Calorie reference food items catalog
│   │   ├── assets/          # Static media and images
│   └── package.json
│
├── backend/                 # Node + Express API Server
│   ├── src/
│   │   ├── controllers/     # Route logic handlers (auth, health, payments)
│   │   ├── services/        # Business logic services (payments, email alerts)
│   └── package.json
│
└── README.md
```

---

## 💻 Local Setup & Installation

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Setup the Backend
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The server will spin up on port `5001`.*

### 3. Setup the Frontend
1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
    *The client app will launch at `http://localhost:5173/`.*
