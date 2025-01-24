import fs from "fs";

enum Opcodes {
  HLF = "hlf",
  TPL = "tpl",
  INC = "inc",
  JMP = "jmp",
  JIE = "jie",
  JIO = "jio",
}

enum Registers {
  A = "a",
  B = "b",
}

type Instruction = {
  opcode: Opcodes;
  register: Registers | null;
  offset: number | null;
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/23/day.23.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseInstruction);
}

function parseInstruction(line: string): Instruction {
  const parts = line.replace(",", "").split(" ");

  return {
    opcode: parts[0] as Opcodes,
    register: parts[0] === Opcodes.JMP ? null : (parts[1] as Registers),
    offset:
      parts[0] === Opcodes.JMP
        ? Number(parts[1])
        : parts.length === 3
        ? Number(parts[2])
        : null,
  };
}

export function part1() {
  const instructions = parseInput();
  return run(instructions, 0);
}

export function part2() {
  const instructions = parseInput();
  return run(instructions, 1);
}

function run(instructions: Instruction[], a: number) {
  const registers = {
    [Registers.A]: a,
    [Registers.B]: 0,
  };

  let index = 0;

  while (index < instructions.length) {
    const { opcode, register, offset } = instructions[index];

    switch (opcode) {
      case Opcodes.HLF: {
        registers[register!] /= 2;
        index++;
        break;
      }

      case Opcodes.TPL: {
        registers[register!] *= 3;
        index++;
        break;
      }

      case Opcodes.INC: {
        registers[register!] += 1;
        index++;
        break;
      }

      case Opcodes.JMP: {
        index += offset!;
        break;
      }

      case Opcodes.JIE: {
        index += registers[register!] % 2 ? 1 : offset!;
        break;
      }

      case Opcodes.JIO: {
        index += registers[register!] === 1 ? offset! : 1;
        break;
      }
    }
  }

  return registers[Registers.B];
}
