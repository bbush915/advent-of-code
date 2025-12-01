import fs from "fs";

import { lpr } from "@/utils/number";

enum Directions {
  LEFT = "L",
  RIGHT = "R",
}

const DIRECTION_MAP = {
  [Directions.LEFT]: -1,
  [Directions.RIGHT]: 1,
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2025/01/day.01.input.txt")
    .toString()
    .trim()
    .split("\n")
    .map((x) => parseRotation(x));
}

function parseRotation(value: string): number {
  return DIRECTION_MAP[value[0] as Directions] * Number(value.slice(1));
}

export function part1() {
  return getPassword(countFinalZeroes);
}

export function part2() {
  return getPassword(countAllZeroes);
}

function getPassword(method: (dial: number, rotation: number) => number) {
  const rotations = parseInput();

  let password = 0;
  let dial = 50;

  for (const rotation of rotations) {
    password += method(dial, rotation);
    dial = lpr(dial + rotation, 100);
  }

  return password;
}

function countFinalZeroes(dial: number, rotation: number) {
  return (dial + rotation) % 100 ? 0 : 1;
}

function countAllZeroes(dial: number, rotation: number) {
  const distance = dial ? (rotation > 0 ? 100 - dial : dial) : 100;
  const remainder = Math.abs(rotation) - distance;

  if (remainder < 0) {
    return 0;
  }

  return 1 + Math.floor(remainder / 100);
}
