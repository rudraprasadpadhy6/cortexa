# Cortexa | Smart Notes. Smarter Learning.

Cortexa (internally known as SkillBridge) is an AI-powered e-learning platform that leverages OpenAI to enhance student learning experiences. It allows users to manage smart notes, parse PDFs, and dynamically generate insights for a smarter learning journey.

## 🚀 Key Features

- **Smart Notes & PDF Parsing:** Upload and parse PDFs to extract text and generate smart summaries using OpenAI.
- **AI-Powered Insights:** Get intelligent insights and learning assistance powered by OpenAI's advanced models.
- **Secure Authentication:** User registration and login with secure password hashing (bcrypt) and JWT-based session management.
- **Interactive UI:** A highly responsive frontend built with React, Vite, Recharts, and Lucide icons.
- **Dark Mode Support:** Built-in dark/light theme switching.

## 💻 Tech Stack

### Frontend
- **Framework:** React 18, Vite
- **Routing:** React Router v6
- **Styling/UI:** Custom CSS, Lucide React (Icons), Recharts (Data Visualization)
- **HTTP Client:** Axios

### Backend
- **Framework:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **AI Integration:** OpenAI API
- **File Processing:** Multer, pdf-parse

## 📂 Project Structure

- `/frontend/` - Contains the React & Vite frontend application.
- `/backend/` - Contains the Node.js/Express backend server, models, controllers, and routing logic.

## ⚙️ How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URI)
- An [OpenAI API Key](https://platform.openai.com/api-keys)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd e-learning
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `/backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173` (or the port Vite provides).
