import fs from "fs";

import "@/utils/array";
import { clone, toKey } from "@/utils/common";

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
  const combinations = getCombinations(eggnog);
  const minimum = combinations.map((x) => x.sum()).min();

  return combinations.filter((x) => x.sum() === minimum).length;
}

function getCombinations(eggnog: number) {
  const containers = parseInput();

  const combinations = getCombinationsHelper(
    containers,
    new Array(containers.length).fill(0),
    eggnog,
    new Set<string>(),
    new Set<string>()
  );

  return [...combinations.values()].map(fromKey);
}

function getCombinationsHelper(
  containers: number[],
  filled: number[],
  eggnog: number,
  combinations: Set<string>,
  lookup: Set<string>
) {
  const key = toKey(filled);

  if (eggnog === 0) {
    combinations.add(key);
  } else if (!lookup.has(key)) {
    for (let i = 0; i < containers.length; i++) {
      if (filled[i] || containers[i] > eggnog) {
        continue;
      }

      const filled_ = clone(filled);
      filled_[i] = 1;

      getCombinationsHelper(
        containers,
        filled_,
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
