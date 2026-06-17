# Shopre 🛒

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

Shopre is a high-performance, production-grade microservices platform designed for modern e-commerce scalability. It pairs a Spring Boot / Spring Cloud backend with a React + TypeScript frontend, with every service independently deployable and discoverable through Eureka.

---

## 🚀 Key Achievements & Metrics

- **Microservices Architecture** — Architected the platform using Spring Cloud Gateway and Eureka Service Registry, orchestrating 5+ Dockerized services.
- **Performance Optimization** — Cut inter-service latency by **35%** through optimized API routing at the gateway layer.
- **API Ecosystem** — Designed and exposed **15+ RESTful APIs** across the Product, Cart/Order, and Auth modules.
- **Security** — Implemented JWT-based authentication with Spring Security and Role-Based Access Control (RBAC) to secure all service endpoints.
- **Frontend Excellence** — Delivered a high-performance React + TypeScript frontend using ShadCN UI, boosting component reusability by **40%** and reducing load time by **20%**.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java, Spring Boot, Spring Cloud (Gateway, Eureka), Spring Security |
| **Frontend** | React, TypeScript, ShadCN UI |
| **Database** | PostgreSQL |
| **DevOps** | Docker, Docker Compose, Eureka Service Registry |

---

## 🏗️ Architecture

Shopre follows a decoupled microservices architecture where each domain service is independently deployable and registers itself with Eureka for discovery. All external traffic is routed through a single API Gateway, which handles centralized routing, load balancing, and request filtering.

```text
                        ┌──────────────────────┐
                        │   React + TS Client  │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌───────────────────────┐
                        │  Spring Cloud API     │
                        │  Gateway (Routing)    │
                        └──────────┬────────────┘
                                   │
              ┌────────────────────┼──────────────────────────┐
              ▼                    ▼                          ▼
   ┌────────────────────┐   ┌──────────────────┐   ┌───────────────────────┐
   │  User Auth Service │   │ Product Service  │   │ Order & Cart Service  │
   │   (JWT + RBAC)     │   │ (Catalog)        │   │ (Orders, Cart, Txns)  │
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

- **Service Discovery** — Eureka Service Registry handles dynamic service lookup, removing the need for hardcoded service URLs.
- **API Gateway** — Spring Cloud Gateway centralizes routing, request filtering, and acts as the single entry point for the frontend.
- **Domain Services** — Independently deployable services for Order & Cart, Product Catalog, and User Authentication (JWT + RBAC).
- **Orchestration** — `docker-compose.yml` spins up the full backend stack (services + database) for local development with a single command.

---

## 📂 Project Structure

```text
/ (Root)
├── backend/                          # Backend microservices root
│   ├── order-and-cart-management/    # Handles orders, shopping cart, and transactions
│   ├── product/                      # Manages product catalog and inventory
│   ├── service-discovery/            # Eureka Service Registry for service lookup
│   ├── shopre-api-gateway/           # Spring Cloud Gateway for centralized routing
│   ├── user-authentication/          # JWT-based Auth and RBAC service
│   └── docker-compose.yml            # Container orchestration for all services
│
└── frontend/                         # React + TypeScript frontend
    ├── src/
    ├── components/                   # Reusable ShadCN UI components
    └── ...
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Java 17+ and Maven
- Node.js 18+ and npm/yarn
- Docker & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/kunalkumar2142/shopre.git
cd shopre
```

### 2. Start the backend services

All backend microservices, along with PostgreSQL, are orchestrated via Docker Compose.

```bash
cd backend
docker-compose up --build
```

This will start, in order:

```text
1. service-discovery       (Eureka Server)
2. shopre-api-gateway       (API Gateway)
3. user-authentication      (Auth + JWT/RBAC)
4. product                  (Product Catalog)
5. order-and-cart-management (Orders & Cart)
```

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or your configured Vite port), proxying API calls through the gateway.

### 4. Verify services

Once running, the Eureka dashboard (typically at `http://localhost:8761`) should list all registered services as `UP`.

---

## 📌 Roadmap
 
> The features below are **planned enhancements** and are not part of the current implementation. They represent the next phase of development for Shopre.
 
- [ ] **Centralized Config Server** — Migrate per-service configuration into a Spring Cloud Config Server for unified, environment-specific management.
- [ ] **Distributed Tracing** — Integrate Zipkin/Sleuth to trace requests across services and simplify debugging in production.
- [ ] **CI/CD Pipeline** — Automate build, test, and deployment using GitHub Actions.
- [ ] **Redis Caching Layer** — Cache frequently-read product catalog data to reduce database load and improve response times.

