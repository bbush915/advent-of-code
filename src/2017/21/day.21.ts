import fs from "fs";

import "@/utils/array";

type Rule = {
  inputLookup: Set<string>;
  output: string;
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/21/day.21.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseRule);
}

function parseRule(value: string): Rule {
  const parts = value.split(" => ");

  const inputLookup = new Set<string>();

  let input = parts[0];

  for (let n = 0; n < 4; n++) {
    input = rotate(input);
    inputLookup.add(input);
  }

  input = flip(input);

  for (let n = 0; n < 4; n++) {
    input = rotate(input);
    inputLookup.add(input);
  }

  return {
    inputLookup,
    output: parts[1],
  };
}

function rotate(input: string) {
  const rows = input.split("/").reverse();

  const grid: string[][] = [];

  for (let i = 0; i < rows.length; i++) {
    const row: string[] = [];

    for (let j = 0; j < rows.length; j++) {
      row.push(rows[j][i]);
    }

    grid.push(row);
  }

  return fromGrid(grid);
}

function flip(input: string) {
  return input.split("/").reverse().join("/");
}

export function part1() {
  return getPixelCount(5);
}

export function part2() {
  return getPixelCount(18);
}

function getPixelCount(iterations: number) {
  const rules = parseInput();

  let grid = [
    [".", "#", "."],
    [".", ".", "#"],
    ["#", "#", "#"],
  ];

  for (let n = 0; n < iterations; n++) {
    grid = getExpandedGrid(grid, rules);
  }

  return grid.map((x) => x.filter((x) => x === "#").length).sum();
}

function getExpandedGrid(grid: string[][], rules: Rule[]) {
  const subgridSize = grid.length % 2 ? 3 : 2;
  const expandedSubgridSize = subgridSize + 1;

  const expandedGrid: string[][] = [];

  for (let i = 0; i < grid.length / subgridSize; i++) {
    const expandedSubgrids: string[][][] = [];

    for (let j = 0; j < grid.length / subgridSize; j++) {
      const subgrid: string[][] = [];

      for (let m = 0; m < subgridSize; m++) {
        const row: string[] = [];

        for (let n = 0; n < subgridSize; n++) {
          row.push(grid[i * subgridSize + m][j * subgridSize + n]);
        }

        subgrid.push(row);
      }

      const expandedSubgrid = getExpandSubgrid(subgrid, rules)!;
      expandedSubgrids.push(expandedSubgrid);
    }

    for (let m = 0; m < expandedSubgridSize; m++) {
      const row: string[] = [];

      for (let n = 0; n < expandedSubgridSize * expandedSubgrids.length; n++) {
        row.push(
          expandedSubgrids[Math.floor(n / expandedSubgridSize)][m][
            n % expandedSubgridSize
          ]
        );
      }

      expandedGrid.push(row);
    }
  }

  return expandedGrid;
}

function getExpandSubgrid(subgrid: string[][], rules: Rule[]) {
  const input = fromGrid(subgrid);

  for (const rule of rules) {
    if (rule.inputLookup.has(input)) {
      return toGrid(rule.output);
    }
  }
}

function toGrid(value: string) {
  return value.split("/").map((x) => x.split(""));
}

function fromGrid(grid: string[][]) {
  return grid.map((x) => x.join("")).join("/");
}
