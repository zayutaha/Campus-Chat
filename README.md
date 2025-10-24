# Campus Chat

Campus Chat is a full-stack application designed to facilitate communication within a campus environment. It consists of a backend and a frontend, each with its own setup and functionality.

## Table of Contents

- [Backend](#backend)
- [Frontend](#frontend)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Backend

The backend is located in the `be` directory and is responsible for handling the server-side logic, including user management, messaging, and channel operations.

### Features

- User authentication and management
- Real-time messaging
- Channel creation and management

### Technologies Used

- Python
- FastAPI
- Docker

### Setup

1. Navigate to the `be` directory:
   ```bash
   cd be
   ```
2. Build the Docker image:
   ```bash
   docker build -t campus-chat-backend .
   ```
3. Run the backend server:
   ```bash
   docker-compose up
   ```

---

## Frontend

The frontend is located in the `fe` directory and provides the user interface for the application. It is built using React, TypeScript, and Vite.

### Features

- User-friendly interface
- Real-time chat updates
- Profile management

### Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS

### Setup

1. Navigate to the `fe` directory:
   ```bash
   cd fe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Getting Started

To run the entire application:

1. Start the backend server as described in the [Backend Setup](#backend) section.
2. Start the frontend development server as described in the [Frontend Setup](#frontend) section.
3. Open your browser and navigate to the frontend's development server URL (`http://localhost:5173`).

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
