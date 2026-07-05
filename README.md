# LeetCode Mentor Backend

A robust Node.js and Express backend for managing and serving structured LeetCode problem insights. The service connects to MongoDB, stores insight data for each problem, and exposes REST endpoints for bulk ingestion and retrieval of learning content.

---

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-9-880000?logo=mongoose&logoColor=white)

---

## 🌐 Overview

LeetCode Mentor Backend is a lightweight API service designed to support a LeetCode learning experience by storing curated insights for coding problems. Each insight includes pseudocode, conceptual explanation, prerequisites, and real-world use cases, making it easier for learners to understand not just how to solve problems, but why those solutions matter.

The backend is built for reliability and simplicity, with a clean Express architecture and MongoDB-backed persistence. It supports bulk data insertion, problem discovery for missing entries, and lookup by problem slug.

---

## ✨ Core Features

- 📦 Bulk insight ingestion through a secure API endpoint
- 🔍 Retrieval of missing problem numbers within a selected range
- 🧠 Fetching problem insights by LeetCode problem slug
- 🗄️ MongoDB persistence with Mongoose models
- 🔐 Request authentication using an API key header
- ⚡ Lightweight, fast setup for local development and deployment

---

## 🧰 Tech Stack

- [Node.js](https://nodejs.org/) – JavaScript runtime for the server
- [Express.js](https://expressjs.com/) – Web framework for building REST APIs
- [MongoDB](https://www.mongodb.com/) – NoSQL database for storing insights
- [Mongoose](https://mongoosejs.com/) – ODM for schema-based data modeling
- [dotenv](https://www.npmjs.com/package/dotenv) – Environment variable management
- [cors](https://www.npmjs.com/package/cors) – Cross-origin request support
- [body-parser](https://www.npmjs.com/package/body-parser) – Request body parsing
- [nodemon](https://www.npmjs.com/package/nodemon) – Development auto-restart

---

## 🧩 API Endpoints

### Health Check
- GET /hello
- Returns a simple success message from the API

### Bulk Insert or Update Insights
- POST /api/insights/add/bulk-add-insights
- Requires the header: x-api-key
- Expects a non-empty array of insight objects in the request body
- Inserts or updates records by _id

### Find Missing Problems
- GET /api/insights/missing/:maxNumber
- Returns all problem numbers between 1 and maxNumber that are not present in the database

### Fetch Insight by Problem Slug
- GET /api/insights/problem/:problemSlug
- Returns the stored insight for the specified LeetCode problem slug

---

## 📁 Project Structure

```text
leetcode-mentor-backend/
├── app.js                  # Express app entry point
├── package.json            # Project scripts and dependencies
├── README.md               # Project documentation
├── src/
│   ├── db/
│   │   └── db.js           # MongoDB connection setup
│   ├── models/
│   │   └── insightSchema.js
│   └── routes/
│       └── insights.js    # API route handlers
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- A running MongoDB instance

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leetcode-mentor-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create an environment file:
```env
MONGO_URI=mongodb://localhost:27017/leetcode-mentor
API_KEY=your-secret-api-key
PORT=3000
```

4. Start the development server:
```bash
npm start
```

The server will run on the configured port, defaulting to 3000.

---

## 🧪 Example Usage

### Bulk upload insights

```bash
curl -X POST http://localhost:3000/api/insights/add/bulk-add-insights \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key" \
  -d '[{"_id":"two-sum","problemNo":1,"pc":"...","concept":"...","pre":"...","uc":"..."}]'
```

### Check missing problems

```bash
curl http://localhost:3000/api/insights/missing/50
```

### Fetch an insight

```bash
curl http://localhost:3000/api/insights/problem/two-sum
```

---

## 🧠 Insight Schema

Each insight document contains:

- _id: The LeetCode problem slug, used as the unique identifier
- problemNo: The numeric problem ID
- pc: Pseudocode for the optimal approach
- concept: The core DSA concept being taught
- pre: Prerequisite concepts or patterns
- uc: A real-world use case of the problem
- createdAt: Timestamp generated automatically

---

## 📌 Notes

- The service currently uses a permissive CORS configuration for development convenience.
- The bulk insertion endpoint is protected by an API key for secure data ingestion.
- The application expects a valid MongoDB connection string through the MONGO_URI environment variable.

---

## 📄 License

This project is licensed under the ISC License.

---

## 🤝 Contribution

Contributions are welcome. If you would like to improve the API, add new features, or expand the insight dataset, feel free to open an issue or submit a pull request.
