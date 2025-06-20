import React from "react";
import Card from "./Card";
import "./Board.css";

export default function Board({ cards, flipped, matched, onCardClick }) {
  return (
    <div className="board">
      {cards.map((card, idx) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => onCardClick(idx)}
          isFlipped={flipped.includes(idx)}
          isMatched={matched.includes(idx)}
        />
      ))}
    </div>
  );
}
