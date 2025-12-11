import { type Point } from "../../../utils";

type Rect = {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  area: number;
};

function parseInput(input: string) {
  return input.split("\n").map((line) => {
    const [x, y] = line.split(",").map(Number);
    return { x, y };
  });
}

function rectArea(pointA: Point, pointB: Point) {
  const dx = Math.abs(pointB.x - pointA.x) + 1;
  const dy = Math.abs(pointB.y - pointA.y) + 1;
  return dx * dy;
}

function getRects(tiles: Point[]): Rect[] {
  const squares: Rect[] = [];
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const tileA = tiles[i];
      const tileB = tiles[j];
      const maxX = Math.max(tileA.x, tileB.x);
      const maxY = Math.max(tileA.y, tileB.y);
      const minX = Math.min(tileA.x, tileB.x);
      const minY = Math.min(tileA.y, tileB.y);
      squares.push({
        maxX,
        maxY,
        minX,
        minY,
        area: rectArea(tileA, tileB)
      });
    }
  }
  return squares.toSorted((a, b) => b.area - a.area);
}

function part1(tiles: Point[]) {
  const squares = getRects(tiles);
  return squares[0].area;
}

function intersects(rect: Rect, edges: Point[][]) {
  for (const [{ x: x1, y: y1 }, { x: x2, y: y2 }] of edges) {
    const edgeMinX = Math.min(x1, x2);
    const edgeMaxX = Math.max(x1, x2);
    const edgeMinY = Math.min(y1, y2);
    const edgeMaxY = Math.max(y1, y2);

    if (
      rect.minX < edgeMaxX &&
      rect.maxX > edgeMinX &&
      rect.minY < edgeMaxY &&
      rect.maxY > edgeMinY
    ) {
      return true;
    }
  }
  return false;
}

function part2(tiles: Point[]) {
  const rects = getRects(tiles);
  const edges = tiles.map((tile, i) => [tile, tiles[i + 1] === undefined ? tiles[0] : tiles[i + 1]]);
  return rects.find((square) => !intersects(square, edges))?.area;
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const redTiles = parseInput(input);
  return {
    p1: () => part1(redTiles),
    p2: () => part2(redTiles)
  };
}
