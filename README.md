# Campus Chat

Campus Chat is a **full-stack real-time messaging application** built for campus communities. It includes a **FastAPI backend** and a **React + Vite frontend**, both fully containerized with Docker for simple setup and deployment.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Backend](#backend)
- [Frontend](#frontend)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Campus Chat enables students and faculty to communicate in real time through channels, direct messages, and notifications. The project is designed with modularity and developer productivity in mind.

---

## Architecture

```
├── be/              # Backend (FastAPI + uv)
├── fe/              # Frontend (React + Vite + Tailwind)
├── docker-compose.yml
└── README.md
```

**Services:**

- **Backend:** FastAPI app exposing REST + WebSocket APIs
- **Frontend:** React UI served via Vite build
- **Database:** MySQL instance

---

## Backend

**Directory:** `be/`

### Features

- User management (create, login)
- Channel creation and messaging
- WebSocket-based real-time communication

### Tech Stack

- Python 3.11
- FastAPI + Uvicorn
- MySQL (via Docker)
- `uv` for dependency management

### Local Run

```bash
cd be
uv sync
uv run uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Docker Run

```bash
cd be
docker build -t campus-chat-backend .
docker run -p 8000:8000 campus-chat-backend
```

---

## Frontend

**Directory:** `fe/`

### Features

- Real-time chat interface
- User authentication
- Channel and message views
- Responsive Tailwind design

### Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS

### Local Run

```bash
cd fe
npm install
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Docker Setup

You can run the entire stack using Docker Compose.

### Build and Start

```bash
docker compose up --build -d
```

### Services

| Service      | Description      | Port |
| ------------ | ---------------- | ---- |
| **backend**  | FastAPI backend  | 8000 |
| **frontend** | React + Vite app | 5173 |
| **db**       | MySQL database   | 3306 |

### Logs

```bash
docker compose logs -f
```

### Stop

```bash
docker compose down
```

---

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=campus_chat
MYSQL_USER=chat_user
MYSQL_PASSWORD=chat_pass

BASE_URL=http://backend:8000
```

The `BASE_URL` variable allows the frontend to communicate with the backend service inside Docker.

---

## Development

If you prefer running without Docker:

1. Start a MySQL container:

   ```bash
   docker run -d -p 3306:3306 \
     -e MYSQL_ROOT_PASSWORD=root \
     -e MYSQL_DATABASE=campus_chat \
     mysql:8
   ```

2. Run the backend:

   ```bash
   cd be
   uv run uvicorn server:app --reload
   ```

3. Run the frontend:

   ```bash
   cd fe
   npm run dev
   ```

4. Visit [http://localhost:5173](http://localhost:5173).

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit and push your changes
4. Open a pull request

---

## License

This project is licensed under the **MIT License**. See the LICENSE file for details.
