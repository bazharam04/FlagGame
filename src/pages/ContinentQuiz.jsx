import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFlagById } from "../data/flags";
import { continentFlagIds } from "../data/continentFlags";
import { continents } from "../data/continents";

function loadVisited() {
  return new Set(JSON.parse(localStorage.getItem("adhi-visited-flags") || "[]"));
}

export default function ContinentQuiz() {
  const { continentId } = useParams();
  const navigate = useNavigate();
  const [visited, setVisited] = useState(loadVisited);

  useEffect(() => {
    setVisited(loadVisited());
  }, []);

  const continent = continents.find((c) => c.id === continentId);
  const flagIds = continentFlagIds[continentId] || [];
  const continentFlags = flagIds.map((id) => getFlagById(id)).filter(Boolean);

  if (!continent || continentFlags.length === 0) {
    return (
      <div className="wq-page">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <p style={{ color: "#555", fontSize: "1.5rem" }}>Continent not found 😢</p>
      </div>
    );
  }

  const done  = continentFlags.filter((f) => visited.has(f.id)).length;
  const total = continentFlags.length;
  const pct   = total > 0 ? (done / total) * 100 : 0;

  function handleReset() {
    if (window.confirm(`Reset all ${continent.name} progress? All colours will go back to unvisited. 🔄`)) {
      const stored = JSON.parse(localStorage.getItem("adhi-visited-flags") || "[]");
      const continentIdSet = new Set(flagIds);
      const remaining = stored.filter((id) => !continentIdSet.has(id));
      localStorage.setItem("adhi-visited-flags", JSON.stringify(remaining));
      setVisited(loadVisited());
    }
  }

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
      <button className="back-btn" onClick={() => navigate("/")}>← Back</button>

      {/* Header */}
      <header className="wq-header">
        <div className="title-wrapper">
          <div className="title-icon">{continent.emoji}</div>
          <h1 className="main-title" style={{ color: continent.color }}>
            {continent.name.toUpperCase()}
          </h1>
          <div className="title-icon">{continent.emoji}</div>
        </div>
        <p className="subtitle">Pick a number and discover its flag! 🎯</p>
      </header>

      {/* Progress bar + Reset */}
      <div className="wq-progress-section" style={{ maxWidth: 760 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="wq-progress-label">
            <span>{continent.emoji} {continent.name.toUpperCase()}</span>
            <span className="wq-progress-count">{done}/{total}</span>
          </div>
          <div className="wq-progress-track">
            <div
              className="wq-progress-fill"
              style={{ width: `${pct}%`, background: continent.color }}
            />
          </div>
        </div>
        <button className="wq-reset-btn" onClick={handleReset}>
          🔄
        </button>
      </div>

      {/* Numbers panel */}
      <div
        className="wq-numbers-panel"
        style={{
          "--panel-color": continent.color,
          "--panel-shadow": continent.shadowColor,
          background: "linear-gradient(135deg, #fff8f0, #f0f8ff)",
        }}
      >
        <div className="wq-numbers-header">
          <span className="wq-numbers-emoji">{continent.emoji}</span>
          <span className="wq-numbers-title" style={{ color: continent.color }}>
            {continent.name.toUpperCase()} — {total} Flags
          </span>
          <span className="wq-numbers-emoji">{continent.emoji}</span>
        </div>

        <div className="wq-numbers-grid">
          {continentFlags.map((flag, index) => {
            const isVisited = visited.has(flag.id);
            return (
              <button
                key={flag.id}
                className={`wq-num-btn ${isVisited ? "wq-num-btn--visited" : ""}`}
                style={{ "--n-color": continent.color, "--n-shadow": continent.shadowColor }}
                onClick={() =>
                  navigate(`/flag/${flag.id}`, {
                    state: { from: `/continent/${continentId}` },
                  })
                }
              >
                {isVisited && <span className="wq-num-check">✓</span>}
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      <footer className="home-footer" style={{ marginTop: 20 }}>
        <p>🌟 Learn • Play • Explore 🌟</p>
      </footer>
    </div>
  );
}
