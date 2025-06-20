import React, { useState, useEffect } from "react";
import { canConnect } from "./pikachu-algorithm";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import PlayerForm from "./PlayerForm";
import Leaderboard from "./Leaderboard";
import "./PikachuBoard.css";

const LEVELS = [
  { rows: 6, cols: 8, types: 8, time: 60 },
  { rows: 8, cols: 12, types: 16, time: 80 },
  { rows: 10, cols: 18, types: 36, time: 120 },
  { rows: 12, cols: 20, types: 48, time: 150 },
  { rows: 14, cols: 24, types: 72, time: 180 },
  { rows: 16, cols: 28, types: 100, time: 210 },
  { rows: 18, cols: 32, types: 128, time: 240 },
  { rows: 20, cols: 36, types: 160, time: 270 },
  { rows: 22, cols: 40, types: 200, time: 300 },
  { rows: 24, cols: 44, types: 256, time: 360 },
];

function shuffle(arr) {
  return arr
    .map((v) => ({ v, s: Math.random() }))
    .sort((a, b) => a.s - b.s)
    .map(({ v }) => v);
}

function createGrid({ rows, cols, types }) {
  const total = (rows - 2) * (cols - 2);
  const pairs = [];
  for (let i = 0; i < total / 2; i++) {
    const id = (i % types) + 1;
    pairs.push(id, id);
  }
  const shuffled = shuffle(pairs);
  const grid = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) =>
      y === 0 || y === rows - 1 || x === 0 || x === cols - 1 ? 0 : shuffled.pop()
    )
  );
  return grid;
}

export default function PikachuBoard() {
  const [player, setPlayer] = useState(null);
  const [level, setLevel] = useState(0);
  const [grid, setGrid] = useState(null);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVELS[0].time);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [cellStatus, setCellStatus] = useState({}); // {"x-y": "correct"|"wrong"}

  useEffect(() => {
    if (player) {
      setGrid(createGrid(LEVELS[level]));
      setScore(0);
      setSelected([]);
      setTimeLeft(LEVELS[level].time);
      setGameOver(false);
      setWin(false);
      setStartTime(Date.now());
    }
  }, [player, level]);

  useEffect(() => {
    if (!player || gameOver || win) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, player, gameOver, win]);

  const handleClick = (x, y) => {
    if (!grid || grid[y][x] === 0 || gameOver || win) return;
    if (selected.length === 0) {
      setSelected([{ x, y }]);
    } else if (selected.length === 1) {
      const [first] = selected;
      if (first.x === x && first.y === y) return;
      if (grid[first.y][first.x] !== grid[y][x]) {
        setCellStatus({ [`${x}-${y}`]: "wrong", [`${first.x}-${first.y}`]: "wrong" });
        setTimeout(() => setCellStatus({}), 400);
        setSelected([{ x, y }]);
        return;
      }
      if (canConnect(grid, first.x, first.y, x, y)) {
        setCellStatus({ [`${x}-${y}`]: "correct", [`${first.x}-${first.y}`]: "correct" });
        setTimeout(() => setCellStatus({}), 400);
        const newGrid = grid.map((row, j) =>
          row.map((cell, i) =>
            (i === first.x && j === first.y) || (i === x && j === y) ? 0 : cell
          )
        );
        setGrid(newGrid);
        setScore((s) => s + 1);
        setSelected([]);
      } else {
        setCellStatus({ [`${x}-${y}`]: "wrong", [`${first.x}-${first.y}`]: "wrong" });
        setTimeout(() => setCellStatus({}), 400);
        setSelected([]);
      }
    }
  };

  useEffect(() => {
    if (gameOver) audioRefs.lose.current && audioRefs.lose.current.play();
    if (win) audioRefs.win.current && audioRefs.win.current.play();
  }, [gameOver, win]);

  useEffect(() => {
    if (!grid || gameOver || win) return;
    // Check win
    if (grid.flat().every((cell) => cell === 0)) {
      setWin(true);
      const timeUsed = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
      addDoc(collection(db, "leaderboard"), {
        name: player,
        level: level + 1,
        score,
        time: timeUsed,
        created: serverTimestamp(),
      });
    }
  }, [grid, gameOver, win, player, level, score, startTime]);

  const handleRestart = () => {
    setGrid(createGrid(LEVELS[level]));
    setScore(0);
    setSelected([]);
    setTimeLeft(LEVELS[level].time);
    setGameOver(false);
    setWin(false);
    setStartTime(Date.now());
  };

  if (!player) return <PlayerForm onSubmit={setPlayer} />;

  return (
    <div className="pikachu-container">
      <h2>Pikachu (Onet) Game - Pokemon Edition</h2>
      <div className="score">Level: {level + 1} | Score: {score} | Thời gian: {timeLeft}s</div>
      <Leaderboard level={level + 1} />
      {gameOver && <div className="win-message">Hết thời gian! <button onClick={handleRestart}>Chơi lại</button></div>}
      {win && (
        <div className="win-message">
          🎉 Hoàn thành level {level + 1}! <button onClick={() => setLevel((l) => Math.min(l + 1, LEVELS.length - 1))}>Tiếp tục</button>
        </div>
      )}
      <div className="pikachu-board">
        {grid &&
          grid.map((row, y) =>
            row.map((cell, x) => {
              if (cell === 0) return <div key={x + "-" + y} className="cell empty" />;
              const isSelected = selected.some((s) => s.x === x && s.y === y);
              const status = cellStatus[`${x}-${y}`];
              return (
                <div
                  key={x + "-" + y}
                  className={`cell${isSelected ? " selected" : ""}${status ? ` ${status}` : ""}`}
                  onClick={() => handleClick(x, y)}
                  tabIndex={0}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${cell}.png`}
                    alt={"pokemon-" + cell}
                  />
                </div>
              );
            })
          )}
      </div>
      <button className="restart-btn" onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
}
