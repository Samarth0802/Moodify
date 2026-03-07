import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Hooks/auth.hooks'
import "../styles/SignUp.css"

const SignUp = () => {

  const { handleRegisterUser, loading } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await handleRegisterUser(username, email, password)

    if (result.success) {
      alert("Account created successfully")
      navigate("/login")
    } else {
      alert(result.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__grid" />

      {/* LEFT — Animation Panel */}
      <div className="auth-page__visual">
        <div className="auth-page__orb auth-page__orb--1" />
        <div className="auth-page__orb auth-page__orb--2" />

        <div className="auth-page__visual-content">
          <h1 className="auth-page__logo">MOOD<span>DETECT</span></h1>

          <div className="auth-page__float-cards">
            <div className="auth-page__float-card auth-page__float-card--1" style={{"--c":"#FFD93D"}}>
              <span>😄</span>
              <div>
                <div className="auth-page__float-card-title">Happy</div>
                <div className="auth-page__float-card-sub">Upbeat playlist →</div>
              </div>
            </div>
            <div className="auth-page__float-card auth-page__float-card--2" style={{"--c":"#6CA0DC"}}>
              <span>😢</span>
              <div>
                <div className="auth-page__float-card-title">Sad</div>
                <div className="auth-page__float-card-sub">Chill lo-fi →</div>
              </div>
            </div>
            <div className="auth-page__float-card auth-page__float-card--3" style={{"--c":"#FF6B6B"}}>
              <span>😠</span>
              <div>
                <div className="auth-page__float-card-title">Angry</div>
                <div className="auth-page__float-card-sub">Heavy beats →</div>
              </div>
            </div>
            <div className="auth-page__float-card auth-page__float-card--4" style={{"--c":"#C77DFF"}}>
              <span>😲</span>
              <div>
                <div className="auth-page__float-card-title">Surprised</div>
                <div className="auth-page__float-card-sub">Feel good mix →</div>
              </div>
            </div>
          </div>

          <p className="auth-page__tagline">
            Detect your mood.<br />Play the perfect song.
          </p>
        </div>
      </div>

      <div className="auth-page__form-panel">
        <div className="auth-page__form-wrap">

          <div className="auth-page__form-header">
            <div className="auth-page__form-eyebrow">// NEW USER</div>
            <h2 className="auth-page__form-title">Create Account</h2>
            <p className="auth-page__form-sub">Join and let your face choose the music</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>

            <div className="auth-form__group">
              <label className="auth-form__label">USERNAME</label>
              <div className="auth-form__input-wrap">
                <span className="auth-form__icon">@</span>
                <input
                  type="text"
                  className="auth-form__input"
                  placeholder="your_handle"
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-form__group">
              <label className="auth-form__label">EMAIL</label>
              <div className="auth-form__input-wrap">
                <span className="auth-form__icon">✉</span>
                <input
                  type="email"
                  className="auth-form__input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
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
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="auth-form__btn" disabled={loading}>
              <span>{loading ? "CREATING..." : "CREATE ACCOUNT"}</span>
              <span className="auth-form__btn-arrow">→</span>
            </button>

          </form>

          <p className="auth-page__switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-page__switch-link">Sign in</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default SignUp