import fs from "fs";

import "@/utils/array";
import { toKey } from "@/utils/common";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/17/day.17.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(Number);
}

export function part1(eggnog = 150) {
  return getCombinations(eggnog).length;
}

export function part2(eggnog = 150) {
  return getCombinations(eggnog)
    .map((x) => x.sum())
    .reduce(
      (lookup, count) => lookup.set(count, (lookup.get(count) ?? 0) + 1),
      new Map<number, number>()
    )
    .entries()
    .toArray()
    .sort((x, y) => x[0] - y[0])[0][1];
}

function getCombinations(eggnog: number) {
  const containers = parseInput();

  return getCombinationsHelper(
    containers,
    new Array(containers.length).fill(0),
    eggnog,
    new Set<string>(),
    new Set<string>()
  )
    .values()
    .map(fromKey)
    .toArray();
}

function getCombinationsHelper(
  containers: number[],
  combination: number[],
  eggnog: number,
  combinations: Set<string>,
  lookup: Set<string>
) {
  const key = toKey(combination);

  if (eggnog === 0) {
    combinations.add(key);
  } else if (!lookup.has(key)) {
    for (let i = 0; i < containers.length; i++) {
      if (combination[i] || containers[i] > eggnog) {
        continue;
      }

      const combination_ = [...combination];
      combination_[i] = 1;

      getCombinationsHelper(
        containers,
        combination_,
        eggnog - containers[i],
        combinations,
        lookup
      );
    }

    lookup.add(key);
  }

  return combinations;
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
