import fs from "fs";

import { getKnotHash } from "2017/utils/knot-hash";
import "@/utils/array";
import { toKey } from "@/utils/common";

function parseInput() {
  const key = fs
    .readFileSync("src/inputs/2017/14/day.14.input.txt")
    .toString()
    .trim();

  return getGrid(key);
}

function getGrid(key: string) {
  const grid: number[][] = [];

  for (let n = 0; n < 128; n++) {
    const row = getKnotHash(`${key}-${n}`)
      .split("")
      .flatMap((x) =>
        parseInt(x, 16).toString(2).padStart(4, "0").split("").map(Number)
      );

    grid.push(row);
  }

  return grid;
}

export function part1() {
  const grid = parseInput();

  return grid.flat().sum();
}

export function part2() {
  const grid = parseInput();
  const regions: Set<string>[] = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (!grid[i][j]) {
        continue;
      }

      const key = toKey([i, j]);

      if (regions.some((x) => x.has(key))) {
        continue;
      }

      const region = getRegion(grid, i, j);
      regions.push(region);
    }
  }

  return regions.length;
}

function getRegion(grid: number[][], i: number, j: number) {
  const region = new Set<string>();

  const queue = [[i, j]];

  while (queue.length) {
    const [i, j] = queue.pop()!;
    const key = toKey([i, j]);

    if (region.has(key)) {
      continue;
    }

    region.add(key);

    const neighbors = [
      [i - 1, j],
      [i, j + 1],
      [i + 1, j],
      [i, j - 1],
    ].filter(
      ([i, j]) =>
        i >= 0 && i < grid.length && j >= 0 && j < grid[i].length && grid[i][j]
    );

    queue.push(...neighbors);
  }

  return region;
}
