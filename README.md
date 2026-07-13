# HelpDesk
A centralized platform for logging, managing, and tracking technical support requests. The system allows customers to submit tickets and track progress in real time, while administrators and agents manage resolutions and view data via an analytics dashboard.

### 🚀 Technologies

* **Frontend:** React (Vite), TypeScript, Tailwind CSS, Shadcn/UI, Axios, Lucide Icons, Sonner (Toasts)
* **Backend:** NestJS, TypeScript, Prisma ORM, Passport JWT, Swagger UI
* **Database:** PostgreSQL

### 🔧 Installation & Setup

#### > Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/) (comes with Node)
* [PostgreSQL](https://www.postgresql.org/)

#### 🖥️ 1. Backend Setup (NestJS)
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

#### 💻 2. Frontend Setup (React)

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