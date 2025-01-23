import fs from "fs";

import { isNumeric } from "@/utils/number";
import { topologicalSort } from "@/utils/graph";

enum GateType {
  NOOP = "",
  AND = "AND",
  OR = "OR",
  LSHIFT = "LSHIFT",
  RSHIFT = "RSHIFT",
  NOT = "NOT",
}

type Instruction = {
  wire: string;
  gateType: GateType;
  arguments: Argument[];
};

type Argument = string | number;

function parseInput() {
  const instructions = fs
    .readFileSync("src/inputs/2015/07/day.07.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseInstruction);

  const instructionLookup = Map.groupBy(instructions, (x) => x.wire);

  return topologicalSort(buildNeighborLookup(instructions)).map(
    (wire) => instructionLookup.get(wire)![0]
  );
}

function parseInstruction(value: string): Instruction {
  const [input, output] = value.split(" -> ");
  const inputParts = input.split(" ");

  switch (inputParts.length) {
    case 1: {
      return {
        wire: output,
        gateType: GateType.NOOP,
        arguments: [parseArgument(inputParts[0])],
      };
    }

    case 2: {
      return {
        wire: output,
        gateType: inputParts[0] as GateType,
        arguments: [parseArgument(inputParts[1])],
      };
    }

    case 3: {
      return {
        wire: output,
        gateType: inputParts[1] as GateType,
        arguments: [parseArgument(inputParts[0]), parseArgument(inputParts[2])],
      };
    }

    default: {
      throw new Error("Unable to parse instruction!");
    }
  }
}

function parseArgument(value: string) {
  return isNumeric(value) ? Number(value) : value;
}

function buildNeighborLookup(instructions: Instruction[]) {
  return new Map<string, string[]>(
    instructions.map((instruction) => [
      instruction.wire,
      instruction.arguments.filter((x): x is string => typeof x === "string"),
    ])
  );
}

export function part1() {
  const instructions = parseInput();

  const signalLookup = new Map<string, number>();

  for (const instruction of instructions) {
    signalLookup.set(
      instruction.wire,
      evaluateInstruction(instruction, signalLookup)
    );
  }

  return signalLookup.get("a");
}

export function part2() {
  const instructions = parseInput();

  const signalLookup = new Map<string, number>([["b", 16076]]);

  for (const instruction of instructions) {
    if (instruction.wire === "b") {
      continue;
    }

    signalLookup.set(
      instruction.wire,
      evaluateInstruction(instruction, signalLookup)
    );
  }

  return signalLookup.get("a");
}

function evaluateInstruction(
  instruction: Instruction,
  signalLookup: Map<string, number>
) {
  switch (instruction.gateType) {
    case GateType.NOOP: {
      return evaluateArgument(instruction.arguments[0], signalLookup);
    }

    case GateType.AND: {
      return (
        evaluateArgument(instruction.arguments[0], signalLookup) &
        evaluateArgument(instruction.arguments[1], signalLookup)
      );
    }

    case GateType.OR: {
      return (
        evaluateArgument(instruction.arguments[0], signalLookup) |
        evaluateArgument(instruction.arguments[1], signalLookup)
      );
    }

    case GateType.LSHIFT: {
      return (
        evaluateArgument(instruction.arguments[0], signalLookup) <<
        (instruction.arguments[1] as number)
      );
    }

    case GateType.RSHIFT: {
      return (
        evaluateArgument(instruction.arguments[0], signalLookup) >>
        (instruction.arguments[1] as number)
      );
    }

    case GateType.NOT: {
      return (
        (1 << 16) + ~evaluateArgument(instruction.arguments[0], signalLookup)
      );
    }
  }
}

function evaluateArgument(
  argument: Argument,
  signalLookup: Map<string, number>
) {
  return typeof argument === "number" ? argument : signalLookup.get(argument)!;
}
