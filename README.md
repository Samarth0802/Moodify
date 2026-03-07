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
- 🌐 **4-layer architecture** — API → Context → Hook → Component

---

## 🖥️ Tech Stack

### Frontend
| Tech | Usage |
|------|-------|
| React + Vite | UI framework |
| React Router DOM | Client-side routing |
| @mediapipe/tasks-vision | Face landmark + blendshape detection |
| Axios | API calls |
| SCSS / CSS | Styling |

### Backend
| Tech | Usage |
|------|-------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| CORS | Cross-origin with credentials |

---

## 📁 Project Structure


---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Knowledge about Google face landmark pipeline.

### 1. Clone the repo
```bash
git clone https://github.com/Samarth0802/moodify.git
cd moodify
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `.env` file in `/Backend`:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
```


```bash
npm run dev
```

App runs at **http://localhost:5173**

---

## 🧠 How Mood Detection Works

1. User clicks **START CAMERA** → webcam permission is requested
2. User clicks **DETECT FACE** → a single frame is captured from the video feed
3. Frame is passed to **MediaPipe FaceLandmarker** running in the browser (no server needed)
4. FaceLandmarker returns **52 blendshape scores** (mouth smile, brow down, jaw open, etc.)
5. Custom logic maps blendshapes → emotion:

```
mouthSmile > 0.6              → 😄 Happy
jawOpen > 0.2 && browUp > 0.2 → 😲 Surprised
browDown > 0.01 && mouthFrown → 😠 Angry
mouthFrown > 0.007            → 😢 Sad
default                       → 😐 Neutral
```

6. Detected emotion is displayed with matching color and glow effect
7. Music plays based on detected emotion

---

## 🔐 Auth Flow

```
Register → POST /api/auth/register (multipart/form-data)
Login    → POST /api/auth/login    (sets HTTP-only cookie)
```

Frontend uses **4-layer architecture**:
```
auth.api.js  →  auth.context.jsx  →  useAuth.js  →  Component
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

