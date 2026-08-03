<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 🚀 EventFlow Manage - Microservices Platform

**EventFlow Manage** is an enterprise-grade NestJS microservices platform for event management, ticket booking, payment processing, and notification handling, powered by **PostgreSQL**, **Kafka**, **Redis**, and **Docker**.

---

## 🏗️ System Architecture & Services

The platform consists of **6 NestJS Microservices** and **6 Infrastructure Services**:

### 🧩 Microservices
| Microservice | Container Name | Default Port | Description |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `eventflowapp-api-gateway` | `3000` | Main entry point, HTTP routing & proxying |
| **Auth Service** | `eventflowapp-auth-service` | `3001` | User registration, login, JWT validation |
| **Events Service** | `eventflowapp-events-service` | `3002` | Event creation, management & catalog |
| **Ticket Service** | `eventflowapp-ticket-service` | `3003` | Ticket inventory, reservation & booking |
| **Payment Service** | `eventflowapp-payment-service` | `3004` | Transaction processing & payment gateways |
| **Notification Service**| `eventflowapp-notification-service` | `3005` | Email & event notifications (via Mailhog) |

### 🛠️ Infrastructure Services
| Service | Image | Ports | Description |
| :--- | :--- | :--- | :--- |
| **PostgreSQL** | `postgres:16-alpine` | `5432` | Primary database |
| **Kafka Broker** | `confluentinc/cp-kafka:7.5.0` | `9092`, `9093`, `29092` | Event messaging queue |
| **Zookeeper** | `confluentinc/cp-zookeeper:7.5.0` | `2181` | Kafka cluster management |
| **Kafka UI** | `provectuslabs/kafka-ui:latest` | `8080` | Web dashboard for Kafka topics & messages |
| **Redis** | `redis:7-alpine` | `6379` | In-memory cache & session storage |
| **Mailhog** | `mailhog/mailhog:latest` | `1025` (SMTP), `8025` (Web UI) | Local SMTP server & email testing web UI |

---

## 📦 Docker Prerequisites & Installation

### 1. Prerequisites
Ensure Docker is installed on your system:
- **macOS / Windows**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux**: Install [Docker Engine](https://docs.docker.com/engine/install/) & `docker-compose-plugin`

### 2. Verify Installation
```bash
docker --version
docker compose version
```

---

## ⚡ Quick Start with Docker

### Step 1: Clone & Configure Environment
Ensure your `.env` file exists in the root directory:
```bash
cp .env.example .env   # Or ensure your existing .env has valid DB/Kafka configs
```

### Step 2: Start All Services via Docker Compose
Build and run all microservices and infrastructure containers in detached mode:
```bash
docker compose up -d --build
```

### Step 3: Check Running Containers
Verify that all containers are healthy and running:
```bash
docker compose ps
```

### Step 4: Access Application & Web Dashboards
- **API Gateway**: `http://localhost:3000`
- **Kafka UI**: `http://localhost:8080`
- **Mailhog Web UI**: `http://localhost:8025`

---

## 💡 Hybrid Development Mode (Infrastructure Only in Docker)

If you prefer running microservices locally using `pnpm` while running PostgreSQL, Kafka, and Redis in Docker:

1. **Start only the infrastructure containers:**
   ```bash
   docker compose up -d postgres kafka zookeeper redis mailhog kafka-ui
   ```

2. **Run microservices locally:**
   ```bash
   pnpm install
   pnpm start:dev api-gateway
   pnpm start:dev auth-service
   pnpm start:dev events-service
   ```

---

## 📖 Complete Docker Commands Reference

### 🚀 Container Lifecycle
| Command | Description |
| :--- | :--- |
| `docker compose up -d` | Start all services in background |
| `docker compose up -d --build` | Rebuild images and start all services |
| `docker compose down` | Stop and remove all containers and networks |
| `docker compose down -v` | Stop containers and **purge all volume data** (Postgres, Kafka, Redis) |
| `docker compose restart` | Restart all containers |
| `docker compose restart <service>` | Restart a specific service (e.g. `docker compose restart api-gateway`) |
| `docker compose stop` | Stop containers without removing them |
| `docker compose start` | Start previously stopped containers |

### 🔍 Logs & Monitoring
| Command | Description |
| :--- | :--- |
| `docker compose logs -f` | Stream live logs for all running services |
| `docker compose logs -f <service>` | Stream live logs for a specific service (e.g. `docker compose logs -f auth-service`) |
| `docker compose ps` | List all project containers and their status |
| `docker stats` | Live CPU, memory, and network stats for active containers |

### 🛠️ Maintenance & Execution
| Command | Description |
| :--- | :--- |
| `docker compose exec <service> sh` | Open a shell inside a container (e.g. `docker compose exec api-gateway sh`) |
| `docker compose exec postgres psql -U eventflowapp -d eventflowapp` | Connect to PostgreSQL CLI inside container |
| `docker compose exec redis redis-cli` | Connect to Redis CLI inside container |
| `docker compose build --no-cache <service>` | Force a clean rebuild of a single microservice image |

### 🧹 Cleanup Commands
| Command | Description |
| :--- | :--- |
| `docker system prune -f` | Remove unused/dangling containers, networks, and images |
| `docker system prune -a --volumes -f` | Wipe **all** cached images, stopped containers, and unused volumes |

---

## ⚙️ Dockerfile Multi-Stage Architecture

The project uses a multi-stage Docker build (`Dockerfile`) to optimize build size and caching across microservices:

1. **`deps` stage**: Installs node modules with `pnpm install --frozen-lockfile`.
2. **`builder` stage**: Compiles the specific NestJS app specified via `--build-arg SERVICE=<app-name>`.
3. **`runner` stage**: Lightweight production image running `node dist/apps/${SERVICE}/main.js`.

### Build a Single Image Manually:
```bash
docker build --build-arg SERVICE=auth-service -t eventflow/auth-service:latest .
```
``` bash
docker compose restart zookeeper kafka

```
---

## 📄 License
This project is proprietary and confidential. All rights reserved.

