import { invariant, sum } from "../../../utils";

type Range = {
  from: number;
  to: number;
};

function parseInput(input: string): [Range[], number[]] {
  const [rawRanges, rawIngredients] = input.split("\n\n");
  const ranges = rawRanges
    .split("\n")
    .map((rawRange) => {
      const [from, to] = rawRange.split("-");
      return { to: +to, from: +from };
    });
  const ingredients = rawIngredients.split("\n").map(Number);
  return [ranges, ingredients];
}

function isFresh(ingredient: number, ranges: Range[]) {
  return ranges.some((idRange) => ingredient >= idRange.from && ingredient <= idRange.to);
}

function part1(ranges: Range[], ingredients: number[]) {
  return ingredients.filter((ingredient) => isFresh(ingredient, ranges)).length
}

function mergeRanges(rangeA: Range, rangeB: Range): Range {
  const largestTo = Math.max(rangeA.to, rangeB.to);
  return { from: rangeA.from, to: largestTo };
}

function part2(ranges: Range[]) {
  const sortedRanges = ranges.toSorted((a, b) => a.from - b.from);
  const [first, ...rest] = sortedRanges;
  const nonOverlappingRanges = [first];
  for (const range of rest) {
    const lastNonOverlapping = nonOverlappingRanges.pop();
    invariant(lastNonOverlapping !== undefined, "No ranges");

    if (lastNonOverlapping.to < range.from) {
      nonOverlappingRanges.push(lastNonOverlapping, range);
    } else {
      const mergedRange = mergeRanges(lastNonOverlapping, range);
      nonOverlappingRanges.push(mergedRange);
    }
  }

  return sum(nonOverlappingRanges.map((range) => range.to - range.from + 1));
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const [ranges, ingredients] = parseInput(input);
  return {
    p1: () => part1(ranges, ingredients),
    p2: () => part2(ranges)
  };
}
