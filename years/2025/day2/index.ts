import { range, sumIf } from "../../../utils";

function parseInput(input: string): number[][] {
  return input.split(",").map((item) => item.split("-").map(Number));
};

function part1(ranges: number[][], regex: RegExp): number {
  return ranges.reduce((acc, [from, to]) => acc + sumIf(range(from, to), (id) => regex.test(id.toString())), 0);
}

function part2(ranges: number[][]): number {
  return part1(ranges, /^(\d+)\1+$/);
};

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const ranges = parseInput(input);

  part1(ranges, /^(\d+)\1$/);
  return part2(ranges);
}