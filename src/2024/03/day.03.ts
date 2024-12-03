import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/03/day.03.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .join("");
}

export function part1() {
  const memory = parseInput();

  return getMultiplicationResults(memory);
}

export function part2() {
  const memory = parseInput();

  const dontSections = memory.split("don't()");

  let total = getMultiplicationResults(dontSections[0]);

  for (const dontSection of dontSections.slice(1)) {
    const doSections = dontSection.split("do()");

    for (const doSection of doSections.slice(1)) {
      total += getMultiplicationResults(doSection);
    }
  }

  return total;
}

function getMultiplicationResults(section: string) {
  return [...section.matchAll(/mul\((\d+),(\d+)\)/g)]
    .map(([, x, y]) => Number(x) * Number(y))
    .sum();
}
