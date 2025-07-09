import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/01/day.01.input.txt")
    .toString()
    .split("")
    .map(Number);
}

export function part1() {
  return getCaptcha(matchesAdjacentDigit);
}

export function part2() {
  return getCaptcha(matchesOppositeDigit);
}

function getCaptcha(predicate: (digits: number[], i: number) => boolean) {
  const digits = parseInput();

  let sum = 0;

  for (let i = 0; i <= digits.length; i++) {
    if (predicate(digits, i)) {
      sum += digits[i];
    }
  }

  return sum;
}

function matchesAdjacentDigit(digits: number[], i: number) {
  return digits[i] === digits[(i + 1) % digits.length];
}

function matchesOppositeDigit(digits: number[], i: number) {
  return digits[i] === digits[(i + digits.length / 2) % digits.length];
}
