import fs from "fs";

import "@/utils/array";

type Instruction = {
  register: string;
  operation: Operations;
  value: number;
  condition: Condition;
};

enum Operations {
  INCREASE = "inc",
  DECREASE = "dec",
}

type Condition = {
  register: string;
  comparison: Comparisons;
  value: number;
};

enum Comparisons {
  LESS_THAN = "<",
  LESS_THAN_OR_EQUAL = "<=",
  GREATER_THAN = ">",
  GREATER_THAN_OR_EQUAL = ">=",
  EQUAL = "==",
  NOT_EQUAL = "!=",
}

function parseInput() {
  const instructions = fs
    .readFileSync("src/inputs/2017/08/day.08.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseInstruction);

  const registers = instructions.reduce(
    (registers, instruction) => registers.set(instruction.register, 0),
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
    register: parts[0],
    operation: parts[1] as Operations,
    value: Number(parts[2]),
    condition: {
      register: parts[4],
      comparison: parts[5] as Comparisons,
      value: Number(parts[6]),
    },
  };
}

export function part1() {
  const [maxFinalRegister] = execute();

  return maxFinalRegister;
}

export function part2() {
  const [, maxIntermediateRegister] = execute();

  return maxIntermediateRegister;
}

function execute() {
  const { instructions, registers } = parseInput();

  let max = 0;

  for (const instruction of instructions) {
    if (!evaluateCondition(instruction.condition, registers)) {
      continue;
    }

    const result = evaluateOperation(instruction, registers);

    if (result > max) {
      max = result;
    }
  }

  return [[...registers.values()].max(), max];
}

function evaluateCondition(
  { register, comparison, value }: Condition,
  registers: Map<string, number>
) {
  switch (comparison) {
    case Comparisons.LESS_THAN: {
      return registers.get(register)! < value;
    }

    case Comparisons.LESS_THAN_OR_EQUAL: {
      return registers.get(register)! <= value;
    }

    case Comparisons.GREATER_THAN: {
      return registers.get(register)! > value;
    }

    case Comparisons.GREATER_THAN_OR_EQUAL: {
      return registers.get(register)! >= value;
    }

    case Comparisons.EQUAL: {
      return registers.get(register)! === value;
    }

    case Comparisons.NOT_EQUAL: {
      return registers.get(register)! !== value;
    }
  }
}

function evaluateOperation(
  { register, operation, value }: Instruction,
  registers: Map<string, number>
) {
  let result: number;

  switch (operation) {
    case Operations.INCREASE: {
      result = registers.get(register)! + value;
      break;
    }

    case Operations.DECREASE: {
      result = registers.get(register)! - value;
      break;
    }
  }

  registers.set(register, result);

  return result;
}
