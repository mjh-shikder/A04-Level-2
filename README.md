# 🏠 RentNest — Property Rental Platform API

A full-featured **REST API** for a property rental platform built with **Express.js**, **Prisma ORM**, **PostgreSQL**, and **Stripe** for payment processing.


---

## 🌐 Live URL

- **Live API Base URL:** [Live Link](https://a04-level-2.onrender.com)
- **Demo Video:** [Loom Video](https://www.loom.com/share/acaba23f73ba41518310788ba55631d6) *(if applicable)*




---

## ✨ Features

- **Authentication** — Register, login, JWT-based auth with cookie support
- **Role-Based Access Control** — Tenant, Landlord, and Admin roles
- **Property Management** — CRUD operations for rental properties
- **Rental Requests** — Tenants request, landlords approve/reject
- **Stripe Payments** — Checkout sessions for approved rentals with webhook confirmation
- **Reviews** — Tenants can review properties after renting
- **Admin Dashboard** — Manage users, properties, and rental requests
- **Global Error Handling** — Centralized error handling with Prisma & JWT error support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Payments | Stripe |
| Auth | JWT + bcrypt |

---

## 📁 Project Structure

```
src/
├── app.ts                  # Express app setup & middleware
├── server.ts               # Server entry point
├── config/                 # Environment configuration
├── errors/                 # Global error handler
├── lib/                    # Prisma client instance
├── middlewares/             # Auth & not-found middleware
├── types/                  # TypeScript type definitions
├── utils/                  # Helpers (catchAsync, sendResponse, jwt)
└── modules/
    ├── auth/               # Register, login, profile
    ├── admin/              # User & system management
    ├── category/           # Property categories
    ├── payments/           # Stripe payment integration
    ├── properties/         # Property CRUD
    ├── rentalRequest/      # Rental request workflow
    └── review/             # Property reviews

prisma/
└── schema/                 # Multi-file Prisma schema
    ├── schema.prisma       # Generator & datasource
    ├── user.prisma
    ├── property.prisma
    ├── rentalRequest.prisma
    ├── payment.prisma
    ├── review.prisma
    ├── category.prisma
    └── enum.prisma
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** database
- **Stripe** account ([dashboard.stripe.com](https://dashboard.stripe.com))
- **Stripe CLI** (for local webhook testing) — [Install guide](https://docs.stripe.com/stripe-cli)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mjh-shikder/A04-Level-2.git
   cd rentnest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your values in `.env`:

   | Variable | Description |
   |----------|-------------|
   | `DATABASE_URL` | PostgreSQL connection string |
   | `PORT` | Server port (default: 5000) |
   | `JWT_SECRET` | Secret key for JWT signing |
   | `JWT_EXPIRES_IN` | Token expiration (e.g., `10d`) |
   | `BCRYPT_SALT_ROUNDS` | Password hashing rounds |
   | `BACKEND_BASE_URL` | Backend URL (e.g., `http://localhost:5000`) |
   | `APP_URL` | Frontend URL (e.g., `http://localhost:3000`) |
   | `STRIPE_SECRET_KEY` | Stripe API secret key |
   | `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

4. **Generate Prisma client & run migrations**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Server runs at `http://localhost:5000`

---

## 💳 Stripe Setup

### Local Development

1. Start the Stripe webhook listener:

   ```bash
   npm run stripe:webhook
   ```

2. Copy the `whsec_...` signing secret from the output into your `.env` file as `STRIPE_WEBHOOK_SECRET`

3. Restart your dev server

### Test Cards

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Successful payment |
| `4000 0000 0000 0002` | ❌ Declined |
| `4000 0000 0000 3220` | 🔐 3D Secure required |

Use any future expiry date and any 3-digit CVC.

---

## 📡 API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login and get token |
| GET | `/api/auth/me` | Any | Get current user profile |

### Properties (`/api`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/landlord/properties` | Landlord | Create a property |
| PUT | `/api/landlord/properties/:id` | Landlord | Update a property |
| DELETE | `/api/landlord/properties/:id` | Landlord | Delete a property |
| GET | `/api/landlord/properties` | Landlord | Get landlord's properties |
| GET | `/api/all/properties` | — | Get all properties (public) |
| GET | `/api/properties/:id` | — | Get property details (public) |

### Rental Requests (`/api/rental`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/rental/create-request` | Tenant | Create a rental request |
| GET | `/api/rental/tenants-requests` | Tenant | Get tenant's requests |
| GET | `/api/rental/tenants-requests/:id` | Tenant | Get request details |
| GET | `/api/rental/landlord/requests` | Landlord | Get landlord's requests |
| PATCH | `/api/rental/landlord/requests/:id` | Landlord | Approve/reject request |

### Payments (`/api/payment`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payment/create` | Tenant | Create Stripe checkout session |
| POST | `/api/payment/confirm` | — | Stripe webhook (automated) |
| GET | `/api/payment` | Any | Get payment history |
| GET | `/api/payment/:id` | Any | Get payment details |

### Categories (`/api/category`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/category/all` | — | Get all categories |

### Reviews (`/api/review`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/review/create` | Tenant | Create a review |

### Admin (`/api/admin`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/all-users` | Admin | Get all users |
| GET | `/api/admin/all-properties` | Admin | Get all properties |
| GET | `/api/admin/all-rentals` | Admin | Get all rental requests |
| PATCH | `/api/admin/users/:id` | Admin | Block/unblock user |

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start dev server with hot reload |
| `build` | `npm run build` | Compile TypeScript |
| `start` | `npm start` | Run production build |
| `stripe:webhook` | `npm run stripe:webhook` | Start Stripe webhook listener |

---

## 🔒 Error Handling

The API uses a centralized global error handler that provides consistent error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Descriptive error message"
}
```

Handled error types:
- **Prisma errors** — Validation, duplicate entries, foreign key constraints, record not found
- **JWT errors** — Invalid token, expired token
- **Application errors** — Custom `AppError` with specific status codes
- **404 Not Found** — Unmatched routes

---

## 📄 License

ISC
