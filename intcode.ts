import { invariant } from "./utils";

const OpCode = {
  Add: 1,
  Mult: 2,
  Write: 3,
  Read: 4,
  Halt: 99
};

function add(program: number[], instructionPointer: number) {
  const [, addressA, addressB, resAddress] = program.slice(instructionPointer, instructionPointer + 4);
  const a = program.at(addressA);
  const b = program.at(addressB);
  invariant(a !== undefined, "Invalid Argument: a");
  invariant(b !== undefined, "Invalid Argument: b");

  const result = a + b;
  return program.with(resAddress, result);
}

function mult(program: number[], instructionPointer: number) {
  const [, addressA, addressB, resAddress] = program.slice(instructionPointer, instructionPointer + 4);
  const a = program.at(addressA);
  const b = program.at(addressB);
  invariant(a !== undefined, "Invalid Argument: a");
  invariant(b !== undefined, "Invalid Argument: b");

  const result = a * b;
  return program.with(resAddress, result);
}

export function runProgram(program: number[]) {
  let instructionPointer = 0;
  while (true) {
    const opCode = program.at(instructionPointer);
    invariant(opCode, "Invalid Program!");
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
    }
  }
}
