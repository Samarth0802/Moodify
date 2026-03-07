import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/auth.hooks";
import "../styles/Logout.css";

export default function Logout() {

  const { handleLogoutUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);

    const result = await handleLogoutUser();

    setLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="logout-page">

      <div className="logout-page__grid" />

      <div className="logout-card">

        <h1 className="logout-card__title">
          MOOD<span>DETECT</span>
        </h1>

        <p className="logout-card__text">
          Are you sure you want to logout?
        </p>

        <div className="logout-card__controls">

          <button
            className="logout-btn logout-btn--primary"
            onClick={logout}
            disabled={loading}
          >
            {loading ? "LOGGING OUT..." : "LOGOUT"}
          </button>

          <button
            className="logout-btn logout-btn--ghost"
            onClick={() => navigate("/faceDetect")}
          >
            CANCEL
          </button>

        </div>

      </div>

    </div>
  );
}