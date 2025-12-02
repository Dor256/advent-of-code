export type Point = {
  x: number;
  y: number;
};

export class Grid<T> {
  private map: Map<string, T>;
  constructor() {
    this.map = new Map<string, T>();
  }

  get(point: Point) {
    const key = fromPoint(point);
    return this.map.get(key);
  }

  set(point: Point, value: T) {
    const key = fromPoint(point);
    return this.map.set(key, value)
  }

  filter(predicate: (item: T) => boolean): Grid<T> {
    const entries = this.map.entries();
    const newGrid = new Grid<T>();
    for (const [key, element] of entries) {
      if (predicate(element)) {
        newGrid.set(toPoint(key), element);
      }
    }
    return newGrid;
  }

  values(): T[] {
    return this.map.values().toArray()
  }

  points(): Point[] {
    return this.map
      .keys()
      .map(toPoint)
      .toArray()
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
