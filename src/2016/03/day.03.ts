import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/03/day.03.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.match(/\d+/g)!.map(Number));
}

export function part1() {
  const triangles = parseInput();

  return triangles.map((triangle) => (isValid(triangle) ? 1 : 0)).sum();
}

export function part2() {
  const triangles = parseInput();

  let x = 0;
  let y = 0;

  let count = 0;

  while (y <= 3) {
    const triangle = [
      triangles[x + 0][y],
      triangles[x + 1][y],
      triangles[x + 2][y],
    ];

    count += isValid(triangle) ? 1 : 0;

    x += 3;

    if (x >= triangles.length) {
      x = 0;
      y++;
    }
  }

  return count;
}

function isValid(triangle: number[]) {
  triangle.sort((x, y) => x - y);
  return triangle[0] + triangle[1] > triangle[2];
}
