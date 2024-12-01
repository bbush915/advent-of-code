import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2020/01/day.01.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map(Number);
}

export function part1() {
  let answer: number;

  parseInput().forEach((x, idx, arr) => {
    arr.slice(idx).forEach((y) => {
      if (x + y === 2020) {
        answer = x * y;
        return;
      }
    });

    if (answer) {
      return;
    }
  });

  return answer!;
}

export function part2() {
  let answer: number;

  parseInput().forEach((x, idx1, arr1) => {
    arr1.slice(idx1).forEach((y, idx2, arr2) => {
      arr2.slice(idx2).forEach((z) => {
        if (x + y + z === 2020) {
          answer = x * y * z;
          return;
        }
      });

      if (answer) {
        return;
      }
    });

    if (answer) {
      return;
    }
  });

  return answer!;
}
