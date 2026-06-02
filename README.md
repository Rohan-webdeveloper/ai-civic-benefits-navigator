# ⚡ AI Civic Benefits Navigator

> A full-stack government-tech AI platform that helps citizens discover eligible public benefits, understand schemes in simple English, apply online, upload documents, and track application status.

![AI Civic Benefits Navigator](https://img.shields.io/badge/Status-Active-brightgreen)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

---

## 🚀 Live Demo

> Frontend: `http://localhost:5173` | Backend API: `http://localhost:5000/api`

---

## 📸 Screenshots

### 🏠 Landing Page
- Premium government-tech hero section with glassmorphism AI preview card
- Stats, features, workflow, trust & security sections

### 📋 Dashboard
- Citizen dashboard with application stats and quick actions

### ✅ Eligibility Checker
- Rule-based recommendation engine matching user profile to benefits

### 🤖 AI Assistant
- Gemini-powered chat interface with local fallback responses

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Styling | Vanilla CSS (no Tailwind, no UI libraries) |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Google Gemini 1.5 Flash |
| File Upload | Multer |
| HTTP Client | Axios |

---

## ✨ Features

- ✅ **User Register / Login** — JWT-based authentication with bcrypt password hashing
- ✅ **JWT Protected Routes** — All sensitive pages require authentication
- ✅ **Citizen Dashboard** — Overview of applications, stats, and quick actions
- ✅ **Benefits Listing** — Browse 10+ seeded benefits with search & category filters
- ✅ **Eligibility Questionnaire** — Fill in age, income, state, category, and flags
- ✅ **Rule-Based Recommendation** — Engine matches your profile against all benefit criteria
- ✅ **AI Assistant** — Gemini-powered chat with graceful local fallback
- ✅ **AI Benefit Explanation** — Explain any scheme in simple English via AI
- ✅ **Apply for Benefits** — Submit applications with duplicate prevention
- ✅ **My Applications** — View all submitted applications with full details
- ✅ **Application Status Timeline** — Track every status change with date and notes
- ✅ **Document Upload** — Upload PDFs/images via Multer (5MB limit)
- ✅ **Admin / Caseworker Dashboard** — Review all applications in a table view
- ✅ **Admin Status Update** — Update application status with notes and timeline entry
- ✅ **Responsive UI** — Mobile-first design, works on all screen sizes
- ✅ **Auto-Seed Benefits** — 10 sample benefits seeded if database is empty

---

## 📁 Project Structure

```
AI CIVIC/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Profile
│   │   ├── benefitController.js   # CRUD + auto-seed
│   │   ├── eligibilityController.js # Rule-based matching engine
│   │   ├── aiController.js        # Gemini AI + fallback
│   │   ├── applicationController.js # Apply, track, admin update
│   │   └── documentController.js  # Multer upload handler
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protect + adminOnly
│   │   └── uploadMiddleware.js     # Multer config
│   ├── models/
│   │   ├── User.js                 # User schema + bcrypt
│   │   ├── Benefit.js              # Benefit schema + eligibility rules
│   │   └── Application.js          # Application + timeline schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── benefitRoutes.js
│   │   ├── eligibilityRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── documentRoutes.js
│   ├── uploads/                    # Uploaded documents (gitignored)
│   ├── server.js                   # Express entry point
│   ├── .env.example                # Environment variables template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── api.js              # Axios instance + interceptors
    │   │   ├── authApi.js
    │   │   ├── benefitApi.js
    │   │   ├── eligibilityApi.js
    │   │   ├── aiApi.js
    │   │   └── applicationApi.js
    │   ├── components/
    │   │   ├── Navbar.jsx          # Gov topbar + sticky navbar
    │   │   └── ProtectedRoute.jsx  # JWT route guard
    │   ├── pages/
    │   │   ├── Home.jsx            # Premium landing page
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx       # Citizen dashboard
    │   │   ├── Benefits.jsx        # Benefit listing + AI explain
    │   │   ├── EligibilityCheck.jsx
    │   │   ├── AIHelp.jsx          # AI chat interface
    │   │   ├── MyApplications.jsx  # Status timeline + doc upload
    │   │   └── AdminDashboard.jsx  # Admin review table
    │   ├── App.jsx                 # Router + protected routes
    │   ├── main.jsx
    │   └── index.css               # Full custom CSS (no libraries)
    ├── index.html
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key ([Get here](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-civic-benefits-navigator.git
cd ai-civic-benefits-navigator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai_civic_benefits?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

✅ Server runs on `http://localhost:5000`  
✅ Benefits auto-seeded on first run

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend runs on `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/profile` | Get user profile (Protected) |

### Benefits
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/benefits` | List all benefits (search, filter) |
| GET | `/api/benefits/:id` | Get benefit by ID |
| POST | `/api/benefits` | Create benefit (Admin only) |

### Eligibility
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/eligibility/check` | Check eligibility (Protected) |

### AI
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/assistant` | AI chat assistant (Protected) |
| POST | `/api/ai/explain-benefit` | Explain a benefit via AI (Protected) |

### Applications
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/applications` | Apply for a benefit (Protected) |
| GET | `/api/applications/my` | Get user's applications (Protected) |
| GET | `/api/applications` | Get all applications (Admin) |
| PUT | `/api/applications/:id/status` | Update status (Admin) |

### Documents
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/documents/upload` | Upload document (Protected) |

---

## 🧪 Test Accounts

After registering, you can test with:

| Role | How to Register |
|------|----------------|
| Citizen | Register with role = "Citizen" |
| Admin | Register with role = "Admin / Caseworker" |

---

## 🔐 Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- **JWT tokens** expire in 30 days
- **Bearer token** auto-attached via Axios interceptor
- **401 auto-redirect** to login on token expiry
- **Admin-only** routes protected server-side
- **File type validation** (PDF, JPG, PNG, DOC only)
- **5MB file size** limit on uploads
- **Duplicate application** prevention via MongoDB unique index

---

## 🤖 AI Features

- **Google Gemini 1.5 Flash** — Fast, free-tier AI model
- **Graceful fallback** — If API fails/quota exceeded, smart local responses are returned (no crash)
- **System prompt** — AI is pre-configured as a government benefits expert

---

## 🎨 UI Highlights

- Deep navy + royal blue + gold color scheme
- Government topbar with emblem
- Glassmorphism AI preview card on hero
- Floating animated category cards
- Gradient hero section with background shapes
- Premium feature, stats, workflow, trust sections
- Chat-style AI interface with typing indicator
- Application status timeline with colored dots
- Admin review table with filter tabs
- Fully responsive (mobile/tablet/desktop)

---

## 📦 Sample Benefits (Auto-Seeded)

1. 🏥 National Health Insurance Scheme
2. 🎓 National Scholarship for Higher Education
3. 🏠 Affordable Housing Scheme
4. 🍚 Public Distribution System (PDS)
5. 💼 Employment Guarantee Program
6. ♿ Disability Pension Scheme
7. 👴 Senior Citizen Pension
8. 👩 Women Empowerment & Self-Help Program
9. 🌾 Farmer Crop Insurance Scheme
10. 🛠️ Skill Development & Training Program

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👨‍💻 Author

Built as a **MERN Stack + AI portfolio project** demonstrating:
- Full-stack architecture
- JWT authentication
- AI API integration with fallback
- Rule-based recommendation engine
- File uploads with Multer
- Admin/user role separation
- MongoDB Atlas cloud database
- Premium government-tech UI

---

> ⭐ If you found this useful, please give it a star on GitHub!
