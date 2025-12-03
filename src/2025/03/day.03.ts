import fs from "fs";

import "@/utils/array";
import { range } from "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2025/03/day.03.input.txt")
    .toString()
    .trim()
    .split("\n")
    .map((x) => x.split("").map(Number));
}

export function part1() {
  return getTotalOutputJoltage(2);
}

export function part2() {
  return getTotalOutputJoltage(12);
}

function getTotalOutputJoltage(batteries: number) {
  const banks = parseInput();

  return banks.map((bank) => getMaximumJoltage(bank, batteries)).sum();
}

function getMaximumJoltage(bank: number[], batteries: number) {
  const indices = range(bank.length - batteries, bank.length);

  for (let n = 0; n < batteries; n++) {
    let max = -1;
    let idx = -1;

    for (let i = (indices[n - 1] ?? -1) + 1; i <= indices[n]; i++) {
      if (bank[i] > max) {
        max = bank[i];
        idx = i;
      }
    }

    indices[n] = idx;
  }

  return getJoltage(bank, indices);
}

function getJoltage(bank: number[], indices: number[]) {
  let value = 0;

  for (const index of indices) {
    value = 10 * value + bank[index];
  }

  return value;
}
