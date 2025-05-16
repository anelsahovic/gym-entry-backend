# 🏋️‍♂️ Gym Entry Backend

A Node.js, Express, and TypeScript-based backend application for managing a gym system. It supports authentication, role-based access, and CRUD operations for users, members, and memberships. Built with Prisma ORM and PostgreSQL.

## 🔧 Features

- ✅ Authentication system with login/logout
- 🔐 Role-based access control (Admin & Authenticated User)
- 👥 User management (CRUD + password update)
- 🏷️ Membership management (CRUD)
- 🧍 Member management with membership assignment and scan support
- 🛡️ Request validation with Zod
- 🌐 PostgreSQL integration via Prisma
- 📦 Session handling with `express-session` and `connect-pg-simple`

---

### 🔐 Dummy Test User Credentials

After seeding the database, the following test users are created:

- **Admin User**

  - **Username:** `admin`
  - **Password:** `password`

- **Staff User**
  - **Username:** `staff`
  - **Password:** `password`

> 💡 These credentials are for testing purposes only. Make sure to change them in production environments.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **ORM:** Prisma
- **DB:** PostgreSQL (Render hosted)
- **Validation:** Zod
- **Auth:** Session-based authentication
- **Security:** bcrypt for password hashing
- **Session Store:** connect-pg-simple
- **Dev Tools:** ESLint, nodemon, ts-node

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/gym-entry-backend.git
cd gym-entry-backend
```

### 2. Install dependencies

```bash
npm install

```

### 3. Set up environment variables

- Create a .env file in the root directory:

```bash
PORT=your_port
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_secret_session_key

```

### 4. Run Prisma migrations

```bash
npx prisma generate
npx prisma migrate dev --name init

```

### 5. Run Prisma seed to populate database

```bash
npm run seed

```

### 6. Start the server

```bash
npm start

```

## 📁 API Routes

### 🛡️ Auth Routes (`/api/auth`)

| Method | Endpoint  | Description            | Access        |
| ------ | --------- | ---------------------- | ------------- |
| GET    | `/`       | Get authenticated user | Authenticated |
| POST   | `/login`  | Log in user            | Public        |
| POST   | `/logout` | Log out user           | Authenticated |

---

### 👤 User Routes (`/api/users`) – _Admin Only_

| Method | Endpoint                   | Description          | Access      |
| ------ | -------------------------- | -------------------- | ----------- |
| GET    | `/`                        | Get all users        | Admin       |
| GET    | `/:userId`                 | Get single user      | Admin       |
| POST   | `/`                        | Create user          | Admin       |
| PUT    | `/:userId`                 | Update user          | Admin       |
| PATCH  | `/:userId/update-password` | Update user password | Staff/Admin |
| PATCH  | `/:userId/reset-password`  | Reset user password  | Admin       |
| DELETE | `/:userId`                 | Delete user          | Admin       |

---

### 🧍 Member Routes (`/api/members`)

| Method | Endpoint                | Description              | Access        |
| ------ | ----------------------- | ------------------------ | ------------- |
| GET    | `/`                     | Get all members          | Authenticated |
| GET    | `/:memberId`            | Get single member        | Authenticated |
| GET    | `/scan/:uniqueId`       | Scan member by unique ID | Authenticated |
| POST   | `/`                     | Create member            | Authenticated |
| PUT    | `/:memberId`            | Update member            | Authenticated |
| PATCH  | `/:memberId/membership` | Extend membership        | Authenticated |
| DELETE | `/:memberId`            | Delete member            | Authenticated |

---

### 🏷️ Membership Routes (`/api/memberships`)

| Method | Endpoint         | Description           | Access        |
| ------ | ---------------- | --------------------- | ------------- |
| GET    | `/`              | Get all memberships   | Authenticated |
| GET    | `/:membershipId` | Get single membership | Authenticated |
| POST   | `/`              | Create membership     | Admin         |
| PUT    | `/:membershipId` | Update membership     | Admin         |
| DELETE | `/:membershipId` | Delete membership     | Admin         |
