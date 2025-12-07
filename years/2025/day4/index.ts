import { down, fromPoint, Grid, left, right, up, type Point } from "../../../utils";

function parseInput(input: string): Grid<string> {
  return Grid.fromString(input);
}

function isReachable(grid: Grid<string>, point: Point) {
  return [
    up(point),
    down(point),
    left(point),
    right(point),
    up(right(point)),
    up(left(point)),
    down(right(point)),
    down(right(point))
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
