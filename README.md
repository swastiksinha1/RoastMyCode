<div align="center">
  <h1>🔥 RoastMyCode</h1>
  <p><strong>Because your ego needs checking, and your code is probably garbage.</strong></p>
  <p><em>An AI-powered app that brutally roasts your "clean architecture", hosts code battles, and immortalizes your worst mistakes in the Hall of Shame.</em></p>
</div>

---

## 🌟 Features (Or: Ways We Will Hurt Your Feelings)

- **🤖 AI Code Roasting**: Miss the days when senior developers would publicly humiliate you in PR reviews? We’ve automated the trauma! Submit your code snippets and let our AI tear them apart with brutal, witty, and entirely accurate insults.
- **⚔️ Code Battles**: Pit two code snippets against each other to settle the age-old debate of "Which one of us is slightly less terrible at programming?"
- **🏆 Hall of Shame**: A curated museum of the most hilariously bad code ever submitted. Your legacy of `while(true)` and naming variables `data2` will live here forever.
- **✨ Shiny UI/UX**: We built an immersive, fluid, and beautifully animated frontend because we needed something pretty to distract you from how awful your code logic is.

## 🛠️ Tech Stack (Over-Engineered for Your Pleasure)

### Frontend
- **React 19 & Vite**: Because writing plain HTML/JS doesn't make you feel like a "real engineer."
- **TypeScript**: To give you a false sense of security before the runtime errors hit.
- **Tailwind CSS & shadcn/ui**: For when you want things to look nice but refuse to write actual CSS.
- **Framer Motion & GSAP**: Silky smooth animations to soften the blow of a brutal roast.
- **tRPC Client**: Type-safety all the way down. 

### Backend
- **Node.js & Hono**: Blazing fast backend to deliver insults with minimal latency.
- **tRPC**: Because writing REST endpoints in 2026 is so passé.
- **Drizzle ORM**: Because writing raw SQL is scary.
- **PostgreSQL / Neon Database**: The only reliable thing in this entire project.

---

## 📂 Project Structure (For When You Want To Roast *Our* Code)

```text
app/
├── api/                  # Where the AI judges you
├── db/                   # Where your shame is permanently stored
├── public/               # Stuff the browser just eats
└── src/
    ├── components/       # UI bits that we duct-taped together
    ├── hooks/            # Code we didn't know where else to put
    ├── lib/              # Things we copy-pasted from StackOverflow
    ├── pages/            # Where the magic (and bullying) happens
    ├── providers/        # Context boilerplate 
    ├── App.tsx           # The glue
    └── index.css         # The lipstick on the pig
```

---

## 🚀 Getting Started (If You Must)

Want to run this locally? Fine. Follow these steps. If it doesn't work, it's a skill issue.

### 1. Prerequisites
- **Node.js** (v18+)
- **npm** or **yarn**
- **PostgreSQL** (Neon, Supabase, or your noisy laptop fan local setup)

### 2. Installation
Clone this masterpiece and install the dependencies you’ll inevitably never update:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and paste your database URL. Do not commit your `.env` file, we already have enough material for the Hall of Shame.
```bash
cp .env.example .env
```

### 4. Database Setup
Push the Drizzle schema. If it fails, try turning it off and on again:
```bash
npm run db:push
```

### 5. Running the App
Spin it up:
```bash
npm run dev
```
Go to `http://localhost:5173`. Prepare to be roasted.

---

## 📜 Available Scripts

- `npm run dev`: Starts the local server.
- `npm run build`: Bundles the app (and your hopes and dreams).
- `npm run build:node`: Prepares the backend so it can judge you in production.
- `npm run start`: Runs the production server.
- `npm run lint`: Tells you your code sucks *before* the AI does.
- `npm run format`: Prettier will fix your hideous indentation.
- `npm run db:push`: Shoves the schema into your database.

---

## 🤝 Contributing

Found a bug? Want to add a feature? Think you can roast better than the AI? Open an issue or a PR. We promise to review it (and probably roast it).

## 📄 License

MIT License. Do whatever you want with it, just don't blame us when your feelings get hurt.
