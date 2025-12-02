import { invariant } from "./utils";

const OpCode = {
  Add: 1,
  Mult: 2,
  Write: 3,
  Read: 4,
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

function write(program: number[], instructionPointer: number, input: number) {
  const [, resAddress] = program.slice(instructionPointer, instructionPointer + 2);
  return program.with(resAddress, input);
}

function read(program: number[], instructionPointer: number) {
  const [instruction, rawArg] = program.slice(instructionPointer, instructionPointer + 2);
  const [argMode] = extractModes(instruction);
  const arg = (argMode ?? 0) === Mode.Position ? program.at(rawArg) : rawArg;
  invariant(arg !== undefined, "Invalid argument: arg");
  
  console.log("Output:", arg);
  return program;
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

export function runProgram(program: number[]) {
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
      case OpCode.Write:
        const raw = prompt("Please input a number:");
        invariant(raw !== null, "No input given!");
        const input = Number(raw);
        program = write(program, instructionPointer, input);
        instructionPointer += 2;
        break;
      case OpCode.Read:
        program = read(program, instructionPointer);
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
