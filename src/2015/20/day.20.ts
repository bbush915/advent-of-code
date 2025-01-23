import fs from "fs";

function parseInput() {
  return Number(
    fs.readFileSync("src/inputs/2015/20/day.20.input.txt").toString()
  );
}

export function part1() {
  const presents = parseInput();

  let n = 1;

  while (1) {
    let total = 10 * n;

    for (let i = 1; i <= Math.floor(n / 2); i++) {
      if (n % i === 0) {
        total += 10 * i;
      }
    }

    if (total >= presents) {
      return n;
    }

    n++;
  }
}

export function part2() {
  const presents = parseInput();

  let n = 1;

  while (1) {
    let total = 11 * n;

    for (let i = 1; i <= Math.floor(n / 2); i++) {
      if (n % i === 0 && n <= 50 * i) {
        total += 11 * i;
      }
    }

    if (total >= presents) {
      return n;
    }

    n++;
  }
}
