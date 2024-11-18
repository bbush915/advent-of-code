import fs from "fs";

import "@/utils/array";

enum Instructions {
  UP = "(",
  DOWN = ")",
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/01/day.01.input.txt")
    .toString()
    .split("")
    .map(parseInstruction);
}

function parseInstruction(value: string) {
  switch (value) {
    case Instructions.UP: {
      return 1;
    }

    case Instructions.DOWN: {
      return -1;
    }

    default: {
      throw new Error("Unable to parse instruction!");
    }
  }
}

export function part1() {
  const instructions = parseInput();

  return instructions.sum();
}

export function part2() {
  const instructions = parseInput();

  let floor = 0;

  for (let i = 0; i < instructions.length; i++) {
    floor += instructions[i];

    if (floor < 0) {
      return i + 1;
    }
  }
}
