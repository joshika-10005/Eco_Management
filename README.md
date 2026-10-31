# 🌿 EcoDrop — Smart E-Waste Management & Recycling System

> An enterprise full-stack platform for municipal and industrial electronic waste collection, doorstep logistics dispatching, hazardous material tracking, and zero-landfill recycling lifecycle management.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js (v19), Vite, Vanilla CSS Design System (Emerald Dark Glass), JavaScript |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Data MongoDB, REST APIs |
| **Database** | MongoDB Atlas (Cloud Database) |
| **DevOps** | Git & GitHub, Maven 3.9, Docker, Docker Compose, Kubernetes, Jenkins CI/CD |

---

## 📊 Database Collections & Schemas (MongoDB Atlas)

All MongoDB connection strings are passed via the `MONGODB_URI` environment variable. **Credentials are never hardcoded.**

### 1. `users`
* `id` (`String` / `_id`): Unique user identifier
* `fullName` (`String`): Citizen or administrator name
* `email` (`String`, unique index): User account email
* `password` (`String`): Password hash
* `role` (`String`): `CITIZEN`, `ADMIN`, or `RECYCLER`
* `phone` (`String`): Contact phone number
* `address` (`String`): Primary pickup address
* `ecoPoints` (`int`): Redeemable reward points ledger
* `createdAt` (`LocalDateTime`)

### 2. `ewaste_requests`
* `id` (`String` / `_id`): Collection request tracking code (e.g., `REQ-1001`)
* `userId` (`String`): Reference to requesting citizen
* `userName`, `userEmail`, `userPhone` (`String`)
* `deviceCategory` (`String`): E.g., *Smartphones & Tablets*, *Laptops & Computers*, *Lithium Batteries*, *Monitors & Displays*, *Home Appliances*
* `brandModel` (`String`): Device description
* `quantity` (`int`): Number of units
* `estimatedWeightKg` (`double`): Weight in kilograms
* `condition` (`String`): `Working`, `Damaged`, or `Dead / Scrap`
* `hazardLevel` (`String`): `Low`, `Medium`, or `High (Toxic/Battery)`
* `pickupAddress` (`String`): Address for collection
* `preferredDate` (`String`): Preferred pickup date
* `status` (`String`): `PENDING` ➔ `APPROVED` ➔ `SCHEDULED` ➔ `PICKED_UP` ➔ `RECYCLED` (or `REJECTED`)
* `rewardPoints` (`int`): Calculated eco-points awarded upon verified recycling
* `notes` (`String`): Special handling instructions
* `createdAt`, `updatedAt` (`LocalDateTime`)

### 3. `pickup_details`
* `id` (`String` / `_id`): Dispatch identifier (e.g., `PICK-501`)
* `requestId` (`String`): Associated collection request ID
* `userId`, `userName`, `userPhone`, `pickupAddress`
* `scheduledDate` (`String`), `timeSlot` (`String`): E.g., `Morning (09:00 - 12:00)`
* `agentName` (`String`), `agentPhone` (`String`): Assigned logistics personnel
* `vehicleNumber` (`String`): E.g., `EV-RECYCLE-42`
* `pickupStatus` (`String`): `SCHEDULED`, `IN_TRANSIT`, `COMPLETED`, `CANCELLED`
* `confirmationOtp` (`String`): 4-digit verification code for secure doorstep handoff
* `scheduledAt`, `completedAt` (`LocalDateTime`)

---

## 🚀 Getting Started

### Mode 1: Frontend First with LocalStorage (Offline Mode)
Per requirements, the React frontend is initially fully functional out-of-the-box using `localStorage` without requiring a live database:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at `http://localhost:5173/`.
3. Pre-loaded personas are ready for 1-click login:
   * **Citizen Donor:** `citizen@ecodrop.org` (Alex Rivera)
   * **Logistics Agent:** `recycler@ecodrop.org` (Marcus Reed)
   * **System Admin:** `admin@ecodrop.org` (Dr. Elena Vance)

---

### Mode 2: Connect Spring Boot Backend with MongoDB Atlas

1. **Set your MongoDB Atlas Environment Variable:**
   * In Windows PowerShell:
     ```powershell
     $env:MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/ewaste_db?retryWrites=true&w=majority"
     ```
   * In Linux/macOS Bash:
     ```bash
     export MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/ewaste_db?retryWrites=true&w=majority"
     ```

2. **Run Spring Boot Backend with Maven:**
   ```bash
   cd backend
   mvn clean spring-boot:run
   ```
   *The backend starts at `http://localhost:8080/`. On first startup, `DataInitializer` seeds test accounts and requests directly into MongoDB Atlas.*

3. **Switch Frontend Data Source:**
   * In the top bar of the frontend, click **"Switch to Spring Boot API"**.
   * The app will ping `http://localhost:8080/api/admin/dashboard-stats` and automatically route all requests to Spring Data MongoDB!

---

## 🐳 Docker & Docker Compose

To run the entire full-stack ecosystem with a single command:

```bash
# Optional: Set your Atlas connection string, or leave blank to use the bundled local Mongo container
export MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/ewaste_db?retryWrites=true&w=majority"

docker compose up --build
```

* **Frontend:** `http://localhost:3000`
* **Backend REST API:** `http://localhost:8080/api/`
* **Local MongoDB (fallback):** `localhost:27017`

---

## ☸️ Kubernetes Deployment

Deploy all services into the dedicated `ewaste-system` namespace:

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Configure MongoDB Atlas secret
kubectl apply -f k8s/mongodb-secret.yaml

# 3. Deploy Backend and Service
kubectl apply -f k8s/backend-deployment.yaml

# 4. Deploy Frontend and Service
kubectl apply -f k8s/frontend-deployment.yaml

# 5. Apply Ingress routing
kubectl apply -f k8s/ingress.yaml
```

---

## 🔄 Jenkins CI/CD Pipeline

The declarative [`Jenkinsfile`](./Jenkinsfile) orchestrates continuous integration:
1. **Checkout SCM**: Clones latest Git branch.
2. **Backend Build & Test**: Compiles Java 21 Spring Boot and executes JUnit tests via Maven.
3. **Frontend Build & Bundle**: Installs npm dependencies and bundles React with Vite.
4. **Docker Build Images**: Multi-stage container builds for backend & frontend.
5. **Docker Push**: Publishes versioned images with build tag to container registry.
6. **Kubernetes Deployment**: Rolls out image update to `ewaste-system` cluster.

---

## 🌿 Environmental Impact Equations

* **Kilograms Diverted:** $\sum (\text{item weight} \times \text{units})$
* **Carbon Offset ($CO_2$ avoided):** $1.82 \times \text{weight in kg}$
* **Toxic Heavy Metals Isolated:** $45\text{g} \times \text{weight in kg}$
* **Citizen EcoPoints Reward:** $50 + (20 \times \text{kg}) + (25 \times (\text{qty} - 1))$
