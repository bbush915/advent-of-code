import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/07/day.07.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => [...x.matchAll(/\d+/g)].map(Number));
}

export function part1() {
  return getTotalCalibrationResult(false);
}

export function part2() {
  return getTotalCalibrationResult(true);
}

function getTotalCalibrationResult(includeConcatenation: boolean) {
  const equations = parseInput();

  return equations
    .filter((x) => canProduceTestValue(x, includeConcatenation))
    .map((x) => x[0])
    .sum();
}

function canProduceTestValue(
  [testValue, ...numbers]: number[],
  includeConcatenation: boolean
) {
  let values = [numbers[0]];

  for (const number of numbers.slice(1)) {
    const workingValues = [];

    for (const value of values) {
      const sum = value + number;
      if (sum <= testValue) workingValues.push(sum);

      const product = value * number;
      if (product <= testValue) workingValues.push(product);

      if (includeConcatenation) {
        const concatenation = Number(`${value}${number}`);
        if (concatenation <= testValue) workingValues.push(concatenation);
      }
    }

    values = workingValues;
  }

  return values.includes(testValue);
}
