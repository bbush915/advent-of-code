import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/08/day.08.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x);
}

export function part1() {
  const list = parseInput();

  return list
    .map(
      (x) =>
        x.length -
        x
          .replace(/\\\\/g, "|")
          .replace(/\\\"/g, "|")
          .replace(/\\x[a-f0-9]{2}/g, "|").length +
        2
    )
    .sum();
}

export function part2() {
  const list = parseInput();

  return list
    .map(
      (x) => x.replace(/\\/g, "||").replace(/\"/g, "||").length - x.length + 2
    )
    .sum();
}
