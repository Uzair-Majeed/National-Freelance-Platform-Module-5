# NFP Backend - Collaboration Module

## Technical Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Primary Database**: PostgreSQL (via `pg` pool)
- **Secondary Database**: SQLite3 (for `files.db` metadata)
- **Authentication**: Simulated Identity Layer (Simulates JWT/External Auth)

## 📡 API Architecture

The backend follows a **Service-Repository** pattern for clean separation of concerns:

- **Routes**: Defines the API endpoints.
- **Controllers**: Handles request validation and HTTP responses.
- **Services**: Contains core business logic and cross-entity coordination.
- **Repositories**: Manages direct database interactions (PostgreSQL).
- **Config**: Centralized database and environment management.

## 🛠️ Configuration

The server relies on environment variables defined in `.env`:

```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/dbname
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Scripts

- `npm run dev`: Starts the server using **Nodemon** for auto-reload.
- `npm start`: Standard production start.

## 📁 Key Directories

- `src/routes/`: Strategic endpoint definitions.
- `src/services/`: Operational logic (Tasks, Workspaces, Chat).
- `src/repositories/`: Data persistence layer.
- `src/middleware/`: Security and Request Auditing (Auth, Error handlers).

---
*Part of the National Freelance Platform ecosystem.*
