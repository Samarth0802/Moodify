import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Hooks/auth.hooks'
import "../styles/Login.css"

const Login = () => {
  const { handleLoginUser, loading } = useAuth()
  const navigate = useNavigate()
  const [usernameorEmail, setUsernameorEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await handleLoginUser(usernameorEmail, password)
    if (result.success) {
      navigate('/faceDetect')
    } else {
      alert(result.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__grid" />

      {/* LEFT — Visual Panel */}
      <div className="auth-page__visual">
        <div className="auth-page__orb auth-page__orb--1" />
        <div className="auth-page__orb auth-page__orb--2" />

        <div className="auth-page__visual-content">
          <h1 className="auth-page__logo">MOOD<span>DETECT</span></h1>

          {/* Animated scan */}
          <div className="auth-page__scan">
            <div className="auth-page__scan-ring auth-page__scan-ring--1" />
            <div className="auth-page__scan-ring auth-page__scan-ring--2" />
            <div className="auth-page__scan-ring auth-page__scan-ring--3" />
            <div className="auth-page__scan-face">◎</div>
            <div className="auth-page__scan-line" />
          </div>

          {/* Emotion chips */}
          <div className="auth-page__emotions">
            <span className="auth-page__chip" style={{"--c": "#FFD93D"}}>😄 Happy</span>
            <span className="auth-page__chip" style={{"--c": "#6CA0DC"}}>😢 Sad</span>
            <span className="auth-page__chip" style={{"--c": "#FF6B6B"}}>😠 Angry</span>
            <span className="auth-page__chip" style={{"--c": "#C77DFF"}}>😲 Surprised</span>
            <span className="auth-page__chip" style={{"--c": "#A8DADC"}}>😐 Neutral</span>
          </div>

          <p className="auth-page__tagline">
            Your face tells a story.<br />We find the soundtrack.
          </p>
        </div>
      </div>

      {/* RIGHT — Form Panel */}
      <div className="auth-page__form-panel">
        <div className="auth-page__form-wrap">

          <div className="auth-page__form-header">
            <div className="auth-page__form-eyebrow">// WELCOME BACK</div>
            <h2 className="auth-page__form-title">Sign In</h2>
            <p className="auth-page__form-sub">Enter your credentials to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>

            <div className="auth-form__group">
              <label className="auth-form__label">USERNAME OR EMAIL</label>
              <div className="auth-form__input-wrap">
                <span className="auth-form__icon">@</span>
                <input
                  type="text"
                  className="auth-form__input"
                  placeholder="you@example.com"
                  value={usernameorEmail}
                  onChange={(e) => setUsernameorEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-form__group">
              <label className="auth-form__label">PASSWORD</label>
              <div className="auth-form__input-wrap">
                <span className="auth-form__icon">⬡</span>
                <input
                  type="password"
                  className="auth-form__input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <a href="#" className="auth-form__forgot">Forgot password?</a>
            </div>

            <button type="submit" className="auth-form__btn" disabled={loading}>
              <span>{loading ? "LOADING..." : "CONTINUE"}</span>
              <span className="auth-form__btn-arrow">→</span>
            </button>

          </form>

          <p className="auth-page__switch">
            Don't have an account?{" "}
            <Link to="/register" className="auth-page__switch-link">Create one</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login