# 📊 Generative UI Analytics Dashboard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Ollama](https://img.shields.io/badge/AI-Ollama_Llama_3-000000?style=for-the-badge)

An enterprise-grade, full-stack analytics application that utilizes Generative AI to construct user interfaces on the fly. Instead of static dashboards, users can query a 500,000-record MongoDB database using natural language, and the application dynamically generates strictly-typed Recharts components to visualize the data.

## ✨ Core Features

- **Generative UI (AI-Driven Rendering):** Integrates a local Llama 3 (8B) model via Ollama, utilizing strict JSON prompting to map database aggregations into dynamic React chart schemas (Bar, Line, Pie, Area, Radar, and KPI Cards).
- **Enterprise-Scale Data Architecture:** Manages 500,000 mocked transaction records. Utilizes MongoDB indexing and server-side pagination to ensure millisecond query response times.
- **Resilient Defensive Engineering:** Implements Zod validation on the backend to enforce strict AI output schemas, preventing hallucinated data from crashing the frontend React tree.
- **Robust Security Pipeline:** Secured with `Helmet.js` for HTTP header protection, `express-rate-limit` to protect AI compute resources, and custom input sanitization to mitigate prompt injection attacks.
- **Dual-View Interface:** Features a modular React UI with a generative AI workspace and a paginated raw data explorer.

## 🏗️ System Architecture & Safe Data Flow

To ensure enterprise security, **the AI never queries the database directly.**

1.  **Intent Parsing:** User submits a natural language query. The backend AI router maps the intent to a secure, predefined MongoDB aggregation field (e.g., `$region`, `$customerType`).
2.  **Database Aggregation:** The Node.js server securely executes the aggregation pipeline against MongoDB.
3.  **UI Generation:** The server passes the summarized numerical data and the user query to the local LLM, requesting a strictly formatted UI schema.
4.  **Validation & Render:** Zod validates the AI's JSON output. If safe, it is passed to the React frontend, which acts as a "dumb renderer" to mount the interactive chart.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas cluster (or local instance)
- [Ollama](https://ollama.com/) installed locally with the Llama 3 model (`ollama run llama3`)

### Installation

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/yourusername/generative-ui-dashboard.git](https://github.com/yourusername/generative-ui-dashboard.git)
   cd generative-ui-dashboard
   ```

2. **Install Dependencies:**

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install

   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your MongoDB URI:

   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/analytics?retryWrites=true&w=majority

   ```

4. **Seed the Database (Optional but Recommended):**
   Generates 500,000 realistic, dynamically weighted transaction records.

   ```bash
   node seed.js

   ```

5. **Run the Application:**
   _Start the Backend:_

   ```bash
   node server.js

   ```

_Start the Frontend:_

```bash
cd client
npm run dev

```

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Recharts, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **AI Engine:** Ollama (Llama 3 - 8B)
- **Validation:** Zod
