import { partition, product, sum, type Point } from "../../../utils";

type Point3D = Point & {
  z: number;
};

function fromPoint3D(point: Point3D) {
  return `${point.x}|${point.y}|${point.z}`;
}

function parseInput(input: string) {
  return input.split("\n").map((line) => {
    const match = /(?<x>\d+),(?<y>\d+),(?<z>\d+)/g.exec(line);
    return { x: +match?.groups?.x!, y: +match?.groups?.y!, z: +match?.groups?.z! };
  });
}

function distance3D(p1: Point3D, p2: Point3D) {
  return Math.sqrt(
    sum([
      Math.pow((p2.x - p1.x), 2),
      Math.pow((p2.y - p1.y), 2),
      Math.pow((p2.z - p1.z), 2)
    ])
  );
}

type BoxDistance = {
  p1: string;
  p2: string;
  distance: number;
};

function toCircuits(distances: BoxDistance[], circuits: Set<string>[]) {
  const [distance, ...rest] = distances;
  if (!distance) return circuits;

  const [existingCircuits, otherCircuits] = partition(circuits, (circuit) => circuit.has(distance.p1) || circuit.has(distance.p2));
  if (existingCircuits.length > 1) {
    const mergedCircuits = existingCircuits.reduce((merged, circuit) => {
      return merged.union(circuit);
    }, new Set<string>());
    return toCircuits(rest, [mergedCircuits, ...otherCircuits]);
  }
  if (existingCircuits.length === 1) {
    existingCircuits[0].add(distance.p1);
    existingCircuits[0].add(distance.p2);
    return toCircuits(rest, circuits);
  }
  return toCircuits(rest, [...circuits, new Set([distance.p1, distance.p2])]);
}

function calculateBoxDistances(boxes: Point3D[]) {
  const distances: BoxDistance[] = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const distance = distance3D(boxes[i], boxes[j]);
      const p1 = fromPoint3D(boxes[i]);
      const p2 = fromPoint3D(boxes[j]);
      distances.push({ p1, p2, distance });
    }
  }
  return distances.toSorted((a, b) => a.distance - b.distance);
}

function toOneCircuit(distances: BoxDistance[], circuits: Set<string>[], size: number) {
  const [distance, ...rest] = distances;
  if (!distance) return distance;

  const [existingCircuits, otherCircuits] = partition(circuits, (circuit) => circuit.has(distance.p1) || circuit.has(distance.p2));
  if (existingCircuits.length > 1) {
    const mergedCircuits = existingCircuits.reduce((merged, circuit) => merged.union(circuit), new Set<string>());
    const newCircuits = [mergedCircuits, ...otherCircuits];
    if (otherCircuits.length === 0 && mergedCircuits.size === size) return distance;
    return toOneCircuit(rest, newCircuits, size);
  }
  if (existingCircuits.length === 1) {
    existingCircuits[0].add(distance.p1);
    existingCircuits[0].add(distance.p2);
    if (otherCircuits.length === 0 && existingCircuits[0].size === size) return distance;
    return toOneCircuit(rest, circuits, size);
  }
  return toOneCircuit(rest, [...circuits, new Set([distance.p1, distance.p2])], size);
}

function part1(boxes: Point3D[], numOfPairs: number) {
  const distances = calculateBoxDistances(boxes);
  const sortedDistances = distances.slice(0, numOfPairs);
  const circuits = toCircuits(sortedDistances, []);
  const circuitSizes = circuits.map((circuit) => circuit.size).toSorted((a, b) => b - a);
  return product(circuitSizes.slice(0, 3));
}

function part2(boxes: Point3D[]) {
  const distances = calculateBoxDistances(boxes);
  const cause = toOneCircuit(distances, [], boxes.length);
  const [x1] = cause.p1.split("|");
  const [x2] = cause.p2.split("|");
  return +x1 * +x2;
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const boxes = parseInput(input);
  return {
    p1: (numOfPairs: number) => part1(boxes, numOfPairs),
    p2: () => part2(boxes)
  };
}
