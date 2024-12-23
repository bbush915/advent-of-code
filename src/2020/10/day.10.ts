import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2020/10/day.10.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => Number(x))
    .sort((x, y) => x - y)
    .map((x, i, arr) => x - (arr[i - 1] || 0))
    .concat(3);
}

export function part1() {
  const differences = parseInput();

  return (
    differences.filter((x) => x === 3).length *
    differences.filter((x) => x === 1).length
  );
}

export function part2() {
  const differences = parseInput();

  return differences
    .map((x, i, arr) => (x === 3 || arr[i + 1] === 3 ? 0 : 1))
    .reduce(
      (acc, cur) => {
        if (cur) {
          acc[acc.length - 1]++;
        } else {
          acc.push(0);
        }
        return acc;
      },
      [0]
    )
    .map<number>((x) => {
      switch (x) {
        case 0:
          return 1;
        case 1:
          return 2;
        case 2:
          return 4;
        case 3:
          return 7;
        default:
          throw new Error();
      }
    })
    .reduce((acc, cur) => ((acc *= cur), acc), 1);
}
