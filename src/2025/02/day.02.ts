import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2025/02/day.02.input.txt")
    .toString()
    .trim()
    .split(",")
    .map((x) => x.split("-").map(Number));
}

export function part1() {
  return getInvalidSum(isRepeatedExactlyTwice);
}

export function part2() {
  return getInvalidSum(isRepeatedAtLeastTwice);
}

function getInvalidSum(isInvalid: (value: string) => boolean) {
  const intervals = parseInput();

  let sum = 0;

  for (const interval of intervals) {
    for (let n = interval[0]; n <= interval[1]; n++) {
      if (isInvalid(String(n))) {
        sum += n;
      }
    }
  }

  return sum;
}

function isRepeatedExactlyTwice(value: string) {
  return value.slice(0, value.length / 2).repeat(2) === value;
}

function isRepeatedAtLeastTwice(value: string) {
  for (let n = 1; n <= value.length / 2; n++) {
    if (value.length % n) {
      continue;
    }

    if (value.slice(0, n).repeat(value.length / n) === value) {
      return true;
    }
  }

  return false;
}
