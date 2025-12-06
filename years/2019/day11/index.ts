import { down, fromPoint, left, mod, right, up, type Point } from "../../../utils";
import { IntCodeComputer } from "../intcode";

const Directions = ["N", "E", "S", "W"];

function parseInput(input: string): number[] {
  return input.split(",").map(Number);
}

function part1(program: number[]) {
  const computer = new IntCodeComputer(program);
  const panels: Record<string, number> = {};
  let colorToPaint = 0;
  let currentLocation: Point = { x: 0, y: 0 };
  let currentDirection: number = 0;
  let times = 0;

  while (true) {
    const { done } = computer.runProgram([colorToPaint]);
    if (done) {
      return times;
    }
    computer.runProgram([]);
    const [paint, direction] = computer.getProgramOutputs();
    if (panels[fromPoint(currentLocation)] !== undefined && paint === 1) {
      times++;
    } 
    panels[fromPoint(currentLocation)] = paint;
    currentDirection = direction === 0 ? mod(currentDirection - 1, Directions.length) : mod(currentDirection + 1, Directions.length);
    switch (Directions[currentDirection]) {
      case "N":
        currentLocation = up(currentLocation);
        break;
      case "E":
        currentLocation = right(currentLocation);
        break;
      case "S":
        currentLocation = down(currentLocation);
        break;
      case "W":
        currentLocation = left(currentLocation);
        break;
    }
    colorToPaint = panels[fromPoint(currentLocation)] ?? 0;
  }
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const program = parseInput(input);
  return {
    p1: () => part1(program),
    p2: () => {}
  };
}
