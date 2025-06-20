import { canConnect } from "./pikachu-algorithm";

describe("canConnect Pikachu/Onet", () => {
  it("should return false for same cell", () => {
    const grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    expect(canConnect(grid, 1, 1, 1, 1)).toBe(false);
  });

  it("should connect two adjacent cells (horizontal)", () => {
    const grid = [
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 0],
    ];
    expect(canConnect(grid, 1, 1, 2, 1)).toBe(true);
  });

  it("should connect two adjacent cells (vertical)", () => {
    const grid = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    expect(canConnect(grid, 1, 0, 1, 1)).toBe(true);
  });

  it("should connect with one turn (L shape)", () => {
    const grid = [
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ];
    expect(canConnect(grid, 1, 0, 2, 1)).toBe(true);
  });

  it("should connect with two turns (U shape)", () => {
    const grid = [
      [1, 0, 0, 1],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ];
    expect(canConnect(grid, 0, 0, 3, 0)).toBe(true);
  });

  it("should connect with two turns (Z shape)", () => {
    const grid = [
      [1, 0, 0, 0],
      [0, 2, 1, 0],
      [0, 0, 0, 0],
    ];
    expect(canConnect(grid, 0, 0, 2, 1)).toBe(true);
  });

  it("should not connect if blocked", () => {
    const grid = [
      [1, 2, 1],
      [0, 2, 0],
      [0, 0, 0],
    ];
    expect(canConnect(grid, 0, 0, 2, 0)).toBe(false);
  });

  it("should connect via border (go around)", () => {
    const grid = [
      [1, 2, 0, 0, 1],
      [0, 2, 2, 2, 0],
      [0, 0, 0, 0, 0],
    ];
    expect(canConnect(grid, 0, 0, 4, 0)).toBe(true);
  });
});
