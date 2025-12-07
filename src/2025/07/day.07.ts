import fs from "fs";

import { toKey } from "@/utils/common";

enum Cells {
  EMPTY = ".",
  START = "S",
  SPLITTER = "^",
}

function parseInput() {
  const grid = fs
    .readFileSync("src/inputs/2025/07/day.07.input.txt")
    .toString()
    .trim()
    .split("\n")
    .map((x) => x.split("") as Cells[]);

  let start: number[];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === Cells.START) {
        start = [i, j];
      }
    }
  }

  return {
    grid,
    start: start!,
  };
}

export function part1() {
  const [splitCount] = getManifoldCounts();
  return splitCount;
}

export function part2() {
  const [, pathCount] = getManifoldCounts();
  return pathCount;
}

function getManifoldCounts() {
  const { grid, start } = parseInput();

  const beams = [[...start, 1]];

  const visited = new Set<string>();

  let splitCount = 0;
  let pathCount = 0;

  while (beams.length) {
    const [i, j, n] = beams.shift()!;

    const key = toKey([i, j]);

    if (visited.has(key)) {
      const beam = beams.find((x) => x[0] === i + 1 && x[1] === j)!;
      beam[2] += n;
      continue;
    } else {
      visited.add(key);
    }

    if (i >= grid.length) {
      pathCount += n;
      continue;
    }

    if (grid[i][j] === Cells.SPLITTER) {
      beams.push([i + 1, j - 1, n], [i + 1, j + 1, n]);
      splitCount++;
    } else {
      beams.push([i + 1, j, n]);
    }
  }

  return [splitCount, pathCount];
}
