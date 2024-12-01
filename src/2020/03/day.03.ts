import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2020/03/day.03.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x);
}

export function part1() {
  const map = parseInput();

  return countTrees(map, 1, 3);
}

export function part2() {
  const map = parseInput();

  return [
    { dx: 1, dy: 1 },
    { dx: 1, dy: 3 },
    { dx: 1, dy: 5 },
    { dx: 1, dy: 7 },
    { dx: 2, dy: 1 },
  ]
    .map(({ dx, dy }) => countTrees(map, dx, dy))
    .reduce((acc, cur) => ((acc *= cur), acc), 1);
}

function countTrees(map: string[], dx: number, dy: number) {
  return map.reduce(
    (acc, cur) => {
      if (acc.x % dx === 0) {
        if (cur[acc.y] === "#") {
          acc.count++;
        }

        acc.y = (acc.y + dy) % cur.length;
      }

      acc.x++;

      return acc;
    },
    { x: 0, y: 0, count: 0 }
  ).count;
}
