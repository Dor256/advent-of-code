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

function add(program: number[], instructionPointer: number) {
  const [instruction, argA, argB, resAddress] = program.slice(instructionPointer, instructionPointer + 4);
  const [aMode, bMode] = extractModes(instruction);
  const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
  const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
  invariant(a !== undefined, "Invalid Argument: a");
  invariant(b !== undefined, "Invalid Argument: b");

  const result = a + b;
  return program.with(resAddress, result);
}

function mult(program: number[], instructionPointer: number) {
  const [instruction, argA, argB, resAddress] = program.slice(instructionPointer, instructionPointer + 4);
  const [aMode, bMode] = extractModes(instruction);
  const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
  const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
  invariant(a !== undefined, "Invalid Argument: a");
  invariant(b !== undefined, "Invalid Argument: b");

  const result = a * b;
  return program.with(resAddress, result);
}

function input(program: number[], instructionPointer: number, input: number) {
  const [, resAddress] = program.slice(instructionPointer, instructionPointer + 2);
  return program.with(resAddress, input);
}

function output(program: number[], instructionPointer: number, outputSignal: (out: number) => void) {
  const [instruction, rawArg] = program.slice(instructionPointer, instructionPointer + 2);
  const [argMode] = extractModes(instruction);
  const arg = (argMode ?? 0) === Mode.Position ? program.at(rawArg) : rawArg;
  invariant(arg !== undefined, "Invalid argument: arg");
  
  console.log("OUTTT", arg);
  outputSignal(arg);
  return arg;
}

function jumpIfTrue(program: number[], instructionPointer: number) {
  const [instruction, predicateArg, resArg] = program.slice(instructionPointer, instructionPointer + 3);
  const [predicateMode, resMode] = extractModes(instruction);
  const predicate = (predicateMode ?? 0) === Mode.Position ? program.at(predicateArg) : predicateArg;
  const res = (resMode ?? 0) === Mode.Position ? program.at(resArg) : resArg;
  invariant(predicate !== undefined, "Invalid argument: predicate");
  invariant(res !== undefined, "Invalid argument: res");

  return predicate !== 0 ? res : instructionPointer + 3;
}

function jumpIfFalse(program: number[], instructionPointer: number) {
  const [instruction, predicateArg, resArg] = program.slice(instructionPointer, instructionPointer + 3);
  const [predicateMode, resMode] = extractModes(instruction);
  const predicate = (predicateMode ?? 0) === Mode.Position ? program.at(predicateArg) : predicateArg;
  const res = (resMode ?? 0) === Mode.Position ? program.at(resArg) : resArg;
  invariant(predicate !== undefined, "Invalid argument: predicate");
  invariant(res !== undefined, "Invalid argument: res");

  return predicate === 0 ? res : instructionPointer + 3;
}

function lessThan(program: number[], instructionPointer: number) {
  const [instruction, argA, argB, resAddress] = program.slice(instructionPointer, instructionPointer + 4);
  const [aMode, bMode] = extractModes(instruction);
  const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
  const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
  invariant(a !== undefined, "Invalid Argument: a");
  invariant(b !== undefined, "Invalid Argument: b");

  const res = a < b ? 1 : 0;

  return program.with(resAddress, res);
}

function equals(program: number[], instructionPointer: number) {
  const [instruction, argA, argB, resAddress] = program.slice(instructionPointer, instructionPointer + 4);
  const [aMode, bMode] = extractModes(instruction);
  const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
  const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
  invariant(a !== undefined, "Invalid Argument: a");
  invariant(b !== undefined, "Invalid Argument: b");

  const res = a === b ? 1 : 0;

  return program.with(resAddress, res);
}

export function runProgram(
  program: number[],
  inputs: number[],
  outputSignal: (out: number) => void = (out) => console.log("Output:", out)
) {
  let instructionPointer = 0;
  while (true) {
    const instruction = program.at(instructionPointer);
    invariant(instruction, "Invalid Program!");
    const opCode = instruction % 100;
    switch (opCode) {
      case OpCode.Halt:
        return program;
      case OpCode.Add:
        program = add(program, instructionPointer);
        instructionPointer += 4;
        break;
      case OpCode.Mult:
        program = mult(program, instructionPointer);
        instructionPointer += 4;
        break;
      case OpCode.Input:
        const arg = inputs.shift();
        console.log(arg);
        invariant(arg !== undefined, "No input given!");
        program = input(program, instructionPointer, arg);
        instructionPointer += 2;
        break;
      case OpCode.Output:
        console.log("OUT");
        output(program, instructionPointer, outputSignal);
        instructionPointer += 2;
        break;
      case OpCode.JumpIfTrue:
        instructionPointer = jumpIfTrue(program, instructionPointer);
        break;
      case OpCode.JumpIfFalse:
        instructionPointer = jumpIfFalse(program, instructionPointer);
        break;
      case OpCode.LessThan:
        program = lessThan(program, instructionPointer);
        instructionPointer += 4;
        break;
      case OpCode.Equals:
        program = equals(program, instructionPointer);
        instructionPointer += 4;
        break;
    }
  }
}

export class IntCodeComputer {
  private instructionPointer: number;
  private outputs: number[];
  constructor() {
    this.instructionPointer = 0;
    this.outputs = [];
  }

  private add(program: number[]) {
    const [instruction, argA, argB, resAddress] = program.slice(this.instructionPointer, this.instructionPointer + 4);
    const [aMode, bMode] = extractModes(instruction);
    const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
    const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
    invariant(a !== undefined, "Invalid Argument: a");
    invariant(b !== undefined, "Invalid Argument: b");

    const result = a + b;
    return program.with(resAddress, result);
  }

  private mult(program: number[]) {
    const [instruction, argA, argB, resAddress] = program.slice(this.instructionPointer, this.instructionPointer + 4);
    const [aMode, bMode] = extractModes(instruction);
    const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
    const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
    invariant(a !== undefined, "Invalid Argument: a");
    invariant(b !== undefined, "Invalid Argument: b");

    const result = a * b;
    return program.with(resAddress, result);
  }

  private input(program: number[], input: number) {
    const [, resAddress] = program.slice(this.instructionPointer, this.instructionPointer + 2);
    return program.with(resAddress, input);
  }

  private output(program: number[]) {
    const [instruction, rawArg] = program.slice(this.instructionPointer, this.instructionPointer + 2);
    const [argMode] = extractModes(instruction);
    const arg = (argMode ?? 0) === Mode.Position ? program.at(rawArg) : rawArg;
    invariant(arg !== undefined, "Invalid argument: arg");

    this.outputs = [...this.outputs, arg];
    return this.outputs;
  }

  private jumpIfTrue(program: number[]) {
    const [instruction, predicateArg, resArg] = program.slice(this.instructionPointer, this.instructionPointer + 3);
    const [predicateMode, resMode] = extractModes(instruction);
    const predicate = (predicateMode ?? 0) === Mode.Position ? program.at(predicateArg) : predicateArg;
    const res = (resMode ?? 0) === Mode.Position ? program.at(resArg) : resArg;
    invariant(predicate !== undefined, "Invalid argument: predicate");
    invariant(res !== undefined, "Invalid argument: res");

    return predicate !== 0 ? res : this.instructionPointer + 3;
  }

  private jumpIfFalse(program: number[]) {
    const [instruction, predicateArg, resArg] = program.slice(this.instructionPointer, this.instructionPointer + 3);
    const [predicateMode, resMode] = extractModes(instruction);
    const predicate = (predicateMode ?? 0) === Mode.Position ? program.at(predicateArg) : predicateArg;
    const res = (resMode ?? 0) === Mode.Position ? program.at(resArg) : resArg;
    invariant(predicate !== undefined, "Invalid argument: predicate");
    invariant(res !== undefined, "Invalid argument: res");

    return predicate === 0 ? res : this.instructionPointer + 3;
  }

  private lessThan(program: number[]) {
    const [instruction, argA, argB, resAddress] = program.slice(this.instructionPointer, this.instructionPointer + 4);
    const [aMode, bMode] = extractModes(instruction);
    const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
    const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
    invariant(a !== undefined, "Invalid Argument: a");
    invariant(b !== undefined, "Invalid Argument: b");

    const res = a < b ? 1 : 0;

    return program.with(resAddress, res);
  }

  private equals(program: number[]) {
    const [instruction, argA, argB, resAddress] = program.slice(this.instructionPointer, this.instructionPointer + 4);
    const [aMode, bMode] = extractModes(instruction);
    const a = (aMode ?? 0) === Mode.Position ? program.at(argA) : argA;
    const b = (bMode ?? 0) === Mode.Position ? program.at(argB) : argB;
    invariant(a !== undefined, "Invalid Argument: a");
    invariant(b !== undefined, "Invalid Argument: b");

    const res = a === b ? 1 : 0;

    return program.with(resAddress, res);
  }

  getProgramOutputs() {
    return this.outputs;
  }

  runProgram(program: number[], inputs: number[]) {
    while (true) {
      const instruction = program.at(this.instructionPointer);
      invariant(instruction, "Invalid Program!");
      const opCode = instruction % 100;
      switch (opCode) {
        case OpCode.Halt:
          return program;
        case OpCode.Add:
          program = this.add(program);
          this.instructionPointer += 4;
          break;
        case OpCode.Mult:
          program = this.mult(program);
          this.instructionPointer += 4;
          break;
        case OpCode.Input:
          const arg = inputs.shift();
          invariant(arg !== undefined, "No input given!");
          program = this.input(program, arg);
          this.instructionPointer += 2;
          break;
        case OpCode.Output:
          this.output(program);
          this.instructionPointer += 2;
          break;
        case OpCode.JumpIfTrue:
          this.instructionPointer = this.jumpIfTrue(program);
          break;
        case OpCode.JumpIfFalse:
          this.instructionPointer = this.jumpIfFalse(program);
          break;
        case OpCode.LessThan:
          program = this.lessThan(program);
          this.instructionPointer += 4;
          break;
        case OpCode.Equals:
          program = this.equals(program);
          this.instructionPointer += 4;
          break;
      }
    }
  }
}
