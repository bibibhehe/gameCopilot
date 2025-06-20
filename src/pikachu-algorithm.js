// Pikachu (Onet) path finding algorithm: check if two tiles can be connected with at most 3 straight lines (2 turns)
// Returns true if connectable, false otherwise
// grid: 2D array, 0 = empty, >0 = pokemon id
// (x1, y1), (x2, y2): coordinates of two tiles
// Sửa triệt để: mở rộng lưới, BFS cho phép đi ra ngoài biên
export function canConnect(grid, x1, y1, x2, y2) {
  if (x1 === x2 && y1 === y2) return false;
  if (grid[y1][x1] !== grid[y2][x2] || grid[y1][x1] === 0) return false;
  const h = grid.length;
  const w = grid[0].length;
  // Tạo lưới mở rộng (bọc ngoài 1 lớp 0)
  const ext = Array.from({ length: h + 2 }, (_, y) =>
    Array.from({ length: w + 2 }, (_, x) =>
      y === 0 || y === h + 1 || x === 0 || x === w + 1 ? 0 : grid[y - 1][x - 1]
    )
  );
  // Tọa độ mới trên lưới mở rộng
  const sx = x1 + 1, sy = y1 + 1, ex = x2 + 1, ey = y2 + 1;
  // 4 hướng
  const dirs = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];
  // visited[y][x][turns][dir]: đã đi đến (x, y) với số lần rẽ và hướng dir chưa
  const visited = Array.from({ length: h + 2 }, () =>
    Array.from({ length: w + 2 }, () =>
      Array.from({ length: 3 }, () => Array(4).fill(false))
    )
  );
  // Hàng đợi: [x, y, turns, dir]
  const queue = [];
  // Bắt đầu từ 4 hướng tại điểm xuất phát
  for (let d = 0; d < 4; d++) {
    visited[sy][sx][0][d] = true;
    queue.push([sx, sy, 0, d]);
  }
  while (queue.length) {
    const [x, y, turns, dir] = queue.shift();
    let nx = x + dirs[dir][0];
    let ny = y + dirs[dir][1];
    let newTurns = turns;
    while (
      nx >= 0 && nx < w + 2 && ny >= 0 && ny < h + 2 &&
      (ext[ny][nx] === 0 || (nx === ex && ny === ey))
    ) {
      if (nx === ex && ny === ey && newTurns <= 2) return true;
      for (let nd = 0; nd < 4; nd++) {
        let nextTurns = nd === dir ? newTurns : newTurns + 1;
        if (nextTurns > 2) continue;
        if (!visited[ny][nx][nextTurns][nd]) {
          visited[ny][nx][nextTurns][nd] = true;
          queue.push([nx, ny, nextTurns, nd]);
        }
      }
      nx += dirs[dir][0];
      ny += dirs[dir][1];
    }
  }
  return false;
}
