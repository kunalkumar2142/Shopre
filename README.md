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

- **Microservices Architecture** — Built with Spring Cloud Gateway and Eureka Service Registry, orchestrating 5 Dockerized services.
- **Centralized Routing & Load Balancing** — All traffic flows through a single API Gateway using client-side load balancing (`lb://`) over service discovery.
- **RESTful APIs** — 10+ REST endpoints across the Product, Cart, and Authentication modules.
- **Service-to-Service Communication** — OpenFeign clients resolve services by name through Eureka.
- **Security** — JWT-based authentication with Spring Security and Role-Based Access Control (RBAC), with token validation centralized at the gateway and a verified user identity propagated to downstream services.
- **React + TypeScript Frontend** — ShadCN UI with reusable components, protected routes, and JWT-based session handling.

---

## 🛠️ Tech Stack

| Layer      | Technologies                                                                  |
|------------|-------------------------------------------------------------------------------|
| **Backend**   | Java, Spring Boot, Spring Cloud (Gateway, Eureka), Spring Security, OpenFeign |
| **Frontend**  | React, TypeScript, ShadCN UI                                               |
| **Database**  | PostgreSQL (database-per-service)                                          |
| **DevOps**    | Docker, Docker Compose, Eureka Service Registry                            |

---

## 🏗️ Architecture

Shopre follows a decoupled microservices architecture where each domain service is independently deployable and registers with Eureka for discovery. External traffic is routed through a single API Gateway, which handles centralized routing, load balancing, JWT validation, and request filtering.


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
   │    (JWT + RBAC)    │   │    (Catalog)     │   │(Cart; orders planned) │
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

- **Service Discovery** — Eureka handles dynamic service lookup, removing the need for hardcoded service URLs.
- **API Gateway** — Spring Cloud Gateway centralizes routing, JWT validation, and request filtering, acting as the single entry point for the frontend.
- **Domain Services** — Independently deployable Product Catalog, Cart, and User Authentication (JWT + RBAC) services, each with its own PostgreSQL database.
- **Orchestration** — `docker-compose.yml` spins up the full backend stack (services + databases) for local development with a single command.

---

## 📂 Project Structure

```text
/ (Root)
├── backend/                          # Backend microservices root
│   ├── order-and-cart-management/    # Shopping cart (orders planned)
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
- Java 17+ and Maven (Docker images build on Java 21)
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

```
1. service-discovery         (Eureka Server, :8761)
2. shopre-api-gateway        (API Gateway, :8081)
3. user-authentication       (Auth + JWT/RBAC, :8083)
4. product                   (Product Catalog, :8082)
5. order-and-cart-management (Cart, :8084)
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

> The features below are **planned enhancements** and are not part of the current implementation.

- [ ] **Order & Checkout Module** — Implement order placement, checkout, and transaction handling in the order-and-cart service.
- [ ] **Automated Testing** — Add unit/integration tests (JUnit, Mockito) and contract tests across services.
- [ ] **Centralized Config Server** — Spring Cloud Config for environment-specific configuration.
- [ ] **Distributed Tracing** — Zipkin / Micrometer Tracing across services.
- [ ] **CI/CD Pipeline** — Automate build/test/deploy with GitHub Actions.
- [ ] **Redis Caching Layer** — Cache product catalog reads to reduce DB load.
