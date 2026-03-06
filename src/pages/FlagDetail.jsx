import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { flags, getFlagById, difficultyMeta } from "../data/flags";
import { AWARDS, MILESTONES } from "../data/awards";
import AwardBanner from "../components/AwardBanner";

export default function FlagDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const flag = getFlagById(id);

  const [nameRevealed, setNameRevealed] = useState(false);
  const [speaking, setSpeaking]         = useState(false);
  const [imgLoaded, setImgLoaded]       = useState(false);
  const [imgError, setImgError]         = useState(false);
  const [currentAward, setCurrentAward] = useState(null);
  const [visitedCount, setVisitedCount] = useState(0);
  const clickTimer = useRef(null);

  useEffect(() => {
    setNameRevealed(false);
    setSpeaking(false);
    setImgLoaded(false);
    setImgError(false);
  }, [flag?.id]);

  useEffect(() => {
    if (!flag) return;

    const stored = new Set(
      JSON.parse(localStorage.getItem("adhi-visited-flags") || "[]")
    );
    const isNew = !stored.has(flag.id);

    stored.add(flag.id);
    localStorage.setItem("adhi-visited-flags", JSON.stringify([...stored]));
    setVisitedCount(stored.size);

    // Fire the matching award the first time each milestone is crossed
    if (isNew && MILESTONES.includes(stored.size)) {
      setCurrentAward(AWARDS[stored.size]);
    }

    return () => window.speechSynthesis.cancel();
  }, [flag?.id]);

  function goBack() {
    const from = location.state?.from;
    if (from?.startsWith("/continent/")) {
      navigate(from);
    } else {
      navigate("/world-quiz", { state: { activeTab: flag?.difficulty || "easy" } });
    }
  }

  function goNext() {
    const visited = new Set(
      JSON.parse(localStorage.getItem("adhi-visited-flags") || "[]")
    );
    const nextFlag = flags.find((f) => f.id > flag.id && !visited.has(f.id));
    if (nextFlag) navigate(`/flag/${nextFlag.id}`, { state: location.state });
  }

  if (!flag) {
    return (
      <div className="fd-page">
        <p style={{ color: "#fff", fontSize: "2rem" }}>Flag not found 😢</p>
        <button className="back-btn" onClick={() => navigate("/world-quiz")}>← Back</button>
      </div>
    );
  }

  const meta    = difficultyMeta[flag.difficulty];
  const flagUrl = `https://flagcdn.com/w640/${flag.code}.png`;

  function handleNameReveal() {
    if (!nameRevealed) setNameRevealed(true);
    speakName();
  }

  function speakName() {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(flag.name);
    utterance.rate  = 0.85;
    utterance.pitch = 1.1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend   = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function handleFlagClick() {
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => handleNameReveal(), 220);
  }

  function handleFlagDoubleClick() {
    clearTimeout(clickTimer.current);
    goNext();
  }

  return (
    <div className="fd-page" style={{ "--d-color": meta.color, "--d-shadow": meta.shadow }}>
      {/* Floating shapes */}
      <div className="bg-shapes">
        <div className="shape shape-1">🌟</div>
        <div className="shape shape-2">🎈</div>
        <div className="shape shape-3">🌈</div>
        <div className="shape shape-4">⭐</div>
        <div className="shape shape-5">🎀</div>
        <div className="shape shape-6">💫</div>
      </div>

      {/* Flag image */}
      <div className="fd-flag-wrapper">
        <div className="fd-visited-badge">{visitedCount}</div>
        <div className="fd-flag-number">#{flag.id}</div>
        <div
          className={`fd-flag-frame ${imgLoaded ? "fd-flag-frame--loaded" : ""}`}
          onClick={handleFlagClick}
          onDoubleClick={handleFlagDoubleClick}
          style={{ cursor: "pointer" }}
        >
          {!imgError ? (
            <img
              src={flagUrl}
              alt="mystery flag"
              className="fd-flag-img"
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
            />
          ) : (
            <div className="fd-flag-fallback">🏳️</div>
          )}
        </div>
      </div>

      {/* Name reveal area */}
      <div className="fd-name-area">
        {nameRevealed ? (
          <div className="fd-name-revealed" style={{ color: meta.color }}>
            {flag.name}
          </div>
        ) : (
          <div className="fd-name-hidden">???</div>
        )}
      </div>

      {/* Button row: Back | Name | Next */}
      <div className="fd-btn-row">
        <button className="back-btn" onClick={goBack}>← Back</button>
        <button
          className={`fd-name-btn ${speaking ? "fd-name-btn--speaking" : ""}`}
          style={{ background: meta.color, boxShadow: `0 7px 0 ${meta.shadow}` }}
          onClick={handleNameReveal}
        >
          {speaking ? <>🔊 Speaking...</> : nameRevealed ? <>🔊 Say it again!</> : <>🏷️ NAME</>}
        </button>
        {flags.some((f) => f.id > flag.id && !JSON.parse(localStorage.getItem("adhi-visited-flags") || "[]").includes(f.id)) ? (
          <button className="next-btn" style={{ background: meta.color, boxShadow: `0 4px 0 ${meta.shadow}` }} onClick={goNext}>
            Next →
          </button>
        ) : (
          <div style={{ width: "80px" }} />
        )}
      </div>

      {/* Award banner overlay */}
      {currentAward && (
        <AwardBanner award={currentAward} onClose={() => setCurrentAward(null)} />
      )}
    </div>
  );
}
