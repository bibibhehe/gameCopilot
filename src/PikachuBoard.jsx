import React, { useState, useEffect } from "react";
import { canConnect } from "./pikachu-algorithm";
import "./PikachuBoard.css";

const ROWS = 10;
const COLS = 18;
const POKEMON_TYPES = 36; // Số loại hình khác nhau

function shuffle(arr) {
  return arr
    .map((v) => ({ v, s: Math.random() }))
    .sort((a, b) => a.s - b.s)
    .map(({ v }) => v);
}

function createGrid() {
  // Tạo mảng các cặp pokemon
  const total = (ROWS - 2) * (COLS - 2);
  const pairs = [];
  for (let i = 0; i < total / 2; i++) {
    const id = (i % POKEMON_TYPES) + 1;
    pairs.push(id, id);
  }
  const shuffled = shuffle(pairs);
  // Tạo lưới có viền 0 (để dễ kiểm tra đường đi ra ngoài)
  const grid = Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) =>
      y === 0 || y === ROWS - 1 || x === 0 || x === COLS - 1 ? 0 : shuffled.pop()
    )
  );
  return grid;
}

export default function PikachuBoard() {
  const [grid, setGrid] = useState(createGrid());
  const [selected, setSelected] = useState([]); // [{x, y}]
  const [removed, setRemoved] = useState([]); // [{x, y}]
  const [score, setScore] = useState(0);

  // Click handler
  const handleClick = (x, y) => {
    if (grid[y][x] === 0) return;
    if (selected.length === 0) {
      setSelected([{ x, y }]);
    } else if (selected.length === 1) {
      const [first] = selected;
      if (first.x === x && first.y === y) return;
      if (grid[first.y][first.x] !== grid[y][x]) {
        setSelected([{ x, y }]);
        return;
      }
      if (canConnect(grid, first.x, first.y, x, y)) {
        // Remove both tiles
        const newGrid = grid.map((row, j) =>
          row.map((cell, i) =>
            (i === first.x && j === first.y) || (i === x && j === y) ? 0 : cell
          )
        );
        setGrid(newGrid);
        setRemoved((r) => [...r, first, { x, y }]);
        setScore((s) => s + 1);
        setSelected([]);
      } else {
        setSelected([]);
      }
    }
  };

  // Render cell
  const renderCell = (cell, x, y) => {
    if (cell === 0) return <div key={x} className="cell empty" />;
    const isSelected = selected.some((s) => s.x === x && s.y === y);
    return (
      <div
        key={x}
        className={`cell${isSelected ? " selected" : ""}`}
        onClick={() => handleClick(x, y)}
        tabIndex={0}
      >
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${cell}.png`}
          alt={"pokemon-" + cell}
        />
      </div>
    );
  };

  return (
    <div className="pikachu-container">
      <h2>Pikachu (Onet) Game - Pokemon Edition</h2>
      <div className="score">Score: {score}</div>
      <div className="pikachu-board">
        {grid.map((row, y) =>
          row.map((cell, x) => renderCell(cell, x, y))
        )}
      </div>
      <button className="restart-btn" onClick={() => window.location.reload()}>
        Restart
      </button>
    </div>
  );
}
