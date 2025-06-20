import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function Leaderboard({ level }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("level", "asc"),
      orderBy("score", "desc"),
      orderBy("time", "asc"),
      limit(20)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setScores(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsub();
  }, [level]);

  return (
    <div className="leaderboard">
      <h3>Bảng xếp hạng</h3>
      <table>
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Tên</th>
            <th>Level</th>
            <th>Điểm</th>
            <th>Thời gian (s)</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{s.name}</td>
              <td>{s.level}</td>
              <td>{s.score}</td>
              <td>{s.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
