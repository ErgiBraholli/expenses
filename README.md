# Expenses Tracker

A full-stack expenses tracking application built to practice **SQL analytics**, **Supabase authentication**, and **production deployment with Railway and Vercel**.

The project was developed as a focused learning sprint to design a real backend API, secure it with JWT authentication, and deploy it in a production-like environment.

---

## Features

- User authentication with **Supabase Auth**
- Secure backend API with **JWT verification**
- Add and manage **income and expenses**
- Category management (expense categories only)
- Monthly dashboard with:
  - Total income
  - Total expenses
  - Net balance
  - Top spending categories
- Server-side aggregation using SQL
- Fully responsive UI

---

## Tech Stack

### Frontend

- React
- Axios
- CSS (custom, responsive)
- Deployed on **Vercel**

### Backend

- Node.js
- Express
- JWT authentication
- SQL queries via **Supabase**
- Deployed on **Railway**

### Database & Auth

- **Supabase**
  - PostgreSQL database
  - Authentication (JWT-based)
  - Row-level user scoping

---

## Architecture Overview

1. Users authenticate via Supabase
2. Supabase returns a JWT access token
3. Frontend sends the token in API requests (`Authorization: Bearer <token>`)
4. Backend verifies the token using Supabase JWT secret
5. All queries are scoped to the authenticated user
6. Dashboard data is calculated server-side using SQL aggregation

---

## Key Learning Points

- Writing SQL queries for:
  - Monthly filtering
  - Aggregations (`SUM`, `GROUP BY`)
  - Ranking top categories
- Implementing secure JWT middleware in Express
- Handling CORS and preflight requests in production
- Managing environment variables across local, Railway, and Vercel
- Debugging real deployment issues (ports, env injection, CORS)

---

## Environment Variables

### Backend (Railway)

- SUPABASE_URL=
- SUPABASE_SERVICE_ROLE_KEY=
- SUPABASE_JWT_SECRET=
- FRONTEND_URL=
- PORT=

### Frontend (Vercel)

- REACT_APP_SUPABASE_URL=
- REACT_APP_SUPABASE_ANON_KEY=
- REACT_APP_API_URL=

---

## Running Locally

**Clone the repository**

```bash
   git clone https://github.com/ErgiBraholli/expenses.git
   cd expenses
```

**Backend**

```bash
cd backend
npm install
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm start
```
