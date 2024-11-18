import crypto from "crypto";
import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/04/day.04.input.txt")
    .toString()
    .slice(0, -1);
}

export function part1() {
  const secretKey = parseInput();

  return mine(secretKey, 5);
}

export function part2() {
  const secretKey = parseInput();

  return mine(secretKey, 6);
}

function mine(secretKey: string, leadingZeroCount: number) {
  const leadingString = "0".repeat(leadingZeroCount);

  let i = 1;

  while (1) {
    const hash = crypto
      .createHash("md5")
      .update(`${secretKey}${i}`)
      .digest("hex");

    if (hash.startsWith(leadingString)) {
      return i;
    }

    i++;
  }
}
