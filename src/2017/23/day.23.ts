import fs from "fs";

import { isNumeric } from "@/utils/number";

type Instruction = {
  type: InstructionTypes;
  arguments: (string | number)[];
};

enum InstructionTypes {
  SET = "set",
  DECREASE = "sub",
  MULTIPLY = "mul",
  JUMP_IF_NOT_ZERO = "jnz",
}

function parseInput() {
  const instructions = fs
    .readFileSync("src/inputs/2017/23/day.23.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseInstruction);

  const registers = "abcdefgh"
    .split("")
    .reduce(
      (lookup, register) => lookup.set(register, 0),
      new Map<string, number>()
    );

  return {
    instructions,
    registers,
  };
}

function parseInstruction(value: string): Instruction {
  const parts = value.split(" ");

  return {
    type: parts[0] as InstructionTypes,
    arguments: parts.slice(1).map((x) => (isNumeric(x) ? Number(x) : x)),
  };
}

export function part1() {
  const { instructions, registers } = parseInput();

  let index = 0;
  let count = 0;

  while (1) {
    const instruction = instructions[index];

    if (!instruction) {
      break;
    }

    switch (instruction.type) {
      case InstructionTypes.SET: {
        registers.set(
          instruction.arguments[0] as string,
          getValue(instruction.arguments[1], registers)
        );

        break;
      }

      case InstructionTypes.DECREASE: {
        registers.set(
          instruction.arguments[0] as string,
          registers.get(instruction.arguments[0] as string)! -
            getValue(instruction.arguments[1], registers)
        );

        break;
      }

      case InstructionTypes.MULTIPLY: {
        registers.set(
          instruction.arguments[0] as string,
          registers.get(instruction.arguments[0] as string)! *
            getValue(instruction.arguments[1], registers)
        );

        count++;

        break;
      }

      case InstructionTypes.JUMP_IF_NOT_ZERO: {
        if (getValue(instruction.arguments[0], registers)) {
          index += getValue(instruction.arguments[1], registers);
          continue;
        }

        break;
      }
    }

    index++;
  }

  return count;
}

export function part2() {
  let count = 0;

  const primes = getPrimesBelow(Math.floor(Math.sqrt(126_900)));

  for (let n = 109_900; n <= 126_900; n += 17) {
    if (primes.some((x) => n % x === 0)) {
      count++;
    }
  }

  return count;
}

function getValue(arg: number | string, registers: Map<string, number>) {
  return isNumeric(arg) ? (arg as number) : registers.get(arg as string)!;
}

function getPrimesBelow(n: number) {
  const range = new Array(n + 1).fill(true);

  for (let i = 2; i < Math.sqrt(n); i++) {
    if (range[i]) {
      for (let j = i * i; j <= n; j += i) {
        range[j] = false;
      }
    }
  }

  const primes: number[] = [];

  for (let i = 2; i <= n; i++) {
    if (range[i]) {
      primes.push(i);
    }
  }

  return primes;
}
