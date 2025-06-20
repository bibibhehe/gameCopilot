// Pikachu (Onet) path finding algorithm: check if two tiles can be connected with at most 3 straight lines (2 turns)
// Returns true if connectable, false otherwise
// grid: 2D array, 0 = empty, >0 = pokemon id
// (x1, y1), (x2, y2): coordinates of two tiles
// Nâng cấp thuật toán: BFS kiểm tra tối đa 2 lần rẽ (3 đoạn thẳng), cho phép đi qua viền ngoài
export function canConnect(grid, x1, y1, x2, y2) {
  if (x1 === x2 && y1 === y2) return false;
  if (grid[y1][x1] !== grid[y2][x2] || grid[y1][x1] === 0) return false;
  const h = grid.length;
  const w = grid[0].length;
  // 4 hướng
  const dirs = [
    [0, 1], // xuống
    [1, 0], // phải
    [0, -1], // lên
    [-1, 0], // trái
  ];
  // visited[y][x][turns]: đã đi đến (x, y) với số lần rẽ là turns chưa
  const visited = Array.from({ length: h }, () =>
    Array.from({ length: w }, () => Array(4).fill(false))
  );
  // Hàng đợi: [x, y, hướng, turns]
  const queue = [];
  // Bắt đầu từ 4 hướng tại (x1, y1)
  for (let d = 0; d < 4; d++) {
    queue.push([x1, y1, d, 0]);
    visited[y1][x1][d] = true;
  }
  while (queue.length) {
    const [x, y, dir, turns] = queue.shift();
    let nx = x + dirs[dir][0];
    let ny = y + dirs[dir][1];
    // Duyệt liên tục theo hướng dir
    while (
      nx >= 0 && nx < w && ny >= 0 && ny < h &&
      (grid[ny][nx] === 0 || (nx === x2 && ny === y2))
    ) {
      if (nx === x2 && ny === y2 && turns <= 2) return true;
      for (let nd = 0; nd < 4; nd++) {
        if (nd === dir) continue;
        if (turns + 1 > 2) continue;
        if (!visited[ny][nx][nd]) {
          visited[ny][nx][nd] = true;
          queue.push([nx, ny, nd, turns + 1]);
        }
      }
      nx += dirs[dir][0];
      ny += dirs[dir][1];
    }
  }
  return false;
}
