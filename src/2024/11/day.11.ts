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
  const stoneCountLookup = new Map<number, Map<number, number>>();

  return parseInput()
    .map((stone) => blink(stone, 0, blinks, stoneCountLookup))
    .sum();
}

function blink(
  stone: number,
  curBlink: number,
  maxBlink: number,
  stoneCountLookup: Map<number, Map<number, number>>
): number {
  if (curBlink === maxBlink) {
    return 1;
  }

  if (!stoneCountLookup.has(stone)) {
    stoneCountLookup.set(stone, new Map<number, number>());
  }

  let count = stoneCountLookup.get(stone)!.get(maxBlink - curBlink);

  if (count) {
    return count;
  }

  if (!stone) {
    count = blink(1, curBlink + 1, maxBlink, stoneCountLookup);
  } else if (Math.floor(Math.log10(stone)) % 2) {
    const stone_ = stone.toString();

    count =
      blink(
        Number(stone_.slice(0, stone_.length / 2)),
        curBlink + 1,
        maxBlink,
        stoneCountLookup
      ) +
      blink(
        Number(stone_.slice(stone_.length / 2)),
        curBlink + 1,
        maxBlink,
        stoneCountLookup
      );
  } else {
    count = blink(stone * 2024, curBlink + 1, maxBlink, stoneCountLookup);
  }

  stoneCountLookup.get(stone)!.set(maxBlink - curBlink, count);

  return count;
}
