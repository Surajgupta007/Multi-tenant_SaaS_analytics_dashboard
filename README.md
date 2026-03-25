# Multi-Tenant SaaS Analytics Dashboard

A production-grade, multi-tenant SaaS application built with **Next.js 14**, providing isolated workspaces, role-based access control, analytics data visualization, and Stripe subscription management.

![Dashboard Preview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000&ixlib=rb-4.0.3)
*(Replace the image above with a real screenshot of your landing page/dashboard once deployed)*

## ✨ Features

* **Multi-Tenancy & Workspaces:** Users can create organizations, invite members, and switch seamlessly between different isolated workspaces.
* **Role-Based Access Control (RBAC):** Built-in roles (`owner`, `admin`, `member`) controlling access to settings, billing, and invites.
* **Subscription Management:** Full Stripe integration with webhooks to handle `free`, `pro`, and `enterprise` limits.
* **Beautiful UI:** Polished interface utilizing **Tailwind CSS**, **shadcn/ui**, and custom floating glassmorphism designs.
* **Analytics Visualizations:** Interactive charts and data tables powered by **Recharts**.
* **Edge Caching:** Sub-millisecond tenant resolution using **Upstash Redis**.
* **JWT Authentication:** Custom secure email/password registration with **bcrypt**.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **Components:** shadcn/ui & Radix Primitives
- **Database:** MongoDB (via Mongoose + lean queries)
- **Caching:** Upstash Redis
- **Authentication:** Auth.js (NextAuth) with Credentials Provider
- **Payments:** Stripe
- **Charts:** Recharts

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js and **pnpm** installed.

### 1. Clone the repository
```bash
git clone https://github.com/Surajgupta007/Multi-tenant_SaaS_analytics_dashboard.git
cd saas-dashboard
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and populate it with your credentials:

```env
# MongoDB Database
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0...mongodb.net/saas-dashboard"

# Authentication
AUTH_SECRET="generate_a_random_32_character_string"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://your-database.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token_here"

# Stripe 
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_FREE_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."
```

### 4. Run the development server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can register a new account on `/register`.

## 📂 Project Structure
* `src/app/(auth)/` - Login and registration flows.
* `src/app/(dashboard)/[orgSlug]/` - The core tenant dashboard routing and boundaries.
* `src/app/api/` - Backend secure endpoints.
* `src/components/` - Global layout components, charts, and shadcn/ui primitives.
* `src/lib/` - Configurations for auth, db models, redis, and stripe.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
