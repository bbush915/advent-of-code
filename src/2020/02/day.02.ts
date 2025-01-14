import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2020/02/day.02.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" ");

      const [low, high] = parts[0].split("-").map((x) => Number(x));
      const letter = parts[1][0];
      const password = parts[2];

      return {
        low,
        high,
        letter,
        password,
      };
    });
}

export function part1() {
  return parseInput().reduce((count, { low, high, letter, password }) => {
    const occurrences = password.split("").filter((x) => x === letter).length;

    if (occurrences >= low && occurrences <= high) {
      count++;
    }

    return count;
  }, 0);
}

export function part2() {
  return parseInput().reduce((count, { low, high, letter, password }) => {
    if (
      (password[low - 1] === letter ? 1 : 0) +
        (password[high - 1] === letter ? 1 : 0) ===
      1
    ) {
      count++;
    }

    return count;
  }, 0);
}
