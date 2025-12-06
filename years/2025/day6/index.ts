import { invariant, isNumeric, sum, takeWhile } from "../../../utils";

type ArithmeticSign = '+' | '*';

function parsePart1(input: string) {
  const problems: string[][] = [];
  input.split("\n").forEach((line) => {
    const splitLine = line.trim().split(/\s+/);
    splitLine.forEach((arg, idx) => {
      if (problems[idx]) {
        problems[idx].push(arg);
      } else {
        problems[idx] = [arg];
      }
    });
  });
  return problems;
}

function calculate(argumentA: number, arugmentB: number, sign: ArithmeticSign) {
  switch (sign) {
    case '*':
      return argumentA * arugmentB;
    case '+':
      return argumentA + arugmentB;
  }
}

function part1(input: string) {
  const problems = parsePart1(input);
  const solutions = problems.map((problem) => {
    const sign = problem.pop();
    invariant(sign === '*' || sign === '+', "Invalid math sign!");
    return problem.reduce((total, argument) => calculate(total, +argument, sign), sign === '*' ? 1 : 0);
  })
  return sum(solutions);
}

function parsePart2(input: string) {
  const lines = input.split("\n");
  const problems: string[] = [];
  for (let i = 0; i < lines[0].length; i++) {
    const sign = lines.at(-1)?.[i];
    if (sign === '+' || sign === '*') problems.push(sign);
    const number = lines.reduce((acc, line) => isNumeric(line[i]) ? acc + line[i] : acc, "");
    if (number.trim() !== "") problems.push(number.trim());
  }
  return problems;
}

function part2(input: string) {
  const problems = parsePart2(input);
  return problems.reduce((grandTotal, item, i) => {
    if (item === '+' || item === '*') {
      const calculation = takeWhile(problems.slice(i + 1), isNumeric);
      return grandTotal + calculation.reduce((subTotal, number) => calculate(subTotal, +number, item), item === '*' ? 1 : 0);
    }
    return grandTotal;
  }, 0);
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  return {
    p1: () => part1(input),
    p2: () => part2(input)
  };
}
