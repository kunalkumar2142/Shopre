# Shopre Backend

Spring Boot / Spring Cloud backend for Shopre. The stack contains five services and three PostgreSQL databases, orchestrated with Docker Compose.

## Services

| Module                        | Container                          | Port | Database            | Purpose                                |
|-------------------------------|------------------------------------|------|---------------------|----------------------------------------|
| `service-discovery`           | `shopre-service-discovery`         | 8761 | —                   | Eureka service registry                |
| `shopre-api-gateway`          | `shopre-api-gateway`               | 8081 | —                   | Public entry point, routing, JWT, CORS |
| `product`                     | `shopre-product-service`           | 8082 | `shopre-product-db` | Product catalog and inventory          |
| `user-authentication`         | `shopre-user-authentication-service` | 8083 | `shopre-users-db`   | Signup, login, JWT, RBAC               |
| `order-and-cart-management`   | `shopre-order-cart-service`        | 8084 | `shopre-cart-db`    | Cart and orders                        |

In the default compose file only the gateway (`8081`) is published. The other ports are available through the dev compose file.

## Prerequisites

- Docker & Docker Compose v2
- Java 17+ and the Maven wrapper (Docker images build on JDK 21)

## Environment

The compose files read `backend/.env`. If the file does not exist yet, create it from the example:

```bash
cp .env.example .env
```

| Variable       | Required | Description                                                      |
|----------------|----------|------------------------------------------------------------------|
| `DB_USERNAME`  | No       | PostgreSQL user (default `postgres`)                             |
| `DB_PASSWORD`  | Yes      | PostgreSQL password shared by all three databases                |
| `JWT_SECRET`   | Yes      | Base64-encoded 512-bit secret shared by auth service and gateway |
| `FRONTEND_URL` | No       | CORS origin allowed by the gateway (default `http://localhost:5173`) |

Generate a secret with `openssl rand -base64 64`. The same value must be used by `user-authentication` and `shopre-api-gateway`.

## Run the full stack

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f
```

Stop the stack:

```bash
docker compose down          # keep database data
docker compose down -v       # also delete database volumes
```

### Dev / debug compose

`docker-compose-amd64.yml` exposes every service and database port and builds for `linux/amd64`:

```bash
docker compose -f docker-compose-amd64.yml up --build
```

| Endpoint            | Address                  |
|---------------------|--------------------------|
| Eureka dashboard    | `http://localhost:8761`  |
| API gateway         | `http://localhost:8081`  |
| Product service     | `http://localhost:8082`  |
| User auth service   | `http://localhost:8083`  |
| Order/cart service  | `http://localhost:8084`  |
| Product database    | `localhost:5440`         |
| Users database      | `localhost:5441`         |
| Cart database       | `localhost:5442`         |

## Build and publish images

Each service builds from its own module directory. Example for the user-authentication service:

```bash
docker buildx build --platform linux/amd64 \
  -t kunal2142/shopre-user-authentication-service \
  ./user-authentication

docker push kunal2142/shopre-user-authentication-service
```

Image names used by the compose files:

| Module                      | Image                                                  |
|-----------------------------|--------------------------------------------------------|
| `service-discovery`         | `kunal2142/service-discovery`                          |
| `shopre-api-gateway`        | `kunal2142/shopre-api-gateway`                         |
| `product`                   | `kunal2142/shopre-product-service`                     |
| `user-authentication`       | `kunal2142/shopre-user-authentication-service`         |
| `order-and-cart-management` | `kunal2142/shopre-order-and-cart-management-service`   |

## API summary

All browser traffic goes through the gateway at `http://localhost:8081`.

| Method | Path                           | Auth | Description                     |
|--------|--------------------------------|------|---------------------------------|
| POST   | `/api/v1/auth/signup`          | No   | Register and return a token     |
| POST   | `/api/v1/auth/login`           | No   | Log in and return a token       |
| POST   | `/api/v1/users`                | Yes  | Create a user (admin only)      |
| GET    | `/api/v1/users/me`             | Yes  | Current user profile            |
| GET    | `/api/v1/users/{email}`        | Yes  | Look up your own user by email  |
| GET    | `/api/v1/products`             | No   | List products                   |
| GET    | `/api/v1/products/{id}`        | No   | Product by ID                   |
| GET    | `/api/v1/products/slug/{slug}` | No   | Product by slug                 |
| POST   | `/api/v1/products/bulk`        | No*  | Fetch products by ID list       |
| POST   | `/api/v1/admin/products`       | Yes  | Create a product                |
| POST   | `/api/v1/cart`                 | Yes  | Add an item to the cart         |
| GET    | `/api/v1/cart`                 | Yes  | Get the current user's cart     |
| POST   | `/api/v1/orders`               | Yes  | Place an order                  |
| GET    | `/api/v1/orders`               | Yes  | List the current user's orders  |
| GET    | `/api/v1/orders/{id}`          | Yes  | Get one order                   |

\* `/api/v1/products/**` is publicly routed by the gateway; `/bulk` is intended for internal Feign calls.

Protected routes require `Authorization: Bearer <token>`. The gateway validates the token and forwards the user ID as `X-USER-ID`; downstream services do not trust client-supplied IDs.

## Local module builds

Each module contains a Maven wrapper:

```bash
./mvnw -DskipTests package
./mvnw test
```

Running a module directly requires its PostgreSQL database and Eureka to be reachable, so Docker Compose is the recommended local workflow.

## Notes

- Auth endpoints should return response DTOs rather than serializing the `User` entity directly.
- The cart supports add and read only; update/remove/clear are not implemented.
- Orders are created with status `PENDING`; no status transition endpoints exist yet.
