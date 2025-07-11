import fs from "fs";

import "@/utils/array";
import { toKey } from "@/utils/common";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/06/day.06.input.txt")
    .toString()
    .trim()
    .split(/\s+/)
    .map(Number);
}

export function part1() {
  const [loopCycle] = getRedistributionLoop()!;
  return loopCycle;
}

export function part2() {
  const [, loopSize] = getRedistributionLoop()!;
  return loopSize;
}

function getRedistributionLoop() {
  const blocks = parseInput();

  let cycle = 0;
  const cache = new Map<string, number>();

  while (1) {
    const key = toKey(blocks);

    if (cache.has(key)) {
      return [cycle, cycle - cache.get(key)!];
    } else {
      cache.set(key, cycle);
    }

    const max = blocks.max();
    const index = blocks.findIndex((x) => x === max)!;

    blocks[index] = 0;

    for (let i = 0; i < max; i++) {
      blocks[(index + 1 + i) % blocks.length]++;
    }

    cycle++;
  }
}
