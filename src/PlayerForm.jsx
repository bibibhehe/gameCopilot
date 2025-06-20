import React, { useState } from "react";

export default function PlayerForm({ onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <form className="player-form" onSubmit={handleSubmit}>
      <label htmlFor="player-name">Nhập tên của bạn:</label>
      <input
        id="player-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={20}
        required
        autoFocus
      />
      <button type="submit">Bắt đầu</button>
    </form>
  );
}
