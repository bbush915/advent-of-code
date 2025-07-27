import fs from "fs";

import "@/utils/array";

function parseInput() {
  return Number(
    fs.readFileSync("src/inputs/2018/11/day.11.input.txt").toString().trim()
  );
}

export function part1() {
  const serial = parseInput();
  const partialsGrid = makePartialsGrid(serial);

  return getMaximumTotalPowerLevel(partialsGrid, 3, 3, false);
}

export function part2() {
  const serial = parseInput();
  const partialsGrid = makePartialsGrid(serial);

  return getMaximumTotalPowerLevel(partialsGrid, 1, 300, true);
}

function getMaximumTotalPowerLevel(
  partialsGrid: number[][],
  min: number,
  max: number,
  includeSize: boolean
) {
  let maximumTotalPower = 0;
  let identifier: string;

  for (let n = min; n <= max; n++) {
    for (let i = 0; i < 300 - n + 1; i++) {
      for (let j = 0; j < 300 - n + 1; j++) {
        const totalPower =
          partialsGrid[i + n - 1][j + n - 1] -
          (partialsGrid[i + n - 1][j - 1] ?? 0) -
          (partialsGrid[i - 1]?.[j + n - 1] ?? 0) +
          (partialsGrid[i - 1]?.[j - 1] ?? 0);

        if (totalPower > maximumTotalPower) {
          maximumTotalPower = totalPower;

          identifier = `${j + 1},${i + 1}`;

          if (includeSize) {
            identifier += `,${n}`;
          }
        }
      }
    }
  }

  return identifier!;
}

function makePartialsGrid(serial: number) {
  const grid: number[][] = [];

  for (let i = 0; i < 300; i++) {
    const row: number[] = [];

    for (let j = 0; j < 300; j++) {
      row.push(
        getPowerLevel(j + 1, i + 1, serial) +
          (row[j - 1] ?? 0) +
          (grid[i - 1]?.[j] ?? 0) -
          (grid[i - 1]?.[j - 1] ?? 0)
      );
    }

    grid.push(row);
  }

  return grid;
}

function getPowerLevel(x: number, y: number, serial: number) {
  const rack = x + 10;

  return Math.floor(((rack * (rack * y + serial)) % 1_000) / 100) - 5;
}
