# 🎓 Student Management System Dashboard

<div align="center">
  <img src="src/Image/Student%20management%20dashboard%20interface.png" alt="Student Management Dashboard Interface" width="100%">
</div>

---

## 🌟 Overview
Welcome to the **Student Management System**! This is a professional, full-stack application crafted with ❤️ using **React (Vite)** on the frontend and **NestJS (MySQL)** on the backend. 

It is designed to be sleek, robust, and highly functional, featuring:
- ✨ **Clean, high-end dashboard** with simulated loading states
- 🛑 **Strict form validation** built right in
- 🛡️ **Custom confirmation dialogs** for safe deletions
- 📊 **Excel export functionality** to easily download your data
- 🔄 **Dual-Mode approach** ensuring it works both via frontend mock data AND connected to the backend API

---

## 🚀 Key Features
- **Modern UI/UX**: Sleek frontend utilizing Tailwind CSS and beautiful icons.
- **Robust Backend**: Enterprise-grade structure using NestJS.
- **Relational Database**: Relational entities and operations powered by TypeORM & MySQL.
- **Download to Excel**: One-click feature to instantly generate `.xlsx` reports. 📈

---

## 💻 Tech Stack
| Frontend 🎨 | Backend ⚙️ | Database 🗄️ |
| --- | --- | --- |
| React (Vite) | NestJS | MySQL |
| Tailwind CSS | TypeORM | |
| Lucide React | TypeScript | |
| Axios | | |

---

## 🏁 Getting Started

### 1️⃣ Database Setup (MySQL)
Ensure you have MySQL installed. Open your terminal/workbench and run:
```sql
CREATE DATABASE sr_interested_circuits_db;
```
> 💡 **Tip:** Make sure your MySQL root user has the password `ADVindiancoder@860964` (per `backend/src/app.module.ts`).

### 2️⃣ Backend Execution (NestJS) 🟢
Navigate to your backend directory and power up the API server:
```bash
cd backend
npm install
npm run start:dev
```
*API is now active at `http://localhost:3000/api`*

### 3️⃣ Frontend Execution (React) ⚛️
Open a fresh terminal, stay in the root project folder, and launch the UI:
```bash
npm install
npm run dev
```
*Visit the `localhost` URL provided in the terminal to view your dashboard!*

---

## 🔌 Connecting Frontend to Backend
The app ships with "Frontend Mode" out-of-the-box (using mockup data). 
**To make it alive and communicate with your NestJS backend:**
1. Open up `src/services/studentService.ts`
2. **Uncomment** the Axios backend API calls.
3. Save, and your frontend is now fully integrated with your live database! 🥳

---

## 📦 Deployment Guide

### Deploying the Frontend (Vercel/Netlify) 🌍
1. Push your repository to GitHub.
2. Go to Vercel/Netlify and create a new project.
3. Setup the build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your UI will be up in minutes!

### Deploying the Backend (Render/Railway) 🚂
1. Deploy your backend codebase to a stable host like Render or Railway.
2. Setup the build & start commands:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
3. Connect a cloud MySQL database service and update `app.module.ts` to use your live DB credentials!

---

<details>
<summary><b>🛠️ View Original Source Code Blocks</b></summary>
<br>

*(The complete NestJS backend architecture and React frontend code used to build this layout can be found within the `backend/src` and `src` directories respectively)*

</details>

<br>

<div align="center">
  <i>Developed for the S R Interested Circuits Pvt Ltd assignment. 🚀</i>
</div>
