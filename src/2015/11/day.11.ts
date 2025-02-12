import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/11/day.11.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)[0];
}

export function part1() {
  return getNewPassword(parseInput());
}

export function part2(oldPassword = "cqjxxzaa") {
  return getNewPassword(oldPassword);
}

function getNewPassword(oldPassword: string) {
  let values = toValues(oldPassword);

  while (!isValid(values)) {
    values = increment(values);
  }

  return fromValues(values);
}

function toValues(password: string) {
  return password.split("").map((x) => x.charCodeAt(0) - "a".charCodeAt(0));
}

function fromValues(values: number[]) {
  return values.map((x) => String.fromCharCode(x + "a".charCodeAt(0))).join("");
}

function increment(values: number[]) {
  const length = values.length;

  values[length - 1]++;

  if (values.at(-1)! > 25) {
    for (let i = 0; i < length; i++) {
      values[length - 1 - i] = 0;
      values[length - 1 - (i + 1)]++;

      if (values[length - 1 - (i + 1)] <= 25) {
        break;
      }
    }
  }

  return values;
}

function isValid(values: number[]) {
  // NOTE: Passwords may not contain the letters i, o, or l.

  if (values.findIndex((x) => [8, 14, 11].includes(x)) >= 0) {
    return false;
  }

  // NOTE: Passwords must include one increasing straight of at least three letters.

  let hasStraight = false;

  for (let i = 0; i < values.length - 3; i++) {
    if (
      values[i] === values[i + 1] - 1 &&
      values[i + 1] === values[i + 2] - 1
    ) {
      hasStraight = true;
    }
  }

  if (!hasStraight) {
    return false;
  }

  // NOTE: Passwords must contain at least two different, non-overlapping pairs of letters.

  let hasPairs = false;
  let pairOne: number | null = null;

  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] === values[i + 1]) {
      pairOne = values[i];
    }
  }

  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] === values[i + 1] && values[i] !== pairOne) {
      hasPairs = true;
    }
  }

  if (!hasPairs) {
    return false;
  }

  return true;
}
