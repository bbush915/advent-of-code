import fs from "fs";

import "@/utils/array";

function parseInput() {
  const sections = fs
    .readFileSync("src/inputs/2024/19/day.19.input.txt")
    .toString()
    .split("\n\n");

  return {
    towels: sections[0].split(", "),
    designs: sections[1].split("\n").filter((x) => x),
  };
}

export function part1() {
  const { towels, designs } = parseInput();

  return designs.filter((x) => hasArrangement(x, towels)).length;
}

export function part2() {
  const { towels, designs } = parseInput();

  return designs
    .map((x) => getArrangementCount(x, towels, 0, new Map<string, number>()))
    .sum();
}

function hasArrangement(design: string, towels: string[]) {
  const matches = towels.filter((x) => design.startsWith(x)).map((x) => [x]);

  while (matches.length) {
    const match = matches.pop()!;

    const length = match.map((x) => x.length).sum();

    if (length === design.length) {
      return true;
    }

    matches.push(
      ...towels
        .filter((x) => design.slice(length).startsWith(x))
        .map((x) => [...match, x])
    );
  }

  return false;
}

function getArrangementCount(
  design: string,
  towels: string[],
  i: number,
  lookup: Map<string, number>
) {
  if (i === design.length) {
    return 1;
  }

  const key = String(i);

  if (lookup.has(key)) {
    return lookup.get(key)!;
  }

  let count = 0;

  for (const match of towels.filter((x) => design.slice(i).startsWith(x))) {
    count += getArrangementCount(design, towels, i + match.length, lookup);
  }

  lookup.set(key, count);

  return count;
}
