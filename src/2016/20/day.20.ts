import fs from "fs";

import "@/utils/array";
import { Interval } from "@/utils/geometry";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/20/day.20.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("-").map(Number) as Interval);
}

export function part1() {
  const intervals = parseInput();

  let i = 0;

  while (1) {
    const hits = intervals.filter(([a, b]) => i >= a && i <= b);

    if (!hits.length) {
      break;
    }

    i = hits.map(([, b]) => b).max() + 1;
  }

  return i;
}

export function part2() {
  const intervals = parseInput();

  let i = 0;
  let count = 0;

  while (i < 4_294_967_295) {
    const hits = intervals.filter(([a, b]) => i >= a && i <= b);

    if (!hits.length) {
      const next = intervals
        .filter(([a]) => a > i)
        .sort((x, y) => x[0] - y[0])[0];

      count += next[0] - i;
      i = next[0];

      continue;
    }

    i = hits.map(([, b]) => b).max() + 1;
  }

  return count;
}
