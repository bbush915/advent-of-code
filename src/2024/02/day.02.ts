import fs from "fs";

import { clone } from "@/utils/common";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/02/day.02.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" ").map(Number));
}

export function part1() {
  return parseInput().filter((x) => isSafe(x)).length;
}

export function part2() {
  return parseInput().filter((x) => isSafeWithSingleRemoval(x)).length;
}

function isSafe(report: number[]) {
  const differences: number[] = [];

  for (let i = 1; i < report.length; i++) {
    differences.push(report[i] - report[i - 1]);
  }

  // NOTE - Adjacent levels must differ by at least one and at most three.

  if (differences.some((x) => !x || Math.abs(x) > 3)) {
    return false;
  }

  // NOTE - Levels must be either all increasing or all decreasing.

  if (new Set<number>(differences.map((x) => Math.sign(x))).size > 1) {
    return false;
  }

  return true;
}

function isSafeWithSingleRemoval(report: number[]) {
  if (isSafe(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i++) {
    const report_ = clone(report);

    report_.splice(i, 1);

    if (isSafe(report_)) {
      return true;
    }
  }

  return false;
}
