import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2018/01/day.01.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(Number);
}

export function part1() {
  const changes = parseInput();

  return changes.sum();
}

export function part2() {
  const changes = parseInput();

  let frequency = 0;
  const frequencyLookup = new Set<number>([0]);

  let index = 0;

  while (1) {
    frequency += changes[index];

    if (frequencyLookup.has(frequency)) {
      break;
    }

    frequencyLookup.add(frequency);

    index = (index + 1) % changes.length;
  }

  return frequency;
}
