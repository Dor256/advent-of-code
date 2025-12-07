import { down, fromPoint, Grid, invariant, left, right, toPoint, type Point } from "../../../utils";

function parseInput(input: string) {
  return Grid.fromString(input);
};

function endOfManifold(beams: Set<string>, grid: Grid<string>) {
  const manifoldBottom = grid.rowSize();
  return Array.from(beams).some((key) => toPoint(key).y === manifoldBottom);
}

function shootBeams(beams: Set<string>, grid: Grid<string>, total = 0): number {
  for (const beam of beams) {
    const point = toPoint(beam);
    const next = down(point);
    if (grid.get(next) === "^") {
      const leftBeam = left(next);
      const rightBeam = right(next);
      beams.add(fromPoint(leftBeam));
      beams.add(fromPoint(rightBeam));
      total++;
    } else if (grid.get(next) === ".") {
      beams.delete(beam);
      beams.add(fromPoint(next));
    }
  }
  if (endOfManifold(beams, grid)) return total;
  return shootBeams(beams, grid, total + 1);
}

function part1(grid: Grid<string>) {
  const start = grid.find((_, val) => val === "S");
  invariant(start !== undefined, "No starting point");
  return shootBeams(new Set([fromPoint(start[0])]), grid);
}

function findTimelines(beam: Point, grid: Grid<string>, visited: Map<string, number>): number {
  const key = fromPoint(beam);
  const previous = visited.get(fromPoint(beam));
  if (previous !== undefined) return previous;
  const next = down(beam);
  let result: number = 1;
  if (grid.get(next) === "^") {
    const leftBeam = findTimelines(left(next), grid, visited);
    const rightBeam = findTimelines(right(next), grid, visited);
    result = leftBeam + rightBeam;
  }
  if (grid.get(next) === ".") {
    result = findTimelines(next, grid, visited);
  }
  visited.set(key, result);
  return result;
}

function part2(grid: Grid<string>) {
  const start = grid.find((_, val) => val === "S");
  invariant(start !== undefined, "No starting point");
  return findTimelines(start[0], grid, new Map());
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const grid = parseInput(input);
  return {
    p1: () => part1(grid),
    p2: () => part2(grid)
  };
}
