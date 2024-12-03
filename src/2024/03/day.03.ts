import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs.readFileSync("src/inputs/2024/03/day.03.input.txt").toString();
}

export function part1() {
  const memory = parseInput();

  return getMultiplicationResults(memory);
}

export function part2() {
  const memory = parseInput();

  return memory
    .split("do()")
    .map((x) => getMultiplicationResults(x.split("don't()")[0]))
    .sum();
}

function getMultiplicationResults(section: string) {
  return [...section.matchAll(/mul\((\d+),(\d+)\)/g)]
    .map(([, x, y]) => Number(x) * Number(y))
    .sum();
}
