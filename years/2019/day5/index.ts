import { IntCodeComputer } from "../intcode";

function parseInput(input: string): number[] {
  return input.split(",").map(Number);
}

function part1(program: number[], input: number) {
  const computer = new IntCodeComputer(program);
  while (true) {
    const { done } = computer.runProgram([input]);
    if (done) return computer.getProgramOutputs().at(-1);
  }
}

function part2(program: number[]) {
  return part1(program, 5);
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const program = parseInput(input);
  return part1(program, 1);
  // return part2(program);
}
