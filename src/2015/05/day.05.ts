import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/05/day.05.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x);
}

export function part1() {
  return getNiceStringCount(isNiceString1);
}

export function part2() {
  return getNiceStringCount(isNiceString2);
}

function getNiceStringCount(isNice: (string: string) => boolean) {
  const strings = parseInput();

  return strings.filter(isNice).length;
}

function isNiceString1(string: string) {
  // NOTE - Must contain at least 3 vowels.

  if ((string.match(/[aeiou]/g)?.length ?? 0) < 3) {
    return false;
  }

  // NOTE - Must contain a double letter.

  if (!string.match(/(.)\1/)) {
    return false;
  }

  // NOTE - Must not contain the strings ab, cd, pq, or xy.

  if (string.match(/ab|cd|pq|xy/)) {
    return false;
  }

  return true;
}

function isNiceString2(string: string) {
  // NOTE - Must contain a pair of letters appearing twice without overlapping.

  if (!string.match(/(.{2}).*\1/)) {
    return false;
  }

  // NOTE - Must contain a letter that repeats with exactly one letter between them.

  if (!string.match(/(.).\1/)) {
    return false;
  }

  return true;
}
