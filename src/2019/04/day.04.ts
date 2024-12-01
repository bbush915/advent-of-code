import fs from "fs";

function parseInput() {
  const [minimum, maximum] = fs
    .readFileSync("src/inputs/2019/04/day.04.input.txt", "utf-8")
    .split("-")
    .map(Number);

  return { minimum, maximum };
}

export function part1() {
  const { minimum, maximum } = parseInput();

  let count = 0;

  outer: for (let i = minimum; i <= maximum; i++) {
    const digits = i.toString().split("").map(Number);

    let hasAdjacentDuplicate = false;

    for (let n = 1; n < digits.length; n++) {
      if (digits[n] === digits[n - 1]) {
        hasAdjacentDuplicate = true;
        break;
      }
    }

    if (!hasAdjacentDuplicate) {
      continue;
    }

    for (let n = 1; n < digits.length; n++) {
      if (digits[n] < digits[n - 1]) {
        continue outer;
      }
    }

    count++;
  }

  return count;
}

export function part2() {
  return 0;
}
