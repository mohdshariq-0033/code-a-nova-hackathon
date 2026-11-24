# Code-a-Nova Hackathon Registration Portal

Full-stack MERN stack application with OTP Email Verification & Nodemailer Integration built for the Code-a-Nova Full Stack Developer Internship Task.

## 🚀 Features
- **Authentication**: Email/Password Signup with 6-digit OTP email verification via Nodemailer, Password hashing (bcrypt), and JWT-based session security.
- **Hackathon Registration**: Multi-field form with 1-5 dynamic team member fields, validate links (Drive/GitHub), and domain selection.
- **User Dashboard**: Protected dashboard displaying user submission status, team details, and quick project actions.
- **Nodemailer Setup**: Automatic verification OTP & registration confirmation emails.

## 🛠️ Stack
- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth & Mail**: JWT, bcryptjs, Nodemailer

## 📦 Setup & Run Instructions

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Update MongoDB URI & Gmail credentials
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
