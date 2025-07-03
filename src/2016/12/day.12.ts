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
}

enum Registers {
  A = "a",
  B = "b",
  C = "c",
  D = "d",
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/12/day.12.input.txt")
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
    [Registers.A]: 0,
    [Registers.B]: 0,
    [Registers.C]: 0,
    [Registers.D]: 0,
  });
}

export function part2() {
  const instructions = parseInput();

  return execute(instructions, {
    [Registers.A]: 0,
    [Registers.B]: 0,
    [Registers.C]: 1,
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
          index += args[1] as number;
          continue;
        }

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
