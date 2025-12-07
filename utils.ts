export type Point = {
  x: number;
  y: number;
};

export function up(point: Point): Point {
  return { ...point, y: point.y - 1 };
}

export function down(point: Point): Point {
  return { ...point, y: point.y + 1 };
}

export function right(point: Point): Point {
  return { ...point, x: point.x + 1 };
}

export function left(point: Point): Point {
  return { ...point, x: point.x - 1 };
}

export class Grid<T> {
  private hashMap: Map<string, T>;
  private numOfCols: number;
  private numOfRows: number;
  constructor() {
    this.hashMap = new Map<string, T>();
    this.numOfCols = 0;
    this.numOfRows = 0;
  }

  static fromString(input: string): Grid<string> {
    return input
      .split("\n")
      .reduce((grid, rows, row) => {
        rows.split("").forEach((val, col) => {
          grid.set({ x: col, y: row }, val);
        });
        return grid;
      }, new Grid<string>());
  }

  get(point: Point) {
    const key = fromPoint(point);
    return this.hashMap.get(key);
  }

  set(point: Point, value: T) {
    const key = fromPoint(point);
    return this.hashMap.set(key, value)
  }

  filter(predicate: (item: T) => boolean): Grid<T> {
    const entries = this.hashMap.entries();
    const newGrid = new Grid<T>();
    for (const [key, element] of entries) {
      if (predicate(element)) {
        newGrid.set(toPoint(key), element);
      }
    }
    return newGrid;
  }

  map<R>(mapper: (point: Point, item: T) => R): Grid<R> {
    const newGrid = new Grid<R>();
    for (const [point, val] of this.hashMap) {
      newGrid.set(toPoint(point), mapper(toPoint(point), val));
    }
    return newGrid;
  }

  find(predicate: (point: Point, item: T) => boolean): [Point, T] | undefined {
    for (const [pointKey, val] of this.hashMap) {
      const point = toPoint(pointKey);
      if (predicate(point, val)) return [point, val];
    }
  }

  values(): T[] {
    return this.hashMap.values().toArray()
  }

  points(): Point[] {
    return this.hashMap
      .keys()
      .map(toPoint)
      .toArray()
  }

  rowSize(): number {
    if (this.numOfRows) {
      return this.numOfRows;
    }
    this.numOfRows = Math.max(...this.points().map(({ y }) => y));
    return this.numOfRows;
  }

  colSize(): number {
    if (this.numOfCols) {
      return this.numOfCols;
    }
    this.numOfCols = Math.max(...this.points().map(({ x }) => x));
    return this.numOfCols;
  }

  print() {
    this.hashMap.forEach((item, pointStr) => {
      const point = toPoint(pointStr);
      if (point.x === 0) console.log();
      console.write(item as string);
    });
    console.log();
  }
}

export function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

export function fromPoint(point: Point): `${number}|${number}` {
  return `${point.x}|${point.y}`;
}

export function toPoint(key: string): Point {
  const [x, y] = key.split("|");
  if (!x || !y) throw Error("Invalid string!");

  return { x: +x, y: +y };
}

export function gcd(a: number, b: number): number {
  const absA = Math.abs(a);
  const absB = Math.abs(b);
  if (absB === 0) {
    return absA;
  }
  return gcd(absB, absA % absB);
}

export function distance(pointA: Point, pointB: Point): number {
  return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw Error(message);
  }
}

export function zip<T, R>(arr1: T[], arr2: R[]): [T, R][] {
  return arr1.map((item, idx) => [item, arr2[idx]]);
}

export function range(from: number, to: number, inclusive: boolean = true): number[] {
  return Array.from({ length: to - from + (inclusive ? 1 : 0) }).map((_, idx) => idx + from);
}

export function sumIf(arr: number[], predicate: (item: number) => boolean): number {
  return arr.reduce((acc, item) => predicate(item) ? acc + item : acc, 0);
}

export function sum(arr: number[]): number {
  return sumIf(arr, () => true);
}

export function permutations(arr: number[]): number[][] {
  if (arr.length === 0) return [[]];

  return arr.flatMap((v, i) =>
    permutations(arr.filter((_, idx) => idx !== i)).map(p => [v, ...p])
  );
}

export function transpose<T>(arr: T[][]): T[][] {
  return arr[0].map((_, i) => arr.map((row) => row[i]));
}

export function takeWhile<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  const [item, ...rest] = arr;
  if (predicate(item)) {
    return [item, ...takeWhile(rest, predicate)];
  }
  return [];
}

export function isNumeric(str: string): boolean {
  return !Number.isNaN(Number(str));
}
