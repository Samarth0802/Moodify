# 🎵 MoodDetect

> **Detect your mood. Play the perfect song.**

MoodDetect is a full-stack web application that uses your webcam and Google MediaPipe's face landmark detection to analyze your facial expression in real time — and plays music that matches your mood.

---

# ✨ Features

- 🎭 **Real-time face expression detection** using MediaPipe FaceLandmarker
- 😄 **5 emotion states** — Happy, Sad, Angry, Surprised, Neutral
- 📷 **One-shot detection** — camera stays on but detection runs only when clicked
- 🎵 **Mood-based music playback**
- ☁️ **Song + cover upload via ImageKit**
- 🔐 **JWT authentication with HTTP-only cookies**
- 🔴 **Redis token blacklisting for secure logout**
- 👤 **Only authenticated users can upload songs**
- 🌐 **Clean frontend architecture** — API → Context → Hook → Component

---

# 🖥️ Tech Stack

## Frontend

| Tech | Usage |
|-----|------|
| React + Vite | UI framework |
| React Router DOM | Client-side routing |
| @mediapipe/tasks-vision | Face detection |
| Axios | API requests |
| CSS / SCSS | Styling |

---

## Backend

| Tech | Usage |
|-----|------|
| Node.js + Express | REST API |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcrypt | Password hashing |
| Redis | Token blacklisting |
| Multer | File upload handling |
| ImageKit | Cloud storage |
| NodeID3 | Extract song metadata |

---

# 🎵 Song System

Songs are fetched based on detected emotion.

Example API request:
