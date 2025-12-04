import { IntCodeComputer } from "../intcode";

function parseInput(input: string): number[] {
  return input.split(",").map(Number);
}

function part1(program: number[]) {
  const computer = new IntCodeComputer(program.with(1, 12).with(2, 2));
  const result = computer.runProgram([]);
  return result.program[0];
}

function part2(program: number[]) {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const computer = new IntCodeComputer(program.with(1, noun).with(2, verb));
      const result = computer.runProgram([]);
      if (result.program[0] === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
}


export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const program = parseInput(input);
  return part1(program);
}
