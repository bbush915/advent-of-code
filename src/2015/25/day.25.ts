import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/25/day.25.input.txt")
    .toString()
    .match(/\d+/g)!
    .map(Number);
}

export function part1() {
  const [row, col] = parseInput();

  const m = row + col - 1;
  const n = 0.5 * m * (m - 1) + col - 1;

  let code = 20151125;

  for (let i = 0; i < n; i++) {
    code = (code * 252533) % 33554393;
  }

  return code;
}

export function part2() {
  return "Merry Christmas!";
}
