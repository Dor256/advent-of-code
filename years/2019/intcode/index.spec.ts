import { describe, it, expect } from "bun:test";
import { runProgram } from ".";

describe("Intcode Computer", () => {
  it("Outputs 5", () => {
    const outputs: number[] = [];
    const signal = (out: number) => outputs.push(out);

    runProgram([104, 5, 99], [], signal);

    expect(outputs).toEqual([5]);
  });

  it("Adds 4 and 1 and outputs 5", () => {
    const outputs: number[] = [];
    const signal = (out: number) => outputs.push(out);

    runProgram([1, 4, 0, 0, 4, 0, 99], [], signal);

    expect(outputs).toEqual([5]);
  });

  it("Outputs whatever it gets as input", () => {
     const program = [3, 0, 4, 0, 99];
     const outputs: number[] = [];
     const signal = (out: number) => outputs.push(out);

     runProgram(program, [6], signal);

     expect(outputs).toEqual([6]);
  });
});
