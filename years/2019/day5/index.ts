import { runProgram } from "../../../intcode";

function parseInput(input: string): number[] {
  return input.split(",").map(Number);
}

function part1(program: number[]) {
  return runProgram(program);
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const program = parseInput(input);
  return part1(program);
}
