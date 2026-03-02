import { useNavigate } from "react-router-dom";
import ContinentCard from "../components/ContinentCard";
import { continents } from "../data/continents";

export default function Home() {
  const navigate = useNavigate();

  function handleContinentClick(continent) {
    navigate(`/continent/${continent.id}`);
  }

  return (
    <div className="home-page">
      {/* Floating background shapes */}
      <div className="bg-shapes">
        <div className="shape shape-1">🌟</div>
        <div className="shape shape-2">🎈</div>
        <div className="shape shape-3">🌈</div>
        <div className="shape shape-4">⭐</div>
        <div className="shape shape-5">🎀</div>
        <div className="shape shape-6">💫</div>
      </div>

      {/* Header */}
      <header className="home-header">
        <div className="title-wrapper">
          <div className="title-icon">🗺️</div>
          <h1 className="main-title">
            <span className="title-adhi">ADHI'S</span>
            <span className="title-flag"> FLAG </span>
            <span className="title-journey">JOURNEY</span>
          </h1>
          <div className="title-icon">🌍</div>
        </div>
        <p className="subtitle">Pick a continent and explore its flags! 🚀</p>
      </header>

      {/* Continent Grid */}
      <main className="continents-grid">
        {continents.map((continent) => (
          <ContinentCard
            key={continent.id}
            continent={continent}
            onClick={handleContinentClick}
          />
        ))}
      </main>

      {/* World Quiz CTA */}
      <div className="world-quiz-cta">
        <button className="world-quiz-btn" onClick={() => navigate("/world-quiz")}>
          🌍 WORLD QUIZ 🌍
        </button>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <p>🌟 Learn • Play • Explore 🌟</p>
      </footer>
    </div>
  );
}
