import fs from "fs";

import "@/utils/array";

enum Registers {
  A,
  B,
  C,
}

enum Operands {
  LITERAL_0,
  LITERAL_1,
  LITERAL_2,
  LITERAL_3,
  REGISTER_A,
  REGISTER_B,
  REGISTER_C,
  RESERVED,
}

enum Instructions {
  ADV,
  BXL,
  BST,
  JNZ,
  BXC,
  OUT,
  BDV,
  CDV,
}

function parseInput() {
  const parts = fs
    .readFileSync("src/inputs/2024/17/day.17.input.txt")
    .toString()
    .split("\n\n");

  const [a, b, c] = parts[0].split("\n").map((x) => Number(x.match(/\d+/)));
  const program = parts[1].match(/\d+/g)!.map(Number);

  return {
    registers: [a, b, c],
    program,
  };
}

export function part1() {
  const { registers, program } = parseInput();

  return executeProgram(registers, program).map(String).join(",");
}

export function part2() {
  const {
    registers: [, b, c],
    program,
  } = parseInput();

  const tribits = new Array(program.length).fill(0);

  let depth = 0;

  while (depth < program.length) {
    if (tribits[depth] === 8) {
      tribits[depth] = 0;
      tribits[--depth]++;

      continue;
    }

    const output = executeProgram([getTribitsValue(tribits), b, c], program);

    if (isPartialMatch(program, output, depth)) {
      depth++;
    } else {
      tribits[depth]++;
    }
  }

  return getTribitsValue(tribits);
}

function executeProgram(registers: number[], program: number[]) {
  const output: number[] = [];

  let instructionPointer = 0;

  while (instructionPointer < program.length - 1) {
    const operand = program[instructionPointer + 1];

    switch (program[instructionPointer]) {
      case Instructions.ADV: {
        registers[Registers.A] = rshift(
          registers[Registers.A],
          getComboOperand(registers, operand)
        );

        break;
      }

      case Instructions.BXL: {
        registers[Registers.B] = xor(registers[Registers.B], operand);
        break;
      }

      case Instructions.BST: {
        registers[Registers.B] = getComboOperand(registers, operand) % 8;
        break;
      }

      case Instructions.JNZ: {
        if (!registers[Registers.A]) {
          break;
        }

        instructionPointer = operand;
        continue;
      }

      case Instructions.BXC: {
        registers[Registers.B] = xor(
          registers[Registers.B],
          registers[Registers.C]
        );

        break;
      }

      case Instructions.OUT: {
        output.push(getComboOperand(registers, operand) % 8);
        break;
      }

      case Instructions.BDV: {
        registers[Registers.C] = rshift(
          registers[Registers.B],
          getComboOperand(registers, operand)
        );

        break;
      }

      case Instructions.CDV: {
        registers[Registers.C] = rshift(
          registers[Registers.A],
          getComboOperand(registers, operand)
        );

        break;
      }
    }

    instructionPointer += 2;
  }

  return output;
}

function getComboOperand(registers: number[], operand: Operands) {
  switch (operand) {
    case Operands.LITERAL_0: {
      return 0;
    }

    case Operands.LITERAL_1: {
      return 1;
    }

    case Operands.LITERAL_2: {
      return 2;
    }

    case Operands.LITERAL_3: {
      return 3;
    }

    case Operands.REGISTER_A: {
      return registers[Registers.A];
    }

    case Operands.REGISTER_B: {
      return registers[Registers.B];
    }

    case Operands.REGISTER_C: {
      return registers[Registers.C];
    }

    case Operands.RESERVED: {
      throw new Error("Reserved!");
    }
  }
}

function xor(x: number, y: number) {
  return Number(BigInt(x) ^ BigInt(y));
}

function rshift(x: number, bits: number) {
  return Number(BigInt(x) >> BigInt(bits));
}

function getTribitsValue(tribits: number[]) {
  return parseInt(
    tribits.map((x) => x.toString(2).padStart(3, "0")).join(""),
    2
  );
}

function isPartialMatch(program: number[], output: number[], depth: number) {
  for (let i = 0; i <= depth; i++) {
    if (output[output.length - 1 - i] !== program[program.length - 1 - i]) {
      return false;
    }
  }

  return true;
}
