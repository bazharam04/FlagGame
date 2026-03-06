import { useEffect } from "react";
import { flags } from "../data/flags";
import { playMilestoneSound } from "../utils/sounds";

const PARTICLE_COLORS = [
  "#ff4757", "#ff6348", "#ffd700", "#2ed573",
  "#1e90ff", "#a29bfe", "#fd79a8", "#00cec9",
  "#fdcb6e", "#6c5ce7", "#00b894", "#e17055",
];

const BURST_POSITIONS = [
  { left: "6%",  top: "10%", delay: 0    },
  { left: "88%", top: "8%",  delay: 0.35 },
  { left: "50%", top: "4%",  delay: 0.7  },
  { left: "14%", top: "72%", delay: 0.2  },
  { left: "83%", top: "68%", delay: 0.55 },
  { left: "94%", top: "40%", delay: 0.9  },
  { left: "2%",  top: "44%", delay: 0.45 },
  { left: "46%", top: "90%", delay: 0.15 },
  { left: "72%", top: "30%", delay: 0.6  },
  { left: "28%", top: "85%", delay: 0.8  },
];

const ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];


function Burst({ left, top, delay }) {
  return (
    <div className="fw-burst" style={{ left, top }}>
      {ANGLES.map((angle, i) => (
        <div
          key={angle}
          className="fw-particle"
          style={{
            "--p-angle": `${angle}deg`,
            "--p-color": PARTICLE_COLORS[i % PARTICLE_COLORS.length],
            animationDelay: `${delay + i * 0.04}s`,
            animationDuration: "1.6s",
          }}
        />
      ))}
    </div>
  );
}

export default function AwardBanner({ award, onClose }) {
  const visitedIds = JSON.parse(localStorage.getItem("adhi-visited-flags") || "[]");
  const showcaseFlags = visitedIds
    .slice(-5)
    .map((id) => flags.find((f) => f.id === id))
    .filter(Boolean);

  useEffect(() => {
    playMilestoneSound(award.count);
  }, []);

  return (
    <div className="award-overlay" onClick={onClose}>
      {/* Fireworks */}
      <div className="fw-container">
        {BURST_POSITIONS.map((pos, i) => (
          <Burst key={i} left={pos.left} top={pos.top} delay={pos.delay} />
        ))}
      </div>

      {/* Card */}
      <div
        className="award-card"
        style={{ "--aw1": award.color1, "--aw2": award.color2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="award-trophy">{award.trophy}</div>

        <p className="award-unlocked-label">👏 MILESTONE REACHED! 👏</p>

        <div className="award-count-block">
          <span className="award-count-number">{award.count}</span>
          <span className="award-count-label">{award.title}</span>
        </div>

        <p className="award-name">🎉 Way to go, ADHI! 🎉</p>

        <p className="award-desc">
          {award.tagline} {award.emoji}
        </p>

        {/* Flag showcase */}
        {showcaseFlags.length > 0 && (
          <div className="award-flags-row">
            {showcaseFlags.map((f) => (
              <div key={f.id} className="award-flag-circle">
                <img
                  src={`https://flagcdn.com/w80/${f.code}.png`}
                  alt={f.name}
                  className="award-flag-img"
                />
              </div>
            ))}
          </div>
        )}

        <button
          className="award-close-btn"
          style={{
            background: `linear-gradient(135deg, ${award.color1}, ${award.color2})`,
            boxShadow: `0 6px 0 ${award.btnShadow}, 0 10px 20px rgba(0,0,0,0.2)`,
          }}
          onClick={onClose}
        >
          YAY! 👏 KEEP GOING!
        </button>
      </div>
    </div>
  );
}
