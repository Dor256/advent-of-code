import { fromPoint, Grid, type Point } from "../../../utils";

function parseInput(input: string): Grid<string> {
  const grid = new Grid<string>();
  const lines = input.split("\n");
  lines.forEach((line, row) => {
    const chars = line.split("");
    chars.forEach((char, col) => {
      grid.set({ x: col, y: row }, char)
    });
  });
  return grid;
}

function isReachable(grid: Grid<string>, point: Point) {
  const up = grid.up(point);
  const down = grid.down(point);
  const left = grid.left(point);
  const right = grid.right(point);
  const upRight = grid.up(right);
  const upLeft = grid.up(left);
  const downRight = grid.down(right);
  const downLeft = grid.down(left);

  return [
    up,
    down,
    left,
    right,
    upRight,
    upLeft,
    downRight,
    downLeft
  ]
    .map((point) => grid.get(point))
    .filter((item) => item === '@')
    .length < 4;

}

function part1(grid: Grid<string>) {
  const toiletPaperGrid = grid.filter((item) => item === '@');
  return toiletPaperGrid.points().filter((point) => isReachable(grid, point)).length;
}

function part2(grid: Grid<string>, removed: number) {
  const toiletPaperGrid = grid.filter((item) => item === '@');
  const reachableRolls = toiletPaperGrid.points().filter((point) => isReachable(grid, point));
  const reachableRollsStr = reachableRolls.map(fromPoint);
  if (reachableRolls.length === 0) {
    return removed;
  }
  const updatedGrid = grid.map((point, item) => reachableRollsStr.includes(fromPoint(point)) ? '.' : item);
  return part2(updatedGrid, removed + reachableRolls.length);
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const grid = parseInput(input);
  return {
    p1: () => part1(grid),
    p2: () => part2(grid, 0)
  };
}
