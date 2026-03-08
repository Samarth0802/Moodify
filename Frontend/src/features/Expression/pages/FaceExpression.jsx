import { useRef, useState, useEffect } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import "../styles/FaceExpression.css";
import { useNavigate } from "react-router-dom";
import Song from "../../Songs/pages/Song";


const EMOTIONS = {
  happy:     { emoji: "😄", label: "Happy",     color: "#FFD93D" },
  sad:       { emoji: "😢", label: "Sad",       color: "#6CA0DC" },
  angry:     { emoji: "😠", label: "Angry",     color: "#FF6B6B" },
  surprised: { emoji: "😲", label: "Surprised", color: "#C77DFF" },
  neutral:   { emoji: "😐", label: "Neutral",   color: "#A8DADC" },
};

function detectEmotionFromBlendshapes(blendshapes) {
  if (!blendshapes || blendshapes.length === 0) return "neutral";
  const map = {};
  blendshapes[0].categories.forEach((c) => {
    map[c.categoryName] = c.score;
  });

  const mouthSmile = (map["mouthSmileLeft"] || 0) + (map["mouthSmileRight"] || 0);
  const mouthFrown = (map["mouthFrownLeft"] || 0) + (map["mouthFrownRight"] || 0);
  const browDown   = (map["browDownLeft"] || 0) + (map["browDownRight"] || 0);
  const browUp     = map["browInnerUp"] || 0;
  const jawOpen    = map["jawOpen"] || 0;

  if (mouthSmile > 0.6)                    return "happy";
  if (jawOpen > 0.2 && browUp > 0.2)       return "surprised";
  if (browDown > 0.1 && mouthFrown > 0.01)  return "angry";
  if (mouthFrown > 0.001)                    return "sad";
  return "neutral";
}

export default function FaceExpression() {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const navigate = useNavigate()
  const [status,   setStatus]   = useState("idle");
  const [emotion,  setEmotion]  = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    async function loadModel() {
      try {
        setStatus("loading");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "IMAGE",
          numFaces: 1,
        });
        faceLandmarkerRef.current = faceLandmarker;
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }
    loadModel();
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraOn(true);
    } catch {
      setStatus("error");
    }
  }

  async function detectOnce() {
    if (!faceLandmarkerRef.current || !videoRef.current) return;
    setStatus("detecting");
    setEmotion(null);

    await new Promise((r) => setTimeout(r, 300));

    const canvas = canvasRef.current;
    const video  = videoRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const result   = faceLandmarkerRef.current.detect(canvas);
    const detected = detectEmotionFromBlendshapes(result.faceBlendshapes);
    setEmotion(detected);
    setStatus("done");
  }

  function reset() {
    setEmotion(null);
    setStatus("ready");
  }

  const currentEmotion = emotion ? EMOTIONS[emotion] : null;

  return (
    <div className="face-app">
      {/* Animated background grid */}
      <div className="face-app__grid" />

      {/* Header */}
      <header className="face-app__header">
        <h1 className="face-app__title">MOOD<span>DETECT</span></h1>
        <div className={`face-app__status-pill face-app__status-pill--${status}`}>
          <span className="face-app__status-dot" />
          {status === "loading"   && "LOADING MODEL"}
          {status === "idle"      && "INITIALIZING"}
          {status === "ready"     && "MODEL READY"}
          {status === "detecting" && "SCANNING FACE"}
          {status === "done"      && "SCAN COMPLETE"}
          {status === "error"     && "ERROR"}
        </div>
      </header>

      {/* Main content */}
      <main className="face-app__main">

        {/* Video container */}
        <div
          className="face-app__video-wrap"
          style={{ "--emotion-color": currentEmotion?.color || "#2a2a2a" }}
        >
          <video
            ref={videoRef}
            className={`face-app__video ${cameraOn ? "face-app__video--on" : ""}`}
            muted
            playsInline
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Camera off placeholder */}
          {!cameraOn && (
            <div className="face-app__placeholder">
              <div className="face-app__placeholder-icon">◎</div>
              <span>AWAITING CAMERA</span>
            </div>
          )}

          {/* Scanning overlay */}
          {status === "detecting" && (
            <div className="face-app__scan-overlay">
              <div className="face-app__scan-line" />
              <span className="face-app__scan-text">ANALYZING...</span>
            </div>
          )}

          {/* Corner decorators */}
          <div className="face-app__corner face-app__corner--tl" />
          <div className="face-app__corner face-app__corner--tr" />
          <div className="face-app__corner face-app__corner--bl" />
          <div className="face-app__corner face-app__corner--br" />

          {/* Emotion badge */}
          {status === "done" && currentEmotion && (
            <div
              className="face-app__emotion-badge"
              style={{ "--emotion-color": currentEmotion.color }}
            >
              <span className="face-app__emotion-emoji">{currentEmotion.emoji}</span>
              <span className="face-app__emotion-label">{currentEmotion.label.toUpperCase()}</span>
            </div>
          )}
        </div>
          {emotion && <Song mood={emotion} />}
        {/* Buttons */}
        <div className="face-app__controls">
          {!cameraOn ? (
            <button
              className="face-app__btn face-app__btn--primary"
              onClick={startCamera}
              disabled={status === "loading" || status === "error"}
            >
              <span className="face-app__btn-icon">▶</span>
              START CAMERA
            </button>
          ) : (
            <button
              className="face-app__btn face-app__btn--detect"
              onClick={detectOnce}
              disabled={status === "detecting" || status === "loading"}
            >
              <span className="face-app__btn-icon">◉</span>
              {status === "detecting" ? "DETECTING..." : "DETECT FACE"}
            </button>
          )}

          {status === "done" && (
            <button className="face-app__btn face-app__btn--ghost" onClick={reset}>
              ↺ RESET
            </button>
          )}
        </div>

        {/* Result card */}
        {status === "done" && currentEmotion && (
          <div
            className="face-app__result"
            style={{ "--emotion-color": currentEmotion.color }}
          >
            <div className="face-app__result-emoji">{currentEmotion.emoji}</div>
            <div className="face-app__result-info">
              <span className="face-app__result-label">DETECTED MOOD</span>
              <span className="face-app__result-emotion">{currentEmotion.label}</span>
            </div>
          </div>
        )}
        
      </main>
      <button onClick={()=>navigate("/logout")} className="logout">
            LOGOUT
      </button>
    </div>
  );
}