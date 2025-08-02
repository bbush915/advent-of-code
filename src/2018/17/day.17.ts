import fs from "fs";

import "@/utils/array";
import { cartesian, range } from "@/utils/array";
import { toKey } from "@/utils/common";

type Line = {
  x: number[];
  y: number[];
};

type Grid = CellTypes[][];

type Cell = [number, number];

enum CellTypes {
  CLAY = "#",
  SAND = ".",
  MUD = "|",
  WATER = "~",
}

function parseInput() {
  const cells = fs
    .readFileSync("src/inputs/2018/17/day.17.input.txt")
    .toString()
    .trim()
    .split("\n")
    .flatMap(parseCells);

  const bounds = [
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  for (const [i, j] of cells) {
    bounds[0] = Math.min(i, bounds[0]);
    bounds[1] = Math.min(j, bounds[1]);
    bounds[2] = Math.max(i, bounds[2]);
    bounds[3] = Math.max(j, bounds[3]);
  }

  const grid: Grid = new Array(bounds[3] - bounds[1] + 1)
    .fill(null)
    .map(() => new Array(bounds[2] - bounds[0] + 1 + 2).fill(CellTypes.SAND));

  for (const [i, j] of cells) {
    grid[j - bounds[1]][i - bounds[0] + 1] = CellTypes.CLAY;
  }

  const source: Cell = [0, 500 - bounds[0] + 1];

  fill(grid, source);

  return grid;
}

function parseCells(value: string) {
  const parts = value.split(", ");

  const line = parts.reduce((line, part) => {
    const min = Number(part.slice(2).split("..")[0]);
    const max = Number(part.slice(2).split("..").at(-1));

    line[part[0] as keyof Line] = range(min, max + 1);

    return line;
  }, {} as Line);

  return cartesian(line.x, line.y) as Cell[];
}

function fill(grid: Grid, source: Cell) {
  const sources = [source];
  const lookup = new Map<string, number>();

  while (sources.length) {
    const cell = sources.pop()!;

    const key = toKey(cell);

    lookup.set(key, (lookup.get(key) ?? 0) + 1);

    if (lookup.get(key)! > 4) {
      continue;
    }

    let full = false;
    let cascade: Cell | null = null;

    while (!full) {
      [full, cascade] = tryProduce(grid, cell);
    }

    if (cascade) {
      const sources_: Cell[] = [];

      const [i, j] = cascade;

      if (i === cell[0] && j === cell[1]) {
        sources.pop();
        continue;
      }

      let l = j;

      while (
        grid[i][l] !== CellTypes.CLAY &&
        [CellTypes.CLAY, CellTypes.WATER].includes(grid[i + 1][l])
      ) {
        grid[i][l] = CellTypes.MUD;
        l--;
      }

      if (grid[i][l] !== CellTypes.CLAY) {
        grid[i][l] = CellTypes.MUD;
        sources_.push([i, l]);
      }

      let r = j;

      while (
        grid[i][r] !== CellTypes.CLAY &&
        [CellTypes.CLAY, CellTypes.WATER].includes(grid[i + 1][r])
      ) {
        grid[i][r] = CellTypes.MUD;
        r++;
      }

      if (grid[i][r] !== CellTypes.CLAY) {
        grid[i][r] = CellTypes.MUD;
        sources_.push([i, r]);
      }

      if (sources_.length) {
        sources_.unshift(cell);

        sources.push(...sources_);
      }
    }
  }
}

function tryProduce(grid: Grid, cell: Cell): [boolean, Cell | null] {
  let [i, j] = cell;

  loop: while (1) {
    if (grid[i][j] === CellTypes.SAND) {
      grid[i][j] = CellTypes.MUD;
    }

    switch (grid[i + 1]?.[j]) {
      case CellTypes.CLAY: {
        const [l, r] = getBounds(grid, [i, j]);

        if (
          grid[i][l - 1] !== CellTypes.CLAY ||
          grid[i][r + 1] !== CellTypes.CLAY
        ) {
          return [true, [i, j]];
        }

        grid[i][j] = CellTypes.WATER;

        break loop;
      }

      case CellTypes.SAND:
      case CellTypes.MUD: {
        break;
      }

      case CellTypes.WATER: {
        if (tryDisplace(grid, [i + 1, j])) {
          break;
        }

        const [l, r] = getBounds(grid, [i, j]);

        if (
          grid[i][l - 1] !== CellTypes.CLAY ||
          grid[i][r + 1] !== CellTypes.CLAY
        ) {
          return [true, [i, j]];
        }

        if (i === cell[0] && j === cell[1]) {
          return [true, null];
        }

        grid[i][j] = CellTypes.WATER;

        break loop;
      }

      default: {
        return [true, null];
      }
    }

    i++;
  }

  return [false, null];
}

function tryDisplace(grid: Grid, [i, j]: Cell) {
  let l = j;

  while (
    grid[i][l - 1] === CellTypes.WATER &&
    [CellTypes.CLAY, CellTypes.WATER].includes(grid[i + 1][l - 1])
  ) {
    l--;
  }

  let r = j;

  while (
    grid[i][r + 1] === CellTypes.WATER &&
    [CellTypes.CLAY, CellTypes.WATER].includes(grid[i + 1][r + 1])
  ) {
    r++;
  }

  if (grid[i][l - 1] === CellTypes.CLAY && grid[i][r + 1] === CellTypes.CLAY) {
    return false;
  } else if (grid[i][l - 1] === CellTypes.CLAY) {
    grid[i][r + 1] = CellTypes.WATER;
  } else if (grid[i][r + 1] === CellTypes.CLAY) {
    grid[i][l - 1] = CellTypes.WATER;
  } else {
    if (j - l <= r - j) {
      grid[i][l - 1] = CellTypes.WATER;
    } else {
      grid[i][r + 1] = CellTypes.WATER;
    }
  }

  return true;
}

function getBounds(grid: Grid, [i, j]: Cell) {
  let l = j;

  while (
    grid[i][l - 1] !== CellTypes.CLAY &&
    [CellTypes.CLAY, CellTypes.WATER].includes(grid[i + 1][l - 1])
  ) {
    l--;
  }

  let r = j;

  while (
    grid[i][r + 1] !== CellTypes.CLAY &&
    [CellTypes.CLAY, CellTypes.WATER].includes(grid[i + 1][r + 1])
  ) {
    r++;
  }

  return [l, r];
}

export function part1() {
  const grid = parseInput();

  return grid
    .map(
      (row) =>
        row.filter((cell) => [CellTypes.MUD, CellTypes.WATER].includes(cell))
          .length
    )
    .sum();
}

export function part2() {
  const grid = parseInput();

  return grid
    .map((row) => row.filter((cell) => cell === CellTypes.WATER).length)
    .sum();
}
