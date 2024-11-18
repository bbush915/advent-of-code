import fs from "fs";

import "@/utils/array";

type Present = [number, number, number];

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/02/day.02.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parsePresent);
}

function parsePresent(value: string) {
  return value.split("x").map(Number) as Present;
}

export function part1() {
  return getTotalPresentValue(calculateWrappingPaper);
}

export function part2() {
  return getTotalPresentValue(calculateRibbon);
}

function getTotalPresentValue(
  calculatePresentValue: (present: Present) => number
) {
  const presents = parseInput();

  return presents.map(calculatePresentValue).sum();
}

function calculateWrappingPaper([l, w, h]: Present) {
  return 2 * (l * w + w * h + h * l) + Math.min(l * w, w * h, h * l);
}

function calculateRibbon([l, w, h]: Present) {
  return l * w * h + 2 * Math.min(l + w, w + h, h + l);
}
