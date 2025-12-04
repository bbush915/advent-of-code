import fs from "fs";

enum Cells {
  EMPTY = ".",
  PAPER = "@",
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2025/04/day.04.input.txt")
    .toString()
    .trim()
    .split("\n")
    .map((x) => x.split("") as Cells[]);
}

export function part1() {
  const grid = parseInput();

  return removePaper(grid, false);
}

export function part2() {
  const grid = parseInput();

  let count = 0;

  while (1) {
    const removed = removePaper(grid, true);

    if (!removed) {
      break;
    }

    count += removed;
  }

  return count;
}

function removePaper(grid: Cells[][], remove: boolean) {
  let count = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === Cells.EMPTY) {
        continue;
      }

      const adjacent = [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, j - 1],
        [i, j + 1],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ].filter(
        ([i, j]) =>
          i >= 0 &&
          i < grid.length &&
          j >= 0 &&
          j < grid[0].length &&
          grid[i][j] === Cells.PAPER
      ).length;

      if (adjacent < 4) {
        if (remove) {
          grid[i][j] = Cells.EMPTY;
        }

        count++;
      }
    }
  }

  return count;
}
