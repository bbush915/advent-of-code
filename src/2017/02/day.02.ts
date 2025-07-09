import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/02/day.02.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(/\s+/g).map(Number));
}

export function part1() {
  const spreadsheet = parseInput();

  let checksum = 0;

  for (const row of spreadsheet) {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (const cell of row) {
      if (cell > max) {
        max = cell;
      }

      if (cell < min) {
        min = cell;
      }
    }

    checksum += max - min;
  }

  return checksum;
}

export function part2() {
  const spreadsheet = parseInput();

  let checksum = 0;

  for (const row of spreadsheet) {
    for (let i = 0; i < row.length; i++) {
      for (let j = i + 1; j < row.length; j++) {
        if (!(row[i] % row[j])) {
          checksum += row[i] / row[j];
        }

        if (!(row[j] % row[i])) {
          checksum += row[j] / row[i];
        }
      }
    }
  }

  return checksum;
}
