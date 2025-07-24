import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2018/06/day.06.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x, i) => [i + 1, ...x.split(", ").map(Number)]);
}

export function part1() {
  const coordinates = parseInput();

  const bounds1 = getBounds(coordinates, 1.05);
  const bounds2 = getBounds(coordinates, 1.1);

  const counts1 = getCounts(bounds1, coordinates);
  const counts2 = getCounts(bounds2, coordinates);

  return [...counts1.entries()]
    .filter(([id, count]) => counts2.get(id)! === count)
    .sort((x, y) => y[1] - x[1])[0][1];
}

export function part2() {
  const coordinates = parseInput();

  const bounds = getBounds(coordinates, 1.0);

  let count = 0;

  for (let i = bounds[0]; i < bounds[2]; i++) {
    for (let j = bounds[1]; j < bounds[3]; j++) {
      const distance = coordinates
        .map(([, x, y]) => Math.abs(x - i) + Math.abs(y - j))
        .sum();

      if (distance < 10_000) {
        count++;
      }
    }
  }

  return count;
}

function getBounds(coordinates: number[][], scale: number) {
  const bounds = [
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  for (const [, x, y] of coordinates) {
    bounds[0] = Math.min(x, bounds[0]);
    bounds[1] = Math.min(y, bounds[1]);
    bounds[2] = Math.max(x, bounds[2]);
    bounds[3] = Math.max(y, bounds[3]);
  }

  return bounds.map((x) => Math.floor(x * scale));
}

function getCounts(bounds: number[], coordinates: number[][]) {
  const counts = new Map<number, number>();

  for (let i = bounds[0]; i < bounds[2]; i++) {
    for (let j = bounds[1]; j < bounds[3]; j++) {
      const distances = coordinates
        .map(([id, x, y]) => [id, Math.abs(x - i) + Math.abs(y - j)])
        .sort((x, y) => x[1] - y[1]);

      if (distances[0][1] === distances[1][1]) {
        continue;
      }

      counts.set(distances[0][0], (counts.get(distances[0][0]) ?? 0) + 1);
    }
  }

  return counts;
}
