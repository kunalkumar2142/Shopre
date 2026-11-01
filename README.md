# Shopre 🛒

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

Shopre is a microservices e-commerce platform with a Spring Boot / Spring Cloud backend and a React + TypeScript frontend. Services are independently deployable and discoverable through Eureka, and the frontend covers the full catalog-to-checkout flow.

---

## 🚀 Key Achievements

- **Microservices architecture** — 5 Spring Boot services backed by 3 PostgreSQL databases, all orchestrated with Docker Compose.
- **Centralized routing** — Spring Cloud Gateway provides a single entry point with client-side load balancing (`lb://`) over Eureka.
- **RESTful APIs** — 15 endpoints across authentication, users, products, cart, and orders.
- **Service-to-service communication** — OpenFeign resolves services by name through Eureka.
- **Security** — JWT authentication with Spring Security and RBAC. Tokens are validated at the gateway and the verified user ID is propagated to downstream services via `X-USER-ID`.
- **Frontend** — React + TypeScript + Tailwind + ShadCN UI with product catalog, search/filters, product details, cart, checkout, order history, and protected routes.

---

## 🛠️ Tech Stack

| Layer          | Technologies                                                                 |
|----------------|------------------------------------------------------------------------------|
| **Backend**    | Java 17, Spring Boot, Spring Cloud (Gateway, Eureka), Spring Security, OpenFeign |
| **Frontend**   | React 19, TypeScript, Vite, Tailwind CSS, ShadCN UI, React Router, Axios     |
| **Database**   | PostgreSQL 16 (database-per-service)                                          |
| **DevOps**     | Docker, Docker Compose, Eureka Service Registry                               |

---

## 🏗️ Architecture

External traffic enters through the API Gateway, which handles routing, JWT validation, and request filtering. The gateway resolves services through Eureka, and each domain service owns its PostgreSQL database.

```
                        ┌──────────────────────┐
                        │   React + TS Client  │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌───────────────────────┐
                        │  Spring Cloud API     │
                        │  Gateway (Routing +   │
                        │  JWT / RBAC filters)  │
                        └──────────┬────────────┘
                                   │
              ┌────────────────────┼──────────────────────────┐
              ▼                    ▼                          ▼
   ┌────────────────────┐   ┌──────────────────┐   ┌───────────────────────┐
   │  User Auth Service │   │ Product Service  │   │ Order & Cart Service  │
   │    (JWT + RBAC)    │   │    (Catalog)     │   │   (Cart + Orders)     │
   └──────────┬─────────┘   └──────────┬───────┘   └───────────┬───────────┘
              │                        │                       │
              └─────────────────────┬──┴───────────────────────┘
                                    ▼
                       ┌──────────────────────────┐
                       │  Eureka Service Registry │
                       └──────────────────────────┘
                                    │
                                    ▼
                       ┌──────────────────────────┐
                       │     PostgreSQL DB(s)     │
                       └──────────────────────────┘
```

**Core components:**

- **Service Discovery** — Eureka handles dynamic service lookup, removing hardcoded service URLs.
- **API Gateway** — Single entry point for the frontend. Public routes are `/api/v1/auth/**` and `/api/v1/products/**`; all other routes require a Bearer token.
- **Domain Services** — Product catalog, user authentication (JWT + RBAC), and order/cart management.
- **Orchestration** — `backend/docker-compose.yml` starts the full stack (5 services + 3 databases) with one command.

---

## 📂 Project Structure

```text
/ (Root)
├── backend/                          # Backend microservices root
│   ├── order-and-cart-management/    # Cart and orders (port 8084)
│   ├── product/                      # Product catalog and inventory (port 8082)
│   ├── service-discovery/            # Eureka service registry (port 8761)
│   ├── shopre-api-gateway/           # API gateway (port 8081, public entry point)
│   ├── user-authentication/          # JWT auth and RBAC (port 8083)
│   ├── docker-compose.yml            # Production-style compose (only 8081 exposed)
│   ├── docker-compose-amd64.yml      # Dev/debug compose (all ports exposed)
│   ├── .env.example                  # Required environment variables
│   └── README.md                     # Backend-specific instructions
│
└── frontend/                         # React + TypeScript frontend
    ├── src/
    │   ├── apis/                     # Axios client and API functions
    │   ├── components/               # UI, product, order, and auth components
    │   ├── context/                  # Auth and cart providers
    │   ├── hooks/                    # Product filtering helpers
    │   ├── pages/                    # Route pages
    │   └── types/                    # Shared API types
    └── README.md                     # Frontend-specific instructions
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Docker & Docker Compose v2
- Java 17+ and the Maven wrapper (Docker images build on JDK 21)
- Node.js 20.19+ (or 22.12+) and npm (only needed for local frontend runs)

### 1. Clone the repository

```bash
git clone https://github.com/kunalkumar2142/Shopre.git
cd Shopre
```

### 2. Configure the backend environment

```bash
cd backend
# If .env does not exist yet:
cp .env.example .env
```

> On Windows PowerShell, use `Copy-Item .env.example .env`.

Set the following values in `backend/.env`:

| Variable       | Required | Description                                                        |
|----------------|----------|--------------------------------------------------------------------|
| `DB_USERNAME`  | No       | PostgreSQL user (default `postgres`)                               |
| `DB_PASSWORD`  | Yes      | PostgreSQL password, shared by the three databases                 |
| `JWT_SECRET`   | Yes      | Base64-encoded 512-bit secret shared by auth service and gateway   |
| `FRONTEND_URL` | No       | CORS origin allowed by the gateway (default `http://localhost:5173`) |

Generate a suitable secret with:

```bash
openssl rand -base64 64
```

### 3. Start the backend

```bash
docker compose up --build -d
docker compose ps
```

This starts:

| Service                      | Port     | Database            |
|------------------------------|----------|---------------------|
| `service-discovery` (Eureka) | 8761     | —                   |
| `shopre-api-gateway`         | **8081** | —                   |
| `product`                    | 8082     | `shopre-product-db` |
| `user-authentication`        | 8083     | `shopre-users-db`   |
| `order-and-cart-management`  | 8084     | `shopre-cart-db`    |

Only the gateway (`8081`) is published in the default compose file. All other services communicate over the internal Docker network.

Useful commands:

```bash
docker compose logs -f              # follow logs
docker compose down                 # stop containers
docker compose down -v              # stop and delete database volumes
```

### 4. Run the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The app is available at `http://localhost:5173` and calls the gateway at `http://localhost:8081` by default.

To point the frontend at a different gateway:

```bash
# frontend/.env
VITE_API_URL=http://localhost:8081
```

The Vite origin must match the gateway's `FRONTEND_URL` CORS setting. If Vite starts on a different port, update `FRONTEND_URL` in `backend/.env` to match (or run `npm run dev -- --port 5173` when that port is free).

### 5. Verify

```bash
curl http://localhost:8081/api/v1/products
```

For the Eureka dashboard and direct service/database access, use the dev compose file:

```bash
cd backend
docker compose -f docker-compose-amd64.yml up --build
```

It exposes Eureka at `http://localhost:8761`, services on `8082`/`8083`/`8084`, and databases on `5440`/`5441`/`5442`.

---

## 🔌 API Overview

All browser requests should go through the gateway at `http://localhost:8081`.

| Method | Path                              | Auth | Description                        |
|--------|-----------------------------------|------|------------------------------------|
| POST   | `/api/v1/auth/signup`             | No   | Register a user and return a token |
| POST   | `/api/v1/auth/login`              | No   | Log in and return a token          |
| POST   | `/api/v1/users`                   | Yes  | Create a user (admin only)         |
| GET    | `/api/v1/users/me`                | Yes  | Current user profile               |
| GET    | `/api/v1/users/{email}`           | Yes  | Look up your own user by email     |
| GET    | `/api/v1/products`                | No   | List products                      |
| GET    | `/api/v1/products/{id}`           | No   | Product by ID                      |
| GET    | `/api/v1/products/slug/{slug}`    | No   | Product by slug                    |
| POST   | `/api/v1/products/bulk`           | No*  | Fetch products by ID list (Feign)  |
| POST   | `/api/v1/admin/products`          | Yes  | Create a product                   |
| POST   | `/api/v1/cart`                    | Yes  | Add an item to the cart            |
| GET    | `/api/v1/cart`                    | Yes  | Get the current user's cart        |
| POST   | `/api/v1/orders`                  | Yes  | Place an order from the cart       |
| GET    | `/api/v1/orders`                  | Yes  | List the current user's orders     |
| GET    | `/api/v1/orders/{id}`             | Yes  | Get one order                      |

\* The gateway routes all of `/api/v1/products/**` publicly; `/bulk` is intended for internal Feign calls between services.

Order statuses: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

---

## ⚠️ Known Limitations

- Cart item **update/remove/clear** are handled only in the frontend; the backend currently exposes add and read endpoints only.
- Product **categories** are derived from the `brand` field because the product model has no category field.
- Orders are created with status `PENDING`; there are no endpoints for status transitions or cancellation yet.

---

## 📌 Roadmap

- [ ] Order lifecycle management (status transitions and cancellation)
- [ ] Cart update/remove/clear APIs
- [ ] Product categories and richer inventory fields
- [ ] User response DTOs (never serialize password hashes)
- [ ] Automated testing (JUnit, Mockito, contract tests)
- [ ] Centralized Config Server
- [ ] Distributed tracing (Zipkin / Micrometer)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Redis caching for product catalog reads
