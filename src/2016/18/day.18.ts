import fs from "fs";

import "@/utils/array";

enum Tiles {
  SAFE = ".",
  TRAP = "^",
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/18/day.18.input.txt")
    .toString()
    .trim()
    .split("") as Tiles[];
}

export function part1(rows = 40) {
  return getSafeCount(rows);
}

export function part2() {
  return getSafeCount(400_000);
}

function getSafeCount(rows: number) {
  const room = [parseInput()];

  for (let i = 1; i < rows; i++) {
    const row: Tiles[] = [];

    for (let j = 0; j < room[0].length; j++) {
      const comparison =
        (room[i - 1][j - 1] ?? Tiles.SAFE) +
        room[i - 1][j] +
        (room[i - 1][j + 1] ?? Tiles.SAFE);

      switch (comparison) {
        case `${Tiles.TRAP}${Tiles.TRAP}${Tiles.SAFE}`:
        case `${Tiles.SAFE}${Tiles.TRAP}${Tiles.TRAP}`:
        case `${Tiles.TRAP}${Tiles.SAFE}${Tiles.SAFE}`:
        case `${Tiles.SAFE}${Tiles.SAFE}${Tiles.TRAP}`: {
          row.push(Tiles.TRAP);
          break;
        }

        default: {
          row.push(Tiles.SAFE);
          break;
        }
      }
    }

    room.push(row);
  }

  return room
    .map((row) => row.filter((tile) => tile === Tiles.SAFE).length)
    .sum();
}
