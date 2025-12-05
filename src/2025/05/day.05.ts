import fs from "fs";

function parseInput() {
  const sections = fs
    .readFileSync("src/inputs/2025/05/day.05.input.txt")
    .toString()
    .trim()
    .split("\n\n");

  const ranges = sections[0].split("\n").map((x) => x.split("-").map(Number));

  const ingredients = sections[1].split("\n").map(Number);

  return {
    ranges,
    ingredients,
  };
}

export function part1() {
  const { ranges, ingredients } = parseInput();

  let count = 0;

  for (const ingredient of ingredients) {
    let fresh = false;

    for (const range of ranges) {
      if (ingredient >= range[0] && ingredient <= range[1]) {
        fresh = true;
      }
    }

    if (fresh) {
      count++;
    }
  }

  return count;
}

export function part2() {
  const { ranges } = parseInput();

  ranges.sort((x, y) => (x[0] === y[0] ? x[1] - y[1] : x[0] - y[0]));

  let count = 0;
  let i = 0;

  while (i < ranges.length) {
    let [lo, hi] = ranges[i];

    let j = 1;

    while (i + j < ranges.length && hi >= ranges[i + j][0]) {
      hi = Math.max(hi, ranges[i + j][1]);
      j++;
    }

    count += hi - lo + 1;
    i += j;
  }

  return count;
}
