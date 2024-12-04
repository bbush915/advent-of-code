import fs from "fs";

const DIRECTIONS = [
  [
    [0, 0],
    [-1, 0],
    [-2, 0],
    [-3, 0],
  ],
  [
    [0, 0],
    [-1, 1],
    [-2, 2],
    [-3, 3],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 0],
    [1, -1],
    [2, -2],
    [3, -3],
  ],
  [
    [0, 0],
    [0, -1],
    [0, -2],
    [0, -3],
  ],
  [
    [0, 0],
    [-1, -1],
    [-2, -2],
    [-3, -3],
  ],
];

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/04/day.04.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));
}

export function part1() {
  const letters = parseInput();

  let count = 0;

  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters[i].length; j++) {
      for (const direction of DIRECTIONS) {
        let word = "";

        for (const [di, dj] of direction) {
          word += letters[i + di]?.[j + dj] ?? ".";
        }

        if (word === "XMAS") {
          count++;
        }
      }
    }
  }

  return count;
}

export function part2() {
  const letters = parseInput();

  let count = 0;

  for (let i = 1; i < letters.length - 1; i++) {
    for (let j = 1; j < letters[i].length - 1; j++) {
      if (letters[i][j] !== "A") {
        continue;
      }

      const tlbr = new Set([letters[i - 1][j - 1], letters[i + 1][j + 1]]);

      if (!tlbr.has("M") || !tlbr.has("S")) {
        continue;
      }

      const trbl = new Set([letters[i - 1][j + 1], letters[i + 1][j - 1]]);

      if (!trbl.has("M") || !trbl.has("S")) {
        continue;
      }

      count++;
    }
  }

  return count;
}
