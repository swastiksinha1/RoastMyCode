<div align="center">
  <h1>🔥 RoastMyCode</h1>
  <p><strong>An AI-powered app that brutally roasts your code, hosts code battles, and features a Hall of Shame.</strong></p>
</div>

---

## 🌟 Features

- **🤖 AI Code Roasting**: Submit your code snippets and let the AI tear them apart with brutal, funny, and insightful roasts.
- **⚔️ Code Battles**: Pit two code snippets against each other to see which one is "less terrible."
- **🏆 Hall of Shame**: A curated collection of the most hilariously bad code snippets ever submitted.
- **✨ Modern UI/UX**: Immersive fluid animations, beautiful typography, and responsive design built with Tailwind CSS, shadcn/ui, and GSAP.

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** + **GSAP** (Animations)
- **Zustand / Context API** (State Management)
- **tRPC Client** (Type-safe API calls)

### Backend
- **Node.js** + **Hono**
- **tRPC** (Type-safe routing)
- **Drizzle ORM** (Database mapping)
- **PostgreSQL** / **Neon Database**

---

## 📂 Project Structure

```text
app/
├── api/                  # Backend Hono/tRPC server routes and logic
├── db/                   # Database schema and migrations (Drizzle ORM)
├── public/               # Static assets
└── src/
    ├── components/       # Reusable UI components
    ├── hooks/            # Custom React hooks
    ├── lib/              # Utility functions and configurations
    ├── pages/            # Application routes (Home, Roast, Battle, HallOfShame)
    ├── providers/        # React context providers
    ├── App.tsx           # Main application entry point
    └── index.css         # Global styles
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (Local or hosted like Neon/Supabase)

### 2. Installation
Clone the repository and install dependencies:
```bash
# Install dependencies
npm install
```

### 3. Environment Variables
Copy the `.env.example` file to `.env` and configure your database connection and other required variables:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` is set to a valid PostgreSQL connection string.

### 4. Database Setup
Push the Drizzle schema to your database to create the necessary tables:
```bash
npm run db:push
```

### 5. Running the App
Start the Vite development server:
```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the frontend for production.
- `npm run build:node`: Builds the Vite frontend and compiles the backend Hono server.
- `npm run start`: Runs the production server using the compiled node build.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run format`: Runs Prettier to format the codebase.
- `npm run test`: Runs unit tests via Vitest.
- `npm run db:push`: Pushes the current Drizzle schema directly to the database.
- `npm run db:generate`: Generates new Drizzle migrations based on schema changes.
- `npm run db:migrate`: Applies pending Drizzle migrations.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is open-source and available under the MIT License.
