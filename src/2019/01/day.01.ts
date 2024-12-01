import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2019/01/day.01.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map(Number);
}

export function part1() {
  return parseInput().map(getFuel).sum();
}

export function part2() {
  return parseInput().map(getFuelRecursive).sum();
}

function getFuel(mass: number) {
  return Math.floor(mass / 3) - 2;
}

function getFuelRecursive(mass: number): number {
  const fuel = Math.floor(mass / 3) - 2;

  if (fuel <= 0) {
    return 0;
  }

  return fuel + getFuelRecursive(fuel);
}
