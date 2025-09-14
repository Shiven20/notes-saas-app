# 📒 Notes SaaS App

A **multi-tenant Notes SaaS application** built with **React (Vite) frontend, Express.js + MongoDB backend**, and **JWT authentication**.  
It allows multiple companies (**tenants**) to manage users, create notes, and handle **subscription upgrades with admin approval**.

---

## 🚀 Features

- 🔑 **User Authentication** (JWT-based login & signup).  
- 🏢 **Multi-Tenant Architecture**  
  - Shared database with `tenantId` field for separation.  
  - Users and notes are always scoped to their tenant.  
- 📝 **Notes Management**  
  - Create, read, delete notes.  
  - Free plan allows up to **3 notes**.  
- 💳 **Subscription Upgrade Flow**  
  - Users can request upgrade to **Pro** plan.  
  - Tenant Admin receives request → approves/rejects.  
  - On approval, user can create unlimited notes.  
- 🎨 **Responsive UI** styled with **Tailwind CSS**.  
- 🔐 **Role-based access** (Admin vs User dashboards).  

---

## 🏗️ Project Structure

notes_saas/
│── backend/ # Express.js + MongoDB API
│ │── src/
│ │ │── models/ # Mongoose models
│ │ │ │── Tenant.js
│ │ │ │── User.js
│ │ │ │── Note.js
│ │ │
│ │ │── routes/ # API routes
│ │ │ │── auth.js
│ │ │ │── notes.js
│ │ │ │── tenants.js
│ │ │
│ │ │── middleware/
│ │ │ │── auth.js # JWT middleware
│ │ │
│ │ │── server.js # Express app entrypoint
│ │
│ │── package.json
│ │── .env # DB connection + secrets
│
│── frontend/ # React (Vite) frontend
│ │── src/
│ │ │── pages/
│ │ │ │── Login.jsx
│ │ │ │── Notes.jsx
│ │ │
│ │ │── App.jsx
│ │ │── main.jsx
│ │
│ │── package.json
│
│── README.md


---

## 🛠️ Tech Stack

**Frontend**  
- ⚡ React (Vite)  
- 🎨 Tailwind CSS  

**Backend**  
- 🟢 Node.js + Express.js  
- 🍃 MongoDB + Mongoose  
- 🔑 JWT Authentication  
- 🔐 Bcrypt (password hashing)  
- 🌍 CORS + dotenv  

---

## ⚙️ Installation

### 1. Clone the repo
```bash
git clone https://github.com/your-username/notes_saas.git
cd notes_saas

Setup backend
# go into backend folder
cd backend

# install dependencies
npm install

#run backend
npm run dev

setup frontend
# go into frontend folder
cd ../frontend

# install dependencies
npm install

# run frontend
npm run dev

Roles and test accounts
Admin (Acme)    → admin@acme.test / password
User (Acme)     → user@acme.test / password
Admin (Globex)  → admin@globex.test / password
User (Globex)   → user@globex.test / password

Admin:
  - Invite users
  - Approve/reject subscription upgrades
  - Unlimited notes after upgrade

User:
  - Create, view, edit, delete notes
  - Max 3 notes on Free plan
  - Unlimited after upgrade approval


