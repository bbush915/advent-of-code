import fs from "fs";

import { isNumeric } from "@/utils/number";

type Instruction = {
  operation: Operations;
  args: (number | Registers)[];
};

enum Operations {
  COPY = "cpy",
  INCREASE = "inc",
  DECREASE = "dec",
  JUMP_IF_NOT_ZERO = "jnz",
  TOGGLE = "tgl",
}

enum Registers {
  A = "a",
  B = "b",
  C = "c",
  D = "d",
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/23/day.23.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseInstruction);
}

function parseInstruction(value: string): Instruction {
  const parts = value.split(" ");

  const args: (number | Registers)[] = [];

  for (const part of parts.slice(1)) {
    if (isNumeric(part)) {
      args.push(Number(part));
    } else {
      args.push(part as Registers);
    }
  }

  return {
    operation: parts[0] as Operations,
    args,
  };
}

export function part1() {
  const instructions = parseInput();

  return execute(instructions, {
    [Registers.A]: 7,
    [Registers.B]: 0,
    [Registers.C]: 0,
    [Registers.D]: 0,
  });
}

export function part2() {
  const instructions = parseInput();

  return execute(instructions, {
    [Registers.A]: 12,
    [Registers.B]: 0,
    [Registers.C]: 0,
    [Registers.D]: 0,
  });
}

function execute(
  instructions: Instruction[],
  registers: Record<Registers, number>
) {
  let index = 0;

  while (index < instructions.length) {
    const { operation, args } = instructions[index];

    switch (operation) {
      case Operations.COPY: {
        registers[args[1] as Registers] = getValue(args[0], registers);
        break;
      }

      case Operations.INCREASE: {
        registers[args[0] as Registers]++;
        break;
      }

      case Operations.DECREASE: {
        registers[args[0] as Registers]--;
        break;
      }

      case Operations.JUMP_IF_NOT_ZERO: {
        if (getValue(args[0], registers)) {
          index += getValue(args[1], registers);
          continue;
        }

        break;
      }

      case Operations.TOGGLE: {
        const targetIndex = index + getValue(args[0], registers);

        if (targetIndex < 0 || targetIndex >= instructions.length) {
          break;
        }

        const target = instructions[targetIndex];

        target.operation =
          target.args.length === 1
            ? target.operation === Operations.INCREASE
              ? Operations.DECREASE
              : Operations.INCREASE
            : target.operation === Operations.JUMP_IF_NOT_ZERO
            ? Operations.COPY
            : Operations.JUMP_IF_NOT_ZERO;

        break;
      }
    }

    index++;
  }

  return registers[Registers.A];
}

function getValue(
  arg: number | Registers,
  registers: Record<Registers, number>
) {
  return isNumeric(arg) ? (arg as number) : registers[arg as Registers];
}
