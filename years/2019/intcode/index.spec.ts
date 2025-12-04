import { describe, it, expect } from "bun:test";
import { IntCodeComputer } from ".";

describe("Incode class", () => {
  it("Outputs 5", () => {
    const computer = new IntCodeComputer([104, 5, 99]);
    computer.runProgram([]);

    expect(computer.getProgramOutputs()).toEqual([5]);
  });

  it("Adds 4 and 1 and outputs 5", () => {
    const computer = new IntCodeComputer([1, 4, 0, 0, 4, 0, 99]);
    computer.runProgram([]);

    expect(computer.getProgramOutputs()).toEqual([5]);
  });


  it("Outputs whatever it gets as input", () => {
    const program = [3, 0, 4, 0, 99];

    const computer = new IntCodeComputer(program);
    computer.runProgram([6]);

     expect(computer.getProgramOutputs()).toEqual([6]);
  });
});
