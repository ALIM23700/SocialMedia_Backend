# Fullstack Social Media Backend

Express.js + MongoDB backend for the Fullstack Social Media application.  
Handles user authentication, real-time messaging, posts, stories, reels, notifications, and profile management.

## ⚡ Base URL & Frontend Link

- **Backend Base URL:**  
https://social-media-backend.onrender.com

Frontend repo link: [SocialMedia_Frontend](https://github.com/ALIM23700/SocialMedia_Frontend)

## 🛠 Tech Stack

- Node.js & Express.js  
- MongoDB (Atlas / Cloud)  
- Mongoose for database modeling  
- JWT (JSON Web Tokens) for authentication  
- Bcrypt for password hashing  
- CORS for cross-origin requests  
- Dotenv for environment variables  
- Socket.IO / Firebase Realtime DB for real-time chat & notifications  

---

## ✨ Features

- User authentication (signup, login, logout)  
- Real-time messaging between users  
- Posts CRUD (Create, Read, Update, Delete)  
- Stories & Reels management  
- Likes, comments, and notifications  
- Profile management  
- Follow/unfollow system  
- Explore feed & search  

---

# ⚙️ Setup Instructions

1. Clone the backend repo  
git clone https://github.com/ALIM23700/SocialMedia_Backend.git

2. Navigate into the project folder  
cd SocialMedia_Backend

3. Install dependencies  
npm install

4. Create a `.env` file with the following variables  
Example:  
MONGO_URI=<your_mongodb_connection_string>  
JWT_SECRET=<your_jwt_secret>  
PORT=4000  

5. Run the server locally  
npm start

6. Server will run at:  
http://localhost:4000

---

## 📁 Project Structure

SocialMedia_Backend/  
├── controllers/       → Handles request logic  
├── models/            → MongoDB schemas  
├── routes/            → API routes  
├── middleware/        → Authentication & error handling  
├── utils/             → Helper functions  
├── .env               → Environment variables  
├── server.js          → Entry point  
└── package.json  

---

## 🚀 Future Improvements

- Add unit and integration tests  
- Enhance error handling and logging  
- Improve performance & query optimization  
- Add email / push notifications  
- Analytics/dashboard for user engagement  

---

## 📄 License

MIT License  
You are free to use, modify, and distribute this project.
