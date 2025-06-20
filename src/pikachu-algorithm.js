// Pikachu (Onet) path finding algorithm: check if two tiles can be connected with at most 3 straight lines (2 turns)
// Returns true if connectable, false otherwise
// grid: 2D array, 0 = empty, >0 = pokemon id
// (x1, y1), (x2, y2): coordinates of two tiles
// Thuật toán BFS kiểm tra mọi đường đi hợp lệ (chữ I, L, U, Z), cho phép đi qua viền ngoài
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
    Array.from({ length: w }, () => Array(3).fill(false))
  );
  // Hàng đợi: [x, y, turns, prevDir]
  const queue = [];
  queue.push([x1, y1, 0, -1]);
  while (queue.length) {
    const [x, y, turns, prevDir] = queue.shift();
    // Nếu đã vượt quá 2 lần rẽ thì bỏ qua
    if (turns > 2) continue;
    // Đến đích
    if (x === x2 && y === y2) return true;
    for (let d = 0; d < 4; d++) {
      let nx = x + dirs[d][0];
      let ny = y + dirs[d][1];
      // Nếu đổi hướng thì tăng turns
      let newTurns = prevDir === -1 || prevDir === d ? turns : turns + 1;
      // Duyệt liên tục theo hướng d
      while (
        nx >= 0 && nx < w && ny >= 0 && ny < h &&
        (grid[ny][nx] === 0 || (nx === x2 && ny === y2))
      ) {
        if (!visited[ny][nx][newTurns]) {
          visited[ny][nx][newTurns] = true;
          queue.push([nx, ny, newTurns, d]);
        }
        // Nếu đã đến đích
        if (nx === x2 && ny === y2) break;
        nx += dirs[d][0];
        ny += dirs[d][1];
      }
    }
  }
  return false;
}
