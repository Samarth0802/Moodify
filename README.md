# 🎵 MoodDetect

> **Detect your mood. Play the perfect song.**

MoodDetect is a full-stack web application that uses your webcam and Google MediaPipe's face landmark detection to analyze your facial expression in real time — and plays music that matches your mood.

---

## ✨ Features

- 🎭 **Real-time face expression detection** via Google MediaPipe FaceLandmarker
- 😄 **5 emotion states** — Happy, Sad, Angry, Surprised, Neutral
- 📷 **One-shot detection** — camera stays on but detection runs only when you click
- 🎵 **Mood-based music** — songs play according to detected emotion
- 🔐 **Auth system** — Register, Login, JWT via HTTP-only cookies
- 🚪 **Token blacklisting on logout** — powered by Redis / blacklist model
- 🎧 **Songs managed by admin** — uploaded via Postman using ImageKit
- 🛡️ **Protected routes** — unauthenticated users redirected to login
- 🌐 **Feature-based architecture** — Auth, Expression, Songs as separate modules

---

## 🖥️ Tech Stack

### Frontend
| Tech | Usage |
|------|-------|
| React + Vite | UI framework |
| React Router DOM | Client-side routing + protected routes |
| @mediapipe/tasks-vision | Face landmark + blendshape detection |
| Axios | API calls |
| CSS | Styling per feature |

### Backend
| Tech | Usage |
|------|-------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Redis / Blacklist Model | JWT token blacklisting on logout |
| ImageKit | Song file + poster image hosting |
| Multer | File upload middleware |
| CORS | Cross-origin with credentials |

---

## 📁 Project Structure

```
moodify/
├── Backend/
│   ├── server.js
│   ├── .env
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── cache.js               # Redis config
│       │   └── database.js            # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── song.controller.js
│       ├── middlewares/
│       │   ├── auth.middleware.js     # JWT verify + blacklist check
│       │   └── upload.middleware.js   # Multer config
│       ├── models/
│       │   ├── auth.model.js          # User schema
│       │   ├── blacklist.model.js     # Blacklisted JWT tokens
│       │   └── song.model.js          # Song schema
│       ├── routes/
│       │   ├── auth.route.js
│       │   └── song.route.js
│       └── services/
│           └── upload.service.js      # ImageKit upload logic
│
└── Frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── AllRoutes.jsx              # All app routes defined here
        ├── ProtectedRoutes.jsx        # Auth guard wrapper
        └── features/
            ├── Auth/
            │   ├── authContext.jsx    # Auth context + provider
            │   ├── components/
            │   │   └── Logout.jsx
            │   ├── Hooks/
            │   │   └── auth.hooks.js
            │   ├── pages/
            │   │   ├── Login.jsx
            │   │   └── SignUp.jsx
            │   ├── services/
            │   │   └── auth.api.js
            │   └── styles/
            │       ├── Login.css
            │       ├── Logout.css
            │       └── SignUp.css
            ├── Expression/
            │   ├── pages/
            │   │   └── FaceExpression.jsx   # Core mood detection
            │   └── styles/
            │       └── FaceExpression.css
            └── Songs/
                ├── pages/
                │   └── Song.jsx             # Song list + player bar
                └── styles/
                    └── Song.css
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- ImageKit account
- Knowledge about Google MediaPipe face landmark pipeline

### 1. Clone the repo
```bash
git clone https://github.com/Samarth0802/moodify.git
cd moodify
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

Create `.env` file in `/Backend`:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Redis
REDIS_HOST = REDIS HOST
REDIS_PORT = YOUR REDIS PORT
REDIS_PASSWORD = REDIS_PASSWORD


# ImageKit
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd Frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

---

## 🎵 Song Management

> Songs are **not added via UI**. Only admins can add songs using **Postman** with ImageKit.

### How to add a song via Postman

**Endpoint:** `POST http://localhost:3000/api/song/add`

**Auth:** Send JWT token in cookie (login first via Postman)

**Body:** `form-data`

| Key | Type | Value |
|-----|------|-------|
| `title` | Text | Song name |
| `artist` | Text | Artist name |
| `mood` | Text | `happy` / `sad` / `angry` / `surprised` / `neutral` |
| `songFile` | File | `.mp3` audio file |
| `posterFile` | File | Cover image |

ImageKit automatically hosts both files and returns public URLs which are saved in MongoDB.

### Fetch songs by mood
```
GET /api/song/getSong?mood=happy
```

---

## 🧠 How Mood Detection Works

1. User clicks **START CAMERA** → webcam permission is requested
2. User clicks **DETECT FACE** → a single frame is captured from video feed
3. Frame is passed to **MediaPipe FaceLandmarker** running entirely in the browser
4. FaceLandmarker returns **52 blendshape scores** (mouthSmile, browDown, jawOpen, etc.)
5. Custom logic maps blendshapes → emotion:

```
mouthSmile > 0.6               → 😄 Happy
jawOpen > 0.2 && browUp > 0.2  → 😲 Surprised
browDown > 0.01 && mouthFrown  → 😠 Angry
mouthFrown > 0.007             → 😢 Sad
default                        → 😐 Neutral
```

6. Detected emotion displayed with color glow effect
7. Songs fetched from backend by mood → player bar appears

---

## 🔐 Auth Flow

```
Register → POST /api/auth/register
Login    → POST /api/auth/login    → JWT set as HTTP-only cookie
Logout   → POST /api/auth/logout   → JWT added to blacklist
```

On every protected request, `auth.middleware.js` checks:
1. Is JWT valid and not expired?
2. Is JWT present in `blacklist` collection (or Redis)?

If either fails → `401 Unauthorized`

### Frontend 4-layer architecture
```
auth.api.js  →  authContext.jsx  →  auth.hooks.js  →  Component
```

---

## 🎨 Design System

All pages share a consistent dark tech aesthetic:

| Token | Value |
|-------|-------|
| `--bg` | `#060608` |
| `--surface` | `#0e0e12` |
| `--border` | `#1e1e26` |
| `--text` | `#e8e8f0` |
| `--accent` | `#00f5c4` |
| Font | Orbitron + Share Tech Mono |

---

## 📸 Emotion Color Palette

| Emotion | Color |
|---------|-------|
| 😄 Happy | `#FFD93D` |
| 😢 Sad | `#6CA0DC` |
| 😠 Angry | `#FF6B6B` |
| 😲 Surprised | `#C77DFF` |
| 😐 Neutral | `#A8DADC` |

---

## 📜 License

MIT © 2025 Samarth
