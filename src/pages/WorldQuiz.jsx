import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { difficultyMeta, getFlagsByDifficulty } from "../data/flags";

const TAB_ORDER = ["easy", "medium", "hard", "impossible"];

function loadVisited() {
  return new Set(JSON.parse(localStorage.getItem("adhi-visited-flags") || "[]"));
}

export default function WorldQuiz() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "easy"
  );
  const [visited, setVisited] = useState(loadVisited);

  // Re-sync when navigating back from FlagDetail
  useEffect(() => {
    setVisited(loadVisited());
  }, []);

  function handleReset() {
    if (window.confirm("Reset all progress? All colours will go back to unvisited. 🔄")) {
      localStorage.removeItem("adhi-visited-flags");
      setVisited(new Set());
    }
  }

  const meta = difficultyMeta[activeTab];
  const tabFlags = getFlagsByDifficulty(activeTab);

  return (
    <div className="wq-page">
      {/* Floating shapes */}
      <div className="bg-shapes">
        <div className="shape shape-1">🌟</div>
        <div className="shape shape-2">🎈</div>
        <div className="shape shape-3">🌈</div>
        <div className="shape shape-4">⭐</div>
        <div className="shape shape-5">🎀</div>
        <div className="shape shape-6">💫</div>
      </div>

      {/* Back button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* Header */}
      <header className="wq-header">
        <div className="title-wrapper">
          <div className="title-icon">🌍</div>
          <h1 className="main-title">
            <span className="title-adhi">WORLD </span>
            <span className="title-journey">QUIZ</span>
          </h1>
          <div className="title-icon">🌍</div>
        </div>
        <p className="subtitle">Choose your difficulty, then pick a number! 🎯</p>
      </header>

      {/* Progress bars + Reset */}
      <div className="wq-progress-section">
        <div className="wq-progress-grid">
          {TAB_ORDER.map((key) => {
            const m = difficultyMeta[key];
            const all = getFlagsByDifficulty(key);
            const total = all.length;
            const done = all.filter((f) => visited.has(f.id)).length;
            const pct = total > 0 ? (done / total) * 100 : 0;
            return (
              <div key={key} className="wq-progress-item">
                <div className="wq-progress-label">
                  <span>{m.emoji} {m.label}</span>
                  <span className="wq-progress-count">{done}/{total}</span>
                </div>
                <div className="wq-progress-track">
                  <div
                    className="wq-progress-fill"
                    style={{ width: `${pct}%`, background: m.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <button className="wq-reset-btn" onClick={handleReset}>
          🔄 RESET
        </button>
      </div>

      {/* Difficulty Tabs */}
      <div className="wq-tabs">
        {TAB_ORDER.map((key) => {
          const m = difficultyMeta[key];
          return (
            <button
              key={key}
              className={`wq-tab ${activeTab === key ? "wq-tab--active" : ""}`}
              style={{ "--t-color": m.color, "--t-shadow": m.shadow }}
              onClick={() => setActiveTab(key)}
            >
              <span className="wq-tab-emoji">{m.emoji}</span>
              <span className="wq-tab-label">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Number Buttons Grid */}
      <div
        className="wq-numbers-panel"
        style={{ "--panel-color": meta.color, "--panel-shadow": meta.shadow, background: meta.bg }}
        key={activeTab}
      >
        <div className="wq-numbers-header">
          <span className="wq-numbers-emoji">{meta.emoji}</span>
          <span className="wq-numbers-title" style={{ color: meta.color }}>
            {meta.label} — {tabFlags.length} Flags
          </span>
          <span className="wq-numbers-emoji">{meta.emoji}</span>
        </div>

        <div className="wq-numbers-grid">
          {tabFlags.map((flag) => {
            const isVisited = visited.has(flag.id);
            return (
              <button
                key={flag.id}
                className={`wq-num-btn ${isVisited ? "wq-num-btn--visited" : ""}`}
                style={{ "--n-color": meta.color, "--n-shadow": meta.shadow }}
                onClick={() => navigate(`/flag/${flag.id}`)}
              >
                {isVisited && <span className="wq-num-check">✓</span>}
                {flag.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer" style={{ marginTop: 20 }}>
        <p>🌟 Learn • Play • Explore 🌟</p>
      </footer>
    </div>
  );
}
