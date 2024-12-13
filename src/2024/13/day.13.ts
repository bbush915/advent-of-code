import fs from "fs";

import "@/utils/array";

type Machine = {
  a: number[];
  b: number[];
  prize: number[];
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/13/day.13.input.txt")
    .toString()
    .split("\n\n")
    .map(parseMachine);
}

function parseMachine(value: string): Machine {
  const [a, b, prize] = value
    .split("\n")
    .filter((x) => x)
    .map((x) => x.match(/\d+/g)!.map(Number));

  return {
    a,
    b,
    prize,
  };
}

export function part1() {
  return parseInput().map(getMinimumTokens).sum();
}

export function part2() {
  return parseInput()
    .map((machine) => {
      machine.prize[0] += 10_000_000_000_000;
      machine.prize[1] += 10_000_000_000_000;

      return getMinimumTokens(machine);
    })
    .sum();
}

function getMinimumTokens({ a, b, prize }: Machine) {
  const determinant = a[0] * b[1] - a[1] * b[0];

  if (determinant) {
    const x = b[1] * prize[0] - b[0] * prize[1];
    const y = -a[1] * prize[0] + a[0] * prize[1];

    if (!(x % determinant) && !(y % determinant)) {
      return 3 * (x / determinant) + 1 * (y / determinant);
    }
  }

  return 0;
}
