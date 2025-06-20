// Pikachu (Onet) path finding algorithm: check if two tiles can be connected with at most 3 straight lines (2 turns)
// Returns true if connectable, false otherwise
// grid: 2D array, 0 = empty, >0 = pokemon id
// (x1, y1), (x2, y2): coordinates of two tiles
export function canConnect(grid, x1, y1, x2, y2) {
  if (x1 === x2 && y1 === y2) return false;
  if (grid[y1][x1] !== grid[y2][x2] || grid[y1][x1] === 0) return false;

  const h = grid.length;
  const w = grid[0].length;

  // Helper: check if path from (x1, y1) to (x2, y2) is clear (no block)
  function isClear(x1, y1, x2, y2) {
    if (x1 === x2) {
      const [minY, maxY] = [Math.min(y1, y2), Math.max(y1, y2)];
      for (let y = minY + 1; y < maxY; y++) if (grid[y][x1] !== 0) return false;
      return true;
    }
    if (y1 === y2) {
      const [minX, maxX] = [Math.min(x1, x2), Math.max(x1, x2)];
      for (let x = minX + 1; x < maxX; x++) if (grid[y1][x] !== 0) return false;
      return true;
    }
    return false;
  }

  // 0 turn (liền kề)
  if ((x1 === x2 && Math.abs(y1 - y2) === 1) || (y1 === y2 && Math.abs(x1 - x2) === 1)) return true;
  if (isClear(x1, y1, x2, y2)) return true;

  // 1 turn
  if (
    grid[y1][x2] === 0 && isClear(x1, y1, x2, y1) && isClear(x2, y1, x2, y2)
  )
    return true;
  if (
    grid[y2][x1] === 0 && isClear(x1, y1, x1, y2) && isClear(x1, y2, x2, y2)
  )
    return true;

  // 2 turns
  for (let x = 0; x < w; x++) {
    if (
      grid[y1][x] === 0 &&
      isClear(x1, y1, x, y1) &&
      isClear(x, y1, x, y2) &&
      isClear(x, y2, x2, y2)
    )
      return true;
  }
  for (let y = 0; y < h; y++) {
    if (
      grid[y][x1] === 0 &&
      isClear(x1, y1, x1, y) &&
      isClear(x1, y, x2, y) &&
      isClear(x2, y, x2, y2)
    )
      return true;
  }
  return false;
}
