import React from "react";
import "./Card.css";

export default function Card({ card, onClick, isFlipped, isMatched }) {
  return (
    <div
      className={`card${isFlipped || isMatched ? " flipped" : ""}`}
      onClick={onClick}
      tabIndex={0}
      aria-label={isMatched ? "Matched card" : "Card"}
      role="button"
    >
      <div className="card-inner">
        <div className="card-front"></div>
        <div className="card-back">
          <img src={card.image} alt={card.name} />
        </div>
      </div>
    </div>
  );
}
