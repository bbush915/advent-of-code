import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/02/day.02.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parsePresent);
}

function parsePresent(value: string) {
  return value.split("x").map(Number);
}

export function part1() {
  const presents = parseInput();

  return presents
    .map(
      ([l, w, h]) => 2 * (l * w + w * h + h * l) + Math.min(l * w, w * h, h * l)
    )
    .sum();
}

export function part2() {
  const presents = parseInput();

  return presents
    .map(([l, w, h]) => l * w * h + 2 * Math.min(l + w, w + h, h + l))
    .sum();
}
