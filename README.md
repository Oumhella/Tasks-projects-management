# Project Manager - Gestion de Projets et de Tâches

A comprehensive project and task management application featuring a Spring Boot backend and a React/TypeScript frontend.

##  Features
- **Project & Task Management**: Organize projects, tasks, and workflows.
- **Authentication**: Secure login using Keycloak.
- **Microservices Architecture**: Separate backend and frontend services.
- **File Storage**: MinIO integration for object storage.
- **Database**: PostgreSQL for robust data persistence.
- **AI Integration**: Google Gemini integration for AI-assisted features.

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.4
- **Language**: Java 17
- **Database**: PostgreSQL (via Flyway migrations)
- **Security**: Spring Security + OAuth2 (Keycloak)
- **Storage**: MinIO

### Frontend
- **Framework**: React 19.1.1
- **Language**: TypeScript
- **UI Library**: Material UI (MUI) v7
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Calendar**: React Big Calendar / Syncfusion Kanban

## 📋 Prerequisites
- **Docker** & **Docker Compose**
- **Java 17+** (for local backend dev)
- **Node.js 18+** (for local frontend dev)

## ⚡ Getting Started

### Using Docker (Recommended)
1. Clone the repository.
2. Start all services using Docker Compose:
   ```bash
   docker-compose up -d
   ```
   *Note: Ensure you have configured your environment variables and that the `docker-compose.yml` services are uncommented as needed for your setup.*

3. Access the application:
   - **Frontend**: `http://localhost:3000`
   - **Backend API**: `http://localhost:8081`
   - **Keycloak Console**: `http://localhost:8080`
   - **MinIO Console**: `http://localhost:9090`

### Local Development Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your `.env` file (ensure you have Keycloak and MinIO running, or update configuration to point to your instances).
3. Build and run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd project-manager-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## 🔐 Configuration

The application uses `.env` files for configuration.

**Backend (`backend/.env`):**
- `KEYCLOAK_CLIENT_SECRET`: Secret for Keycloak client authentication.
- `MINIO_ACCESS_KEY` & `MINIO_SECRET_KEY`: Credentials for MinIO storage.
- `GEMINI_API_KEY`: API key for Google Gemini AI integration.

**Frontend (`project-manager-frontend/.env`):**
- `REACT_APP_API_URL`: URL of the backend API.
- `REACT_APP_KEYCLOAK_URL`: URL of the Keycloak server.
- `VITE_KEYCLOAK_*`: Keycloak realm and client configuration.
- `REACT_APP_SYNCFUSION_LICENSE`: License key for Syncfusion components.
- `REACT_APP_GEMINI_API_KEY`: API key for frontend AI features (if applicable).

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
