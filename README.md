# HelpDesk
HelpDesk centralizes support requests into a single platform where users can open tickets, staff can work through them following a strict status lifecycle, and administrators can monitor operational health through a dashboard.

## Features

### Authentication
- JWT-based login and registration
- Passwords hashed with bcrypt
- Inactive accounts are blocked from logging in or creating tickets
- Protected routes on both frontend and backend

### Users
- Full CRUD operations
- Unique email enforcement
- Soft delete only (users are never physically removed from the database, preserving ticket history)

### Tickets
- Create, view, edit, list, filter, and sort
- Tickets are never deleted — full history is preserved
- Every ticket starts with `PENDING` status automatically
- Priority levels: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- CLIENT users only see their own tickets; ADMIN and AGENT see all tickets
- Filters: status, priority, creator, creation date range, free-text search
- Sorting: creation date, last update, title, status

### Dashboard
- Total ticket count
- Breakdown by status (pending, working, resolved, cancelled)
- Tickets created in the last 7 days
- Tickets resolved in the last 7 days
- Average resolution time

### 🚀 Technologies

* **Frontend:** React (Vite), TypeScript, Tailwind CSS, Shadcn/UI, Axios, Lucide Icons, Sonner (Toasts), React Hook Form
* **Backend:** NestJS, Prisma ORM, JWT (`@nestjs/jwt`, `passport-jwt`), bcrypt, Swagger UI, PostgreSQL

### 🔧 Installation & Setup

#### > Prerequisites
* Node.js (LTS recommended)
* npm
* PostgreSQL

#### 🖥️ 1. Backend Setup
1.1 Navigate to the server directory:
```
cd backend
```

1.2 Install all required dependencies (including NestJS CLI and Prisma local packages):
```
npm install
```

1.3 Create a `.env` file in the root of the `backend` folder using `.env.example` as a template, and configure your connection strings:
```
DATABASE_URL=""
JWT_SECRET=""
JWT_EXPIRES_IN=""
```

1.4 Generate the Prisma Client and run migrations to initialize your database schema:
```
npx prisma generate
npx prisma migrate dev
```

1.5 Start the local NestJS development server:
```
npm run start:dev
```
> The backend API will be live at: `http://localhost:3000/api`

#### 💻 2. Frontend Setup

2.1 Open a new terminal window
```
cd frontend
```

2.2 Install the frontend dependencies:
```
npm install
```

2.3 Launch the Vite development server:
```
npm run dev
```
> The interface will be accessible at: `http://localhost:5173`

---

### 🛠️ Developer Tools
* **Database GUI (Prisma Studio):** Open a visual editor in your browser to directly inspect, modify, and monitor your database records.
```bash
npx prisma studio
```
> URL: `http://localhost:5555`