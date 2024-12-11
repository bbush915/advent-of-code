import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/11/day.11.input.txt")
    .toString()
    .split(" ")
    .map(Number);
}

export function part1() {
  return getStoneCount(25);
}

export function part2() {
  return getStoneCount(75);
}

function getStoneCount(blinks: number) {
  const lookup = new Map<string, number>();

  return parseInput()
    .map((stone) => blink(stone, blinks, lookup))
    .sum();
}

function blink(
  stone: number,
  remainingBlinks: number,
  lookup: Map<string, number>
): number {
  if (!remainingBlinks) {
    return 1;
  }

  const key = toKey(stone, remainingBlinks);

  let count = lookup.get(key);

  if (count) {
    return count;
  }

  if (!stone) {
    count = blink(1, remainingBlinks - 1, lookup);
  } else if (Math.floor(Math.log10(stone)) % 2) {
    const stone_ = stone.toString();

    count =
      blink(
        Number(stone_.slice(0, stone_.length / 2)),
        remainingBlinks - 1,
        lookup
      ) +
      blink(
        Number(stone_.slice(stone_.length / 2)),
        remainingBlinks - 1,
        lookup
      );
  } else {
    count = blink(stone * 2024, remainingBlinks - 1, lookup);
  }

  lookup.set(key, count);

  return count;
}

function toKey(stone: number, remainingBlinks: number) {
  return `${stone}|${remainingBlinks}`;
}
