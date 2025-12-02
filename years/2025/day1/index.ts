import { mod } from "../../../utils";

type Instruction = {
  direction: string;
  iterations: number;
};

function parseInput(input: string): Instruction[] {
  return input
    .split("\n")
    .map((instruction) => instruction.match(/(?<direction>.)(?<iterations>\d+)/)?.groups)
    .map((instruction) => instruction && ({ ...instruction, iterations: +instruction.iterations }))
    .filter((item): item is Instruction => !!item)
}
 

function part1(instructions: Instruction[]) {
  const numbers = 100;
  let dial = 50;
  let timesAtZero = 0;
  for (const { direction, iterations } of instructions) {
    switch (direction) {
      case "L":
        const res = dial - iterations;
        if (res < 0) {
          dial = mod(res, numbers);
        } else {
          dial = mod(res, numbers);
        }
        if (dial === 0) timesAtZero++;
        break;
      case "R":
        dial = mod((dial + iterations), numbers);
        if (dial === 0) timesAtZero++;
        break;
    }
  }
  return timesAtZero;
}

function part2(instructions: Instruction[]) {
  const numbers = 100;
  let dial = 50;
  let timesAtZero = 0;
  for (const { direction, iterations } of instructions) {
    const rotations = Math.floor(iterations / numbers);
    const remainder = iterations - (rotations * numbers);
    const res = direction === "R" ? (dial + remainder) : (dial - remainder)
    timesAtZero += rotations;
    
    if (dial !== 0 && res <= 0 || res > 99) {
      timesAtZero++;
    }
    dial = mod(res, numbers);
  }
  return timesAtZero;
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const parsed = parseInput(input);
  return part2(parsed);
}