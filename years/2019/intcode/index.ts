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
  Offset: 9,
  Halt: 99
};

const Mode = {
  Position: 0,
  Immediate: 1,
  Relative: 2
};

function extractModes(instruction: number): number[] {
  return Math.trunc(instruction / 100).toString().split('').reverse().map(Number);
}

type Program = number[];

type State = {
  instructionPointer: number;
  outputs: number[];
  relativeBase: number;
  done: boolean;
  program: Program;
};

export class IntCodeComputer {
  private state: State;
  constructor(program: number[]) {
    this.state = {
      instructionPointer: 0,
      outputs: [],
      relativeBase: 0,
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

  private getArgument(argument: number, mode: number) {
    const { program, relativeBase } = this.state;
    switch (mode) {
      case Mode.Position:
        return program.at(argument);
      case Mode.Immediate:
        return argument;
      case Mode.Relative:
        return program.at(argument + relativeBase);
      default:
        return program.at(argument);
    }
  }

  private getAddress(address: number, mode?: number) {
    const { relativeBase } = this.state;
    return (mode ?? 0) === Mode.Position ? address : address + relativeBase;
  }

  private add(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, argA, argB, argAddress] = program.slice(instructionPointer, instructionPointer + 4);
    const [aMode, bMode, addressMode] = extractModes(instruction);

    const a = this.getArgument(argA, aMode) ?? 0;
    const b = this.getArgument(argB, bMode) ?? 0;
    const address = this.getAddress(argAddress, addressMode);

    invariant(a !== undefined, "Add: Invalid Argument: a");
    invariant(b !== undefined, "Add: Invalid Argument: b");

    const result = a + b;
    const copy = program.slice();
    copy[address] = result;
    return copy;
  }

  private mult(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, argA, argB, argAddress] = program.slice(instructionPointer, instructionPointer + 4);
    const [aMode, bMode, addressMode] = extractModes(instruction);
    const a = this.getArgument(argA, aMode) ?? 0;
    const b = this.getArgument(argB, bMode) ?? 0;
    const address = this.getAddress(argAddress, addressMode);
    invariant(a !== undefined, "Mult: Invalid Argument: a");
    invariant(b !== undefined, "Mult: Invalid Argument: b");

    const result = a * b;
    const copy = program.slice();
    copy[address] = result;
    return copy;
  }

  private input(program: number[], input: number) {
    const { instructionPointer } = this.state;
    const [instruction, argAddress] = program.slice(instructionPointer, instructionPointer + 2);
    const [mode] = extractModes(instruction);
    const address = this.getAddress(argAddress, mode);

    const copy = program.slice();
    copy[address] = input;
    return copy;
  }

  private output(program: number[]): number {
    const { instructionPointer } = this.state;
    const [instruction, rawArg] = program.slice(instructionPointer, instructionPointer + 2);
    const [argMode] = extractModes(instruction);
    const arg = this.getArgument(rawArg, argMode);
    invariant(arg !== undefined, "Invalid argument: arg");

    return arg;
  }

  private jumpIfTrue(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, predicateArg, resArg] = program.slice(instructionPointer, instructionPointer + 3);
    const [predicateMode, resMode] = extractModes(instruction);
    const predicate = this.getArgument(predicateArg, predicateMode ?? 0);
    const res = this.getArgument(resArg, resMode ?? 0);
    invariant(predicate !== undefined, "Invalid argument: predicate");
    invariant(res !== undefined, "Invalid argument: res");

    return predicate !== 0 ? res : instructionPointer + 3;
  }

  private jumpIfFalse(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, predicateArg, resArg] = program.slice(instructionPointer, instructionPointer + 3);
    const [predicateMode, resMode] = extractModes(instruction);
    const predicate = this.getArgument(predicateArg, predicateMode ?? 0);
    const res = this.getArgument(resArg, resMode ?? 0);
    invariant(predicate !== undefined, "Invalid argument: predicate");
    invariant(res !== undefined, "Invalid argument: res");

    return predicate === 0 ? res : instructionPointer + 3;
  }

  private lessThan(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, argA, argB, argAddress] = program.slice(instructionPointer, instructionPointer + 4);
    const [aMode, bMode, addressMode] = extractModes(instruction);
    const a = this.getArgument(argA, aMode);
    const b = this.getArgument(argB, bMode);
    const address = this.getAddress(argAddress, addressMode);
    invariant(a !== undefined, "LT: Invalid Argument: a");
    invariant(b !== undefined, "LT: Invalid Argument: b");

    const res = a < b ? 1 : 0;

    const copy = program.slice();
    copy[address] = res;
    return copy;
  }

  private equals(program: number[]) {
    const { instructionPointer } = this.state;
    const [instruction, argA, argB, argAddress] = program.slice(instructionPointer, instructionPointer + 4);
    const [aMode, bMode, addressMode] = extractModes(instruction);
    const a = this.getArgument(argA, aMode) ?? 0;
    const b = this.getArgument(argB, bMode) ?? 0;
    const address = this.getAddress(argAddress, addressMode);
    invariant(a !== undefined, "Eq: Invalid Argument: a");
    invariant(b !== undefined, "Eq: Invalid Argument: b");

    const res = a === b ? 1 : 0;

    const copy = program.slice();
    copy[address] = res;
    return copy;
  }

  private offset(program: number[]) {
    const { instructionPointer, relativeBase } = this.state;
    const [instruction, rawArg] = program.slice(instructionPointer, instructionPointer + 2);
    const [mode] = extractModes(instruction);
    const arg = this.getArgument(rawArg, mode);
    invariant(arg !== undefined, "Offset: Invalid Argument: arg");
    
    return relativeBase + arg;
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
        case OpCode.Offset:
          this.setState({
            instructionPointer: instructionPointer + 2,
            relativeBase: this.offset(program)
          });
      }
    }
  }
}
