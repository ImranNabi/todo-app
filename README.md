# 📝 Todo App — Hackathon Project Submission

This project is a part of a hackathon run by [https://www.katomaran.com](https://www.katomaran.com)

---

## 🌐 Hosted Links

- **Frontend**: [https://todo-app-jet-two-66.vercel.app/](https://todo-app-jet-two-66.vercel.app/)
- **Backend**: [https://todo-app-production-6275.up.railway.app/](https://todo-app-production-6275.up.railway.app/)
- **Project Demo Video**: [Click here to watch](https://drive.google.com/file/d/1T-WZ3APqBLu1W6M8vAhP_K5FEksFE4So/view?usp=sharing)

---

## ⚙ Tech Stack

| Layer       | Technology Used                     |
|-------------|-------------------------------------|
| Frontend    | React.js, Tailwind CSS              |
| Auth        | Google OAuth, JWT                   |
| Backend     | Node.js, Express.js                 |
| Database    | MongoDB Atlas                       |
| Hosting     | Vercel (Frontend), Railway (Backend) |

---

## 🏗 Architecture Diagram

![Todo App Architecture](https://i.imgur.com/YO7UcBd.png)

> The app follows a 3-tier architecture:
>
> - **Client**: React.js frontend using Axios and Tailwind
> - **Server**: Node.js + Express REST API with Google OAuth and JWT
> - **Database**: MongoDB Atlas

---

## 📦 Folder Structure

```
root
│
├── client/ (React frontend)
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
│
├── server/ (Express backend)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── server.js
│
├── README.md
└── .env (not pushed)
```

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/ImranNabi/todo-app.git
cd todo-app
```

### 2. Setup Frontend

```bash
cd TODO
cd todo_frontend
npm install
npm start
```

### 3. Setup Backend

```bash
cd TODO
cd todo_backend
npm install
npm start
```

> ⚠️ Create a `.env` file in the `server/` folder with:
>
> ```env
> MONGODB_URI=your_mongodb_atlas_uri
> JWT_SECRET=your_secret_key
> GOOGLE_CLIENT_ID=your_google_client_id
> ```

---

## 📌 Assumptions

- Google OAuth is the primary login method.
- Each user can create, update, share, and delete their tasks.
- Shared tasks are viewable via unique link.
- Only users with tokens can view their tasks.

---

## 📽 Demo Video

🎥 [Watch the demo](https://drive.google.com/file/d/1T-WZ3APqBLu1W6M8vAhP_K5FEksFE4So/view?usp=sharing)

---

## 🤖 AI Tools Used

- **ChatGPT**:
  - Code refactoring and optimization
  - Designed folder structure
  - Drafted README and documentation

> All prompts and AI interactions were used as assistive tools and are logged.

---

## ✅ Final Submission Highlights

- ✅ Deployed full-stack app with auth and sharing
- ✅ Clean, responsive and intuitive UI
- ✅ Used Google OAuth for seamless login
- ✅ Mobile friendly with native share API
- ✅ Hosted on Vercel + Railway with MongoDB Atlas
- ✅ Architecture, setup, and demo provided

---

### 📢 Submitted for: [https://www.katomaran.com](https://www.katomaran.com)
