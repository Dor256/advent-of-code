import { permutations, range } from "../../../utils";
import { IntCodeComputer } from "../intcode";

function parseInput(input: string): number[] {
  return input.split(",").map(Number);
}

function part1(program: number[]) {
  const outputSignals: number[] = []
  const settings = permutations(range(0, 4));
  for (const [a, b, c ,d, e] of settings) {
    const thrusterA = new IntCodeComputer(program);
    thrusterA.runProgram([a, 0]);
    const [thrusterAOutput] = thrusterA.getProgramOutputs();

    const thrusterB = new IntCodeComputer(program);
    thrusterB.runProgram([b, thrusterAOutput]);
    const [thrusterBOutput] = thrusterB.getProgramOutputs();

    const thrusterC = new IntCodeComputer(program);
    thrusterC.runProgram([c, thrusterBOutput]);
    const [thrusterCOutput] = thrusterC.getProgramOutputs();

    const thrusterD = new IntCodeComputer(program);
    thrusterD.runProgram([d, thrusterCOutput]);
    const [thrusterDOutput] = thrusterD.getProgramOutputs();

    const thrusterE = new IntCodeComputer(program);
    thrusterE.runProgram([e, thrusterDOutput]);
    const [thrusterEOutput] = thrusterE.getProgramOutputs();

    outputSignals.push(thrusterEOutput);
  }

  return Math.max(...outputSignals);
}

function part2(program: number[]) {
  const outputSignals: number[] = []
  const settings = permutations(range(5, 9));
  let inputs: number[] = [];

  for (const [a, b, c ,d, e] of settings) {
    const thrusterA = new IntCodeComputer(program);
    const thrusterB = new IntCodeComputer(program);
    const thrusterC = new IntCodeComputer(program);
    const thrusterD = new IntCodeComputer(program);
    const thursterE = new IntCodeComputer(program);

    let firstIteration = true;
    while (true) {
      const input = inputs.pop();

      const { done } = thrusterA.runProgram(firstIteration ? [a, 0] : [input!]);
      if (done) {
        outputSignals.push(input!);
        break;
      }
      const [thrusterAOutput] = thrusterA.getProgramOutputs();

      thrusterB.runProgram(firstIteration ? [b, thrusterAOutput] : [thrusterAOutput]);
      const [thrusterBOutput] = thrusterB.getProgramOutputs();

      thrusterC.runProgram(firstIteration ? [c, thrusterBOutput] : [thrusterBOutput]);
      const [thrusterCOutput] = thrusterC.getProgramOutputs();

      thrusterD.runProgram(firstIteration ? [d, thrusterCOutput] : [thrusterCOutput]);
      const [thrusterDOutput] = thrusterD.getProgramOutputs();

      thursterE.runProgram(firstIteration ? [e, thrusterDOutput] : [thrusterDOutput]);
      const [thrusterEOutput] = thursterE.getProgramOutputs();

      inputs.push(thrusterEOutput);
      firstIteration = false;
    }
  }

  return Math.max(...outputSignals);
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const program = parseInput(input);
  return {
    p1: () => part1(program),
    p2: () => part2(program)
  }
}
