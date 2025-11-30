import { distance, gcd, Grid, type Point } from "../../../utils";

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

function getVisibleAsteroids(position: Point, asteroids: Point[]) {
  const groups: Record<string, Point[]> = {};
  asteroids.forEach((asteroid) => {
    const dx = position.x - asteroid.x;
    const dy = position.y - asteroid.y;
    if (dx === 0 && dy === 0) return;
    const divisor = gcd(dx, dy);
    const normalizedDx = dx / divisor;
    const normalizedDy = dy / divisor;
    const key = `${normalizedDx}|${normalizedDy}`;

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(asteroid);
  });
  return groups;
}

function part1(grid: Grid<string>) {
  const asteroids = grid.filter((item) => item === '#').points();
  const groups = asteroids.map((asteroid) => getVisibleAsteroids(asteroid, asteroids));
  return Math.max(...groups.map((g) => Object.keys(g).length));
}

function getAsteroidsToZap(position: Point, asteroids: Point[]) {
  const groups: Record<string, Point[]> = {};
  asteroids.forEach((asteroid) => {
    const dx = asteroid.x - position.x;
    const dy = asteroid.y - position.y;
    if (dx === 0 && dy === 0) return;
    const divisor = gcd(dx, dy);
    const normalizedDx = dx / divisor;
    const normalizedDy = dy / divisor;
    const key = `${normalizedDx}|${normalizedDy}`;

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(asteroid);
  });
  return groups;
}

function part2(grid: Grid<string>) {
  const asteroids = grid.filter((item) => item === '#').points();
  const groups: [Point, Record<string, Point[]>][] = asteroids.map((asteroid) => [asteroid, getVisibleAsteroids(asteroid, asteroids)]);
  let max = 0;
  let station: Point = { x: 0, y: 0 };
  for (const [asteroid, group] of groups) {
    if (max < Object.keys(group).length) {
      max = Object.keys(group).length;
      station = asteroid;
    }
  }

  const asteroidGroups = getAsteroidsToZap(station, asteroids);
  for (const group in asteroidGroups) {
    asteroidGroups[group]?.sort((a, b) => distance(a, station) - distance(b, station));
  }
  const sortedEntries = Object.entries(asteroidGroups)
    .map(([key, asteroids]) => {
      const [dx, dy] = key.split('|').map(Number);
      let angle = Math.atan2(dx!, -dy!);
      if (angle < 0) angle += 2 * Math.PI;
      return { key, asteroids, angle };
    })
    .filter(g => g.asteroids.length > 0)
    .toSorted((a, b) => a.angle - b.angle);

  let count = 0;
  while (true) {
    let somethingZapped = false;
    for (const group of sortedEntries) {
      if (group.asteroids.length === 0) continue;
      somethingZapped = true;
      const asteroid = group.asteroids.shift()!;
      count++;
      if (count === 200) {
        return asteroid.x * 100 + asteroid.y;
      }
  }
  if (!somethingZapped) break;
}
  return 5;
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const parsed = parseInput(input);
  return part2(parsed);
}
