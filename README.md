# Final Project – Product Review & Rating Platform

This is a full-stack application for browsing products, submitting reviews, and rating items. Built with React + TypeScript on the frontend and Express + TypeScript on the backend, with MongoDB as the database.

---

## 🚀 Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Redux Toolkit, React Router v6, Vite
- Backend: Node.js, Express, TypeScript, Mongoose (MongoDB)
- Deployment: Vercel (Frontend)
- Bonus: MongoDB used for full data persistence

---

## 🧪 How to Run the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Michelle0902/Final_Project_UN.git
cd Final_Project_UN
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/product-review-app
HF_API_TOKEN=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
JWT_SECRET=your-secret-key
```

> Replace `HF_API_TOKEN` and `JWT_SECRET` with actual secure values.

---

### 4. Seed the Database

Run the following script to insert initial users:

```bash
```bash
npx ts-node src/seeder.ts
```
```
add the following collections:
products
reviews
users
> Make sure your local MongoDB is running first.

---

### 5. Run the Backend Server

```bash
npm run dev
```

---

### 6. Run the Frontend (in a separate terminal)

```bash
cd ../client
npm install
npm run dev
```

The frontend will be served at: `http://localhost:5173`

---

## 🌐 Deployed Frontend

View the live site at:  
👉 https://final-project-un.vercel.app/

---

## 🗂 Folder Structure

```
Final_Project_UN/
├── client/      # Frontend code (React + Vite)
└── server/      # Backend code (Express + TypeScript)
```

---

## ✅ Features Implemented

- Product list with category filtering and search
- Average rating calculation
- Full CRUD for reviews
- Authentication using JWT
- Pagination and dynamic routes
- Memoization for performance

---

## 🧑‍🏫 For Grading

- JSON file storage replaced with MongoDB for bonus
- `.env` files are ignored from Git for security
- Video demo submitted separately
