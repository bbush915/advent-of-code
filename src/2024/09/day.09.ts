import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/09/day.09.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      return x.split("").map(Number);
    });
}

export function part1() {
  const input = parseInput();

  let total = 0;

  for (const line of input) {
    const filesystem: number[] = [];

    for (let i = 0; i < line.length; i += 2) {
      for (let j = 0; j < line[i]; j++) {
        filesystem.push(Math.floor(i / 2));
      }

      for (let j = 0; j < (line[i + 1] ?? 0); j++) {
        filesystem.push(-1);
      }
    }

    let freeIndex = filesystem.findIndex((x) => x < 0);
    let lastIndex = filesystem.length - 1;

    while (freeIndex < lastIndex) {
      filesystem.splice(freeIndex, 1, filesystem.splice(lastIndex, 1)[0]);

      while (freeIndex <= lastIndex && filesystem[freeIndex] !== -1) {
        freeIndex++;
      }

      lastIndex--;
    }

    for (let i = 0; i < filesystem.length; i++) {
      total += i * (filesystem[i] === -1 ? 0 : filesystem[i]);
    }
  }

  return total;
}

export function part2() {
  const input = parseInput();

  let total = 0;

  for (const line of input) {
    const filesystem: number[] = [];

    for (let i = 0; i < line.length; i += 2) {
      for (let j = 0; j < line[i]; j++) {
        filesystem.push(Math.floor(i / 2));
      }

      for (let j = 0; j < (line[i + 1] ?? 0); j++) {
        filesystem.push(-1);
      }
    }

    for (let n = Math.floor(line.length / 2); n > 0; n--) {
      const count = filesystem.filter((x) => x == n).length;
      const index = filesystem.findIndex((x) => x === n);

      for (let i = 0; i < index; i++) {
        if (filesystem.slice(i, i + count).every((x) => x === -1)) {
          filesystem.splice(
            i,
            count,
            ...filesystem.splice(index, count, ...new Array(count).fill(-1))
          );
          break;
        }
      }
    }

    for (let i = 0; i < filesystem.length; i++) {
      total += i * (filesystem[i] === -1 ? 0 : filesystem[i]);
    }
  }

  return total;
}
