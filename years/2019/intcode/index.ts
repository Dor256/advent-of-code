import { invariant } from "../../../utils";

const OpCode = {
  Add: 1,
  Mult: 2,
  Input: 3,
  Output: 4,
  JumpIfTrue: 5,
  JumpIfFalse: 6,
  LessThan: 7,
  Equals: 8,
  Halt: 99
};

const Mode = {
  Position: 0,
  Immediate: 1
};

function extractModes(instruction: number): number[] {
  return Math.trunc(instruction / 100).toString().split('').reverse().map(Number);
}

type Program = number[];

type State = {
  instructionPointer: number;
  outputs: number[];
  done: boolean;
  program: Program;
};

export class IntCodeComputer {
  private state: State;
  constructor(program: number[]) {
    this.state = {
      instructionPointer: 0,
      outputs: [],
      done: false,
      program
    }
  }

  setState(state: Partial<State>): void {
    this.state = {
      ...this.state,
      ...state
    };
  }

  private add(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, argA, argB, resAddress] = program.slice(instructionPointer, instructionPointer + 4);
    const [aMode, bMode] = extractModes(instruction);
    const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
    const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
    invariant(a !== undefined, "Invalid Argument: a");
    invariant(b !== undefined, "Invalid Argument: b");

    const result = a + b;
    return program.with(resAddress, result);
  }

  private mult(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, argA, argB, resAddress] = program.slice(instructionPointer, instructionPointer + 4);
    const [aMode, bMode] = extractModes(instruction);
    const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
    const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
    invariant(a !== undefined, "Invalid Argument: a");
    invariant(b !== undefined, "Invalid Argument: b");

    const result = a * b;
    return program.with(resAddress, result);
  }

  private input(program: number[], input: number) {
    const { instructionPointer } = this.state;
    const [, resAddress] = program.slice(instructionPointer, instructionPointer + 2);
    return program.with(resAddress, input);
  }

  private output(program: number[]): number {
    const { instructionPointer } = this.state;
    const [instruction, rawArg] = program.slice(instructionPointer, instructionPointer + 2);
    const [argMode] = extractModes(instruction);
    const arg = (argMode ?? 0) === Mode.Position ? program.at(rawArg) : rawArg;
    invariant(arg !== undefined, "Invalid argument: arg");

    return arg;
  }

  private jumpIfTrue(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, predicateArg, resArg] = program.slice(instructionPointer, instructionPointer + 3);
    const [predicateMode, resMode] = extractModes(instruction);
    const predicate = (predicateMode ?? 0) === Mode.Position ? program.at(predicateArg) : predicateArg;
    const res = (resMode ?? 0) === Mode.Position ? program.at(resArg) : resArg;
    invariant(predicate !== undefined, "Invalid argument: predicate");
    invariant(res !== undefined, "Invalid argument: res");

    return predicate !== 0 ? res : instructionPointer + 3;
  }

  private jumpIfFalse(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, predicateArg, resArg] = program.slice(instructionPointer, instructionPointer + 3);
    const [predicateMode, resMode] = extractModes(instruction);
    const predicate = (predicateMode ?? 0) === Mode.Position ? program.at(predicateArg) : predicateArg;
    const res = (resMode ?? 0) === Mode.Position ? program.at(resArg) : resArg;
    invariant(predicate !== undefined, "Invalid argument: predicate");
    invariant(res !== undefined, "Invalid argument: res");

    return predicate === 0 ? res : instructionPointer + 3;
  }

  private lessThan(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, argA, argB, resAddress] = program.slice(instructionPointer, instructionPointer + 4);
    const [aMode, bMode] = extractModes(instruction);
    const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
    const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
    invariant(a !== undefined, "Invalid Argument: a");
    invariant(b !== undefined, "Invalid Argument: b");

    const res = a < b ? 1 : 0;

    return program.with(resAddress, res);
  }

  private equals(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, argA, argB, resAddress] = program.slice(instructionPointer, instructionPointer + 4);
    const [aMode, bMode] = extractModes(instruction);
    const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
    const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
    invariant(a !== undefined, "Invalid Argument: a");
    invariant(b !== undefined, "Invalid Argument: b");

    const res = a === b ? 1 : 0;

    return program.with(resAddress, res);
  }

  getProgramOutputs() {
    const outputs = this.state.outputs;
    this.setState({ outputs: [] });
    return outputs;
  }

  runProgram(inputs: number[]) {
    while (true) {
      const { instructionPointer, program } = this.state;
      const instruction = program.at(instructionPointer);
      invariant(instruction, "Invalid Program!");
      const opCode = instruction % 100;
      switch (opCode) {
        case OpCode.Halt:
          return { program, done: true };
        case OpCode.Add:
          this.setState({
            instructionPointer: instructionPointer + 4,
            program: this.add(program)
          });
          break;
        case OpCode.Mult:
          this.setState({
            instructionPointer: instructionPointer + 4,
            program: this.mult(program)
          });
          break;
        case OpCode.Input:
          const arg = inputs.shift();
          invariant(arg !== undefined, "No input given!");
          this.setState({
            instructionPointer: instructionPointer + 2,
            program: this.input(program, arg)
          });
          break;
        case OpCode.Output:
          this.setState({
            outputs: [...this.state.outputs, this.output(program)],
            instructionPointer: instructionPointer + 2
          });
          return { program, done: false };
        case OpCode.JumpIfTrue:
          this.setState({ instructionPointer: this.jumpIfTrue(program)});
          break;
        case OpCode.JumpIfFalse:
          this.setState({ instructionPointer: this.jumpIfFalse(program) });
          break;
        case OpCode.LessThan:
          this.setState({
            instructionPointer: instructionPointer + 4,
            program: this.lessThan(program)
          });
          break;
        case OpCode.Equals:
          this.setState({
            instructionPointer: instructionPointer + 4,
            program: this.equals(program)
          });
          break;
      }
    }
  }
}
