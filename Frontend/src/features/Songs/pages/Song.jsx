import { useEffect, useState, useRef } from "react"
import axios from "axios"
import "../styles/Song.css"

export default function Song({ mood }) {
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!mood) return
    async function fetchSongs() {
      const response = await axios.get(
        `http://localhost:5000/api/song/getSong?mood=${mood.toLowerCase()}`
      )
      setSongs(response.data.song)
    }
    fetchSongs()
  }, [mood])

  // Progress update
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setProgress(audio.currentTime)
      setDuration(audio.duration || 0)
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("loadedmetadata", updateProgress)
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("loadedmetadata", updateProgress)
    }
  }, [])

  function play(song) {
    if (currentSong?._id === song._id) {
      // Toggle play/pause same song
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    } else {
      // New song
      audioRef.current.src = song.songUrl
      audioRef.current.play()
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  function handleSeek(e) {
    const newTime = parseFloat(e.target.value)
    audioRef.current.currentTime = newTime
    setProgress(newTime)
  }

  function formatTime(sec) {
    if (!sec || isNaN(sec)) return "0:00"
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <div className="songs-page">

      {/* Song list — full width, vertical stack */}
      <div className="songs-list">
        {songs.map((song, i) => (
          <div
            className={`song-row ${currentSong?._id === song._id ? "song-row--active" : ""}`}
            key={song._id}
            onClick={() => play(song)}
          >
            <span className="song-row__index">
              {currentSong?._id === song._id && isPlaying ? "▶" : i + 1}
            </span>

            <img src={song.posterUrl} className="song-row__cover" alt={song.title} />

            <div className="song-row__info">
              <span className="song-row__title">{song.title}</span>
              <span className="song-row__artist">{song.artist || mood}</span>
            </div>

            <span className="song-row__duration">{song.duration || "--:--"}</span>
          </div>
        ))}
      </div>

      {/* Player bar — fixed bottom */}
      {currentSong && (
        <div className="player-bar">
          {/* Left — song info */}
          <div className="player-bar__left">
            <img src={currentSong.posterUrl} className="player-bar__cover" alt="" />
            <div className="player-bar__meta">
              <span className="player-bar__title">{currentSong.title}</span>
              <span className="player-bar__artist">{currentSong.artist || mood}</span>
            </div>
          </div>

          {/* Center — controls + seekbar */}
          <div className="player-bar__center">
            <button
              className="player-bar__btn player-bar__btn--play"
              onClick={() => play(currentSong)}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            <div className="player-bar__seek">
              <span className="player-bar__time">{formatTime(progress)}</span>
              <input
                type="range"
                className="player-bar__range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={progress}
                onChange={handleSeek}
              />
              <span className="player-bar__time">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right — volume */}
          <div className="player-bar__right">
            <span className="player-bar__vol-icon">🔊</span>
            <input
              type="range"
              className="player-bar__range player-bar__range--vol"
              min={0}
              max={1}
              step={0.01}
              defaultValue={1}
              onChange={(e) => { audioRef.current.volume = e.target.value }}
            />
          </div>
        </div>
      )}

      <audio ref={audioRef} />
    </div>
  )
}