import { useState } from "react";

export default function ContinentCard({ continent, onClick }) {
  const [imgError, setImgError] = useState(false);
  const flagUrl = `https://flagcdn.com/w320/${continent.flagCode}.png`;

  return (
    <div className="continent-card" onClick={() => onClick(continent)}>
      <div
        className="flag-circle-wrapper"
        style={{
          "--card-color": continent.color,
          "--card-shadow": continent.shadowColor,
        }}
      >
        <div className="flag-circle-outer">
          <div className="flag-circle-inner">
            {imgError ? (
              <div className="flag-fallback">{continent.emoji}</div>
            ) : (
              <img
                src={flagUrl}
                alt={`${continent.flagCountry} flag`}
                className="flag-img"
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>
        <div className="flag-stars">
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
        </div>
      </div>
      <div
        className="continent-name-badge"
        style={{ background: continent.color }}
      >
        {continent.name}
      </div>
    </div>
  );
}
