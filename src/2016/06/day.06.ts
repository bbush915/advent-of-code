import fs from "fs";

import { toKey } from "@/utils/common";

type ColumnCharacterCount = [number, string, number];

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/06/day.06.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x);
}

export function part1() {
  return getMessage(sortMostCommon);
}

export function part2() {
  return getMessage(sortLeastCommon);
}

function getMessage(
  comparator: (x: ColumnCharacterCount, y: ColumnCharacterCount) => number
) {
  const messages = parseInput();

  return [
    ...messages
      .flatMap((x) =>
        x.split("").map((character, column) => [column, character])
      )
      .reduce((lookup, [column, character]) => {
        const key = toKey([column, character]);

        lookup.set(key, (lookup.get(key) ?? 0) + 1);
        return lookup;
      }, new Map<string, number>())
      .entries(),
  ]
    .map<ColumnCharacterCount>(([key, count]) => {
      const [column, character] = key.split("|");

      return [Number(column), character, count];
    })
    .sort(comparator)
    .reduce((correction, [column, character]) => {
      if (correction[column] === "_") {
        correction =
          correction.slice(0, column) +
          character +
          correction.slice(column + 1);
      }

      return correction;
    }, "_".repeat(messages[0].length));
}

function sortMostCommon(x: ColumnCharacterCount, y: ColumnCharacterCount) {
  if (x[0] === y[0]) {
    return y[2] - x[2];
  }

  return x[0] - y[0];
}

function sortLeastCommon(x: ColumnCharacterCount, y: ColumnCharacterCount) {
  if (x[0] === y[0]) {
    return x[2] - y[2];
  }

  return x[0] - y[0];
}
