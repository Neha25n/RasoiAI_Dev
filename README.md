# RasoiAI

AI-powered recipe generation app with an Indian soul and global reach.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, JavaScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, JavaScript |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini 2.5 Flash |
| Auth | JWT (bcrypt + jsonwebtoken) |
| Styling | CSS custom properties, light/dim theme |

## Features

- **AI Recipe Generation** - Gemini crafts a real recipe based on your ingredients, diet, allergies, cuisine, calories, and nutrition goals
- **Nutrition Insight** - Personalized nutrition advice generated alongside each recipe
- **Pantry Management** - Track what you have, organized by category
- **Recipe Saving** - MongoDB-backed saved recipes per user
- **Authentication** - JWT register/login/me flow
- **Dark/Dim Mode** - Warm charcoal dim theme, persisted via localStorage

## Project Structure

```text
rasoiai/
|-- client/                 # React + Vite frontend
|   |-- index.html
|   |-- src/
|   |   |-- components/     # Header, ThemeToggle
|   |   |-- context/        # AuthContext (JWT)
|   |   |-- lib/            # api.js (axios), types.js helpers/constants
|   |   |-- pages/          # HomePage, RecipePage, SavedPage, PantryPage, AuthPage
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- index.css
|   |-- tailwind.config.js
|   `-- vite.config.js
`-- server/                 # Node + Express backend
    |-- src/
    |   |-- lib/            # db.js (MongoDB), gemini.js (AI)
    |   |-- middleware/     # auth.js (JWT), errorHandler.js
    |   |-- models/         # User, Recipe, PantryItem
    |   |-- routes/         # auth, recipes, pantry
    |   `-- index.js
    `-- package.json
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 2. Server setup

```bash
cd server
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev
```

### 3. Client setup

```bash
cd client
npm install
npm run dev
```

### 4. Or run both together (from root)

```bash
npm install          # installs concurrently
npm run install:all  # installs client + server deps
npm run dev          # starts both
```

App runs at **http://localhost:5173**, API at **http://localhost:3001**.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | JWT | Get current user |
| POST | `/api/recipes/generate` | Optional | Generate via Gemini AI |
| POST | `/api/recipes/save` | JWT | Save a recipe |
| GET | `/api/recipes/saved` | JWT | List saved recipes |
| DELETE | `/api/recipes/:id` | JWT | Delete saved recipe |
| GET | `/api/pantry` | JWT | List pantry items |
| POST | `/api/pantry` | JWT | Add item |
| PUT | `/api/pantry/:id` | JWT | Update item |
| DELETE | `/api/pantry/:id` | JWT | Remove item |

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **Get API Key**
3. Add it to `server/.env` as `GEMINI_API_KEY`
