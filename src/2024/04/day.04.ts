import fs from "fs";

const DIRECTIONS = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
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
      if (letters[i][j] !== "X") {
        continue;
      }

      direction: for (const [di, dj] of DIRECTIONS) {
        for (let k = 1; k < 4; k++) {
          if (letters[i + k * di]?.[j + k * dj] !== "XMAS"[k]) {
            continue direction;
          }
        }

        count++;
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
