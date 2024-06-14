import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/01/day.01.input.txt")
    .toString()
    .split("")
    .map((x) => (x === "(" ? 1 : -1));
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
