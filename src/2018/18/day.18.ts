import fs from "fs";

import { clone } from "@/utils/common";

enum Cells {
  OPEN = ".",
  TREES = "|",
  LUMBERYARD = "#",
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2018/18/day.18.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("") as Cells[]);
}

export function part1() {
  const grid = parseInput();

  for (let n = 0; n < 10; n++) {
    update(grid);
  }

  return getResourceValue(grid);
}

export function part2() {
  const grid = parseInput();

  let n = 0;
  const cache = new Map<string, number>();

  while (1) {
    update(grid);

    n++;

    const key = grid.map((x) => x.join("")).join("\n");

    if (cache.has(key)) {
      const base = cache.get(key)!;
      const period = n - base;

      const grid_ = [...cache.entries()]
        .find((x) => x[1] === base + ((1_000_000_000 - base) % period))![0]
        .split("\n")
        .map((x) => x.split("") as Cells[]);

      return getResourceValue(grid_);
    } else {
      cache.set(key, n);
    }
  }
}

function update(grid: Cells[][]) {
  let grid_ = clone(grid);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const cellCounts = getCellCounts(
        [
          [i - 1, j - 1],
          [i - 1, j],
          [i - 1, j + 1],
          [i, j - 1],
          [i, j + 1],
          [i + 1, j - 1],
          [i + 1, j],
          [i + 1, j + 1],
        ]
          .filter(
            ([i, j]) =>
              i >= 0 && i < grid.length && j >= 0 && j < grid[i].length
          )
          .map(([i, j]) => grid_[i][j])
      );

      switch (grid_[i][j]) {
        case Cells.OPEN: {
          if (cellCounts.get(Cells.TREES)! >= 3) {
            grid[i][j] = Cells.TREES;
          }

          break;
        }

        case Cells.TREES: {
          if (cellCounts.get(Cells.LUMBERYARD)! >= 3) {
            grid[i][j] = Cells.LUMBERYARD;
          }

          break;
        }

        case Cells.LUMBERYARD: {
          if (
            !cellCounts.get(Cells.LUMBERYARD)! ||
            !cellCounts.get(Cells.TREES)!
          ) {
            grid[i][j] = Cells.OPEN;
          }

          break;
        }
      }
    }
  }
}

function getResourceValue(grid: Cells[][]) {
  const cellCounts = getCellCounts(grid.flat());

  return cellCounts.get(Cells.TREES)! * cellCounts.get(Cells.LUMBERYARD)!;
}

function getCellCounts(cells: Cells[]) {
  return cells.reduce(
    (lookup, cell) => lookup.set(cell, lookup.get(cell)! + 1),
    new Map<Cells, number>([
      [Cells.OPEN, 0],
      [Cells.TREES, 0],
      [Cells.LUMBERYARD, 0],
    ])
  );
}
