

I have updated the project's [README.md](file:///Users/ssjoy/micro-service/eventflow-manage/README.md) with comprehensive Docker installation instructions, environment setup, architecture mapping, and a full Docker CLI command reference.

---

### 🐳 EventFlow Manage — Docker Setup & Commands Guide

#### 1. System Architecture Overview

The project uses a **multi-stage Dockerfile** combined with **Docker Compose** to run 6 NestJS microservices alongside 6 infrastructure services:

| Component | Container Name | Port(s) | Description |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `eventflowapp-api-gateway` | `3000` | HTTP Gateway & Routing |
| **Auth Service** | `eventflowapp-auth-service` | `3001` | Authentication & JWT |
| **Events Service** | `eventflowapp-events-service` | `3002` | Event Catalog & Management |
| **Ticket Service** | `eventflowapp-ticket-service` | `3003` | Booking & Inventory |
| **Payment Service** | `eventflowapp-payment-service` | `3004` | Transaction Processing |
| **Notification Service** | `eventflowapp-notification-service` | `3005` | Email & Notifications |
| **PostgreSQL** | `eventflowapp-postgres` | `5432` | Primary Database |
| **Kafka Broker** | `eventflowapp-kafka` | `9092, 9093, 29092` | Event Streaming Broker |
| **Zookeeper** | `eventflowapp-zookeeper` | `2181` | Kafka Cluster Manager |
| **Kafka UI** | `eventflowapp-kafka-ui` | `8080` | Web UI Dashboard |
| **Redis** | `eventflowapp-redis` | `6379` | Cache & Session Store |
| **Mailhog** | `eventflowapp-mailhog` | `1025` (SMTP), `8025` (Web) | Mock Email Server |

---

### ⚡ Docker Setup & Quick Start

1. **Verify Prerequisites**:
   ```bash
   docker --version
   docker compose version
   ```

2. **Start All Services in Docker**:
   ```bash
   docker compose up -d --build
   ```

3. **Check Container Health**:
   ```bash
   docker compose ps
   ```

4. **Hybrid Mode (Run Infrastructure only in Docker, code locally with `pnpm`)**:
   ```bash
   # 1. Start DB, Kafka, Redis, Mailhog, Kafka UI
   docker compose up -d postgres kafka zookeeper redis mailhog kafka-ui

   # 2. Run NestJS services locally
   pnpm start:dev api-gateway
   ```

---

### 🛠️ Essential Docker Commands Reference

#### 🚀 Lifecycle Management
```bash
# Start all containers in the background
docker compose up -d

# Rebuild microservice images and start all containers
docker compose up -d --build

# Stop and remove containers & networks
docker compose down

# Stop containers and wipe ALL volume data (PostgreSQL/Kafka/Redis)
docker compose down -v

# Restart a specific service (e.g., api-gateway)
docker compose restart api-gateway
```

#### 🔍 Monitoring & Logs
```bash
# Follow logs for all services
docker compose logs -f

# Follow logs for a specific service
docker compose logs -f auth-service

# View container status and ports
docker compose ps

# View live CPU & memory usage stats
docker stats
```

#### 💻 Shell & Database Access inside Containers
```bash
# Open shell inside a container
docker compose exec api-gateway sh

# Access PostgreSQL CLI
docker compose exec postgres psql -U eventflowapp -d eventflowapp

# Access Redis CLI
docker compose exec redis redis-cli
```

#### 🏗️ Manual Image Build
```bash
# Build a single service image using the multi-stage Dockerfile
docker build --build-arg SERVICE=auth-service -t eventflow/auth-service:latest .
```