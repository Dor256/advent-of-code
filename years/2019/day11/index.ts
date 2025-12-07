import { down, fromPoint, Grid, left, mod, right, up, type Point } from "../../../utils";
import { IntCodeComputer } from "../intcode";

const Directions = ["N", "E", "S", "W"];

function parseInput(input: string): number[] {
  return input.split(",").map(Number);
}

function turn(robotDirection: number, turnInstruction: number) {
  return (
    turnInstruction === 0
      ? mod(robotDirection - 1, Directions.length)
      : mod(robotDirection + 1, Directions.length)
  );
}

function move(direction: number, location: Point) {
  switch (Directions[direction]) {
      case "N":
        return up(location);
      case "E":
        return right(location);
      case "S":
        return down(location);
      case "W":
        return left(location);
      default:
        throw Error("Invalid dir");
    }
}

function part1(program: number[]) {
  const computer = new IntCodeComputer(program);
  const panels: Record<string, number> = {};
  let colorToPaint = 0;
  let currentLocation: Point = { x: 0, y: 0 };
  let currentDirection: number = 0;
  let paintCount = 0;

  while (true) {
    computer.runProgram([colorToPaint]);
    const { done } = computer.runProgram([]);
    const [paint, direction] = computer.getProgramOutputs();
    if (panels[fromPoint(currentLocation)] === undefined && paint === 1) paintCount++;
    if (done) return paintCount;

    panels[fromPoint(currentLocation)] = paint;
    currentDirection = turn(currentDirection, direction);
    currentLocation = move(currentDirection, currentLocation);
    colorToPaint = panels[fromPoint(currentLocation)] ?? 0;
  }
}

function part2(program: number[]) {
  const computer = new IntCodeComputer(program);
  let colorToPaint = 1;
  let currentLocation: Point = { x: 0, y: 0 };
  let currentDirection: number = 0;
  const grid = new Grid<string>();

  while (true) {
    computer.runProgram([colorToPaint]);
    const { done } = computer.runProgram([]);
    const [paint, direction] = computer.getProgramOutputs();
    grid.set(currentLocation, paint === 1 ? "#" : ".")
    if (done) {
      grid.print(".");
      return grid;
    }
    currentDirection = turn(currentDirection, direction);
    currentLocation = move(currentDirection, currentLocation);
    colorToPaint = (grid.get(currentLocation) ?? ".") === "#" ? 0 : 1;
  }
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const program = parseInput(input);
  return {
    p1: () => part1(program),
    p2: () => part2(program)
  };
}
