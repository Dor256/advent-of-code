import { invariant, permutations, range } from "../../../utils";
import { runProgram } from "../intcode";

function parseInput(input: string): number[] {
  return input.split(",").map(Number);
}

function part1(program: number[]) {
  const outputSignals: number[] = []
  const outputs: number[] = [];
  const outputSignal = (arg: number) => outputs.push(arg);
  const settings = permutations(range(0, 4));
  for (const [a, b, c ,d, e] of settings) {
    runProgram(program, [a, 0], outputSignal);
    const thrusterAOutput = outputs.shift();
    invariant(thrusterAOutput !== undefined, "Output A doesn't exist!");

    runProgram(program, [b, thrusterAOutput], outputSignal);
    const thrusterBOutput = outputs.shift();
    invariant(thrusterBOutput !== undefined, "Output B doesn't exist!");

    runProgram(program, [c, thrusterBOutput], outputSignal);
    const thrusterCOutput = outputs.shift();
    invariant(thrusterCOutput !== undefined, "Output C doesn't exist!");

    runProgram(program, [d, thrusterCOutput], outputSignal);
    const thrusterDOutput = outputs.shift();
    invariant(thrusterDOutput !== undefined, "Output D doesn't exist!");

    runProgram(program, [e, thrusterDOutput], outputSignal);
    const thrusterEOutput = outputs.shift();
    invariant(thrusterEOutput !== undefined, "Output E doesn't exist!");

    outputSignals.push(thrusterEOutput);
  }

  return Math.max(...outputSignals);
}

function part2(program: number[]) {
  const outputSignals: number[] = []
  const outputs: number[] = [];
  const outputSignal = (arg: number) => outputs.push(arg);
  const settings = permutations(range(5, 9));
  let inputs: number[] = [0];

  for (const [a, b, c ,d, e] of settings) {
    while (inputs.length > 0) {
      const input = inputs.pop();
      console.log("IN", input);
      runProgram(program, [a, input!], outputSignal);
      const thrusterAOutput = outputs.shift();
      invariant(thrusterAOutput !== undefined, "Output A doesn't exist!");

      console.log("E", thrusterAOutput);
      runProgram(program, [b, thrusterAOutput], outputSignal);
      const thrusterBOutput = outputs.shift();
      invariant(thrusterBOutput !== undefined, "Output B doesn't exist!");

      runProgram(program, [c, thrusterBOutput], outputSignal);
      const thrusterCOutput = outputs.shift();
      invariant(thrusterCOutput !== undefined, "Output C doesn't exist!");

      runProgram(program, [d, thrusterCOutput], outputSignal);
      const thrusterDOutput = outputs.shift();
      invariant(thrusterDOutput !== undefined, "Output D doesn't exist!");

      runProgram(program, [e, thrusterDOutput], outputSignal);
      const thrusterEOutput = outputs.shift();
      invariant(thrusterEOutput !== undefined, "Output E doesn't exist!");

      console.log("E", thrusterEOutput);

      inputs.push(thrusterEOutput);
    }

    outputSignals.push(...inputs);
  }

  return Math.max(...outputSignals);
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const program = parseInput(input);
  return part2(program);
}
