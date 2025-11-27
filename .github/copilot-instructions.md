# GitHub Copilot Instructions for My Task Board

This repository is a solution for the [DevChallenges My Task Board Challenge](https://devchallenges.io/challenge/my-task-board-app).
AI agents should prioritize fulfilling the challenge requirements while respecting the existing codebase structure.

## 🎯 Challenge Requirements & Context

- **Goal**: Create a task management app following the provided design.
- **Key Features**:
    - **Board**: Multiple columns ("In Progress", "Completed", "Won't do").
    - **Tasks**: Create, edit (name, description, icon, status), delete.
    - **Defaults**: New boards should initialize with specific default tasks.
    - **Persistence**: Changes must be saved to the database.
- **Design Fidelity**: UI components in `src/components/` should maintain the visual style of the challenge design.

## 🏗 Project Architecture

- **Frontend**: React (v19) + Vite + TypeScript. Located in `src/`.
- **Backend**: Node.js + Express. Located in `server/`.
- **Database**: PostgreSQL managed via Prisma ORM. Schema in `prisma/schema.prisma`.
- **Monorepo**: Frontend and backend share the same root.

## 🚀 Development Workflow

1.  **Database**:
    - `npm run db:init`: Initializes DB and seeds data. **Crucial**: Run this if DB schema changes.
2.  **Backend**:
    - `npm run dev:server`: Runs Express on `http://localhost:3001`.
3.  **Frontend**:
    - `npm run dev`: Runs Vite on `http://localhost:5173`.

## 🧩 Key Conventions & Patterns

### Frontend (`src/`)
- **State Management**:
    - Currently uses **React `useState` / `useEffect`** in `TaskBoard.tsx`.
    - *Note*: Challenge requirements mention Redux/Zustand, but this project currently uses local state. **Do not refactor to Redux/Zustand unless explicitly requested.**
- **API Communication**: Native `fetch` API. Base URL: `http://localhost:3001/api`.
- **Board Logic**: `boardId` is stored in `localStorage`. If missing, a new board is created via API.
- **Icons**: The project uses a specific set of emojis/icons for tasks.

### Backend (`server/`)
- **Routes**: `server/routes/boards.ts` and `server/routes/tasks.ts`.
- **Prisma**: Use the `prisma` instance. Ensure `npx prisma generate` is run after schema changes.
- **Error Handling**: Return appropriate HTTP status codes (404 for missing resources, 500 for server errors).

## 📂 Critical Files
- `src/TaskBoard.tsx`: Central logic for board state and data fetching.
- `server/setup-db.ts`: Handles database seeding and initialization (important for "Default Task Board" requirement).
- `prisma/schema.prisma`: Defines `Board` and `Task` models.
- `機能要件.md`: Contains the detailed requirements list from DevChallenges.

## ⚠️ Common Pitfalls
- **Default Data**: When creating a new board, the backend must generate the default tasks ("Task in Progress", etc.) as per requirements. Check `server/routes/boards.ts` for this logic.
- **CORS**: Ensure `cors` middleware is active in `server/index.ts`.
- **Env Vars**: `.env` is required for both `dev:server` and `db:init`.
- **Prisma Generation**: If you modify `schema.prisma`, remember to run `npx prisma generate` (or `npm install` which usually triggers it) to update the client.
