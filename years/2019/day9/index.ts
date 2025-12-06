import { IntCodeComputer } from "../intcode";

function parseInput(input: string) {
  return input.split(",").map(Number);
}

function part1(program: number[], inputs: number[] = []) {
  const computer = new IntCodeComputer(program);
  while (true) {
    const { done } = computer.runProgram(inputs);
    if (done) return computer.getProgramOutputs();
  }
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const program = parseInput(input);
  return {
    p1: (inputs: number[] = []) => part1(program, inputs),
    p2: () => part1(program, [2])
  };
}
