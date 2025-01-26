import fs from "fs";

import { getPermutations } from "@/utils/array";

function parseInput() {
  const distanceLookup = fs
    .readFileSync("src/inputs/2015/09/day.09.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map<[string, string, number]>((x) => {
      const parts = x.split(" ");
      return [parts[0], parts[2], Number(parts[4])];
    })
    .reduce((lookup, [x, y, distance]) => {
      if (!lookup.has(x)) {
        lookup.set(x, new Map<string, number>());
      }

      lookup.get(x)!.set(y, distance);

      if (!lookup.has(y)) {
        lookup.set(y, new Map<string, number>());
      }

      lookup.get(y)!.set(x, distance);

      return lookup;
    }, new Map<string, Map<string, number>>());

  return {
    locations: [...distanceLookup.keys()],
    distanceLookup,
  };
}

export function part1() {
  const { locations, distanceLookup } = parseInput();

  return getPermutations(locations)
    .map((permutation) =>
      permutation
        .map((x, i) => distanceLookup.get(x)!.get(permutation[i + 1]) ?? 0)
        .sum()
    )
    .min();
}

export function part2() {
  const { locations, distanceLookup } = parseInput();

  return getPermutations(locations)
    .map((permutation) =>
      permutation
        .map((x, i) => distanceLookup.get(x)!.get(permutation[i + 1]) ?? 0)
        .sum()
    )
    .max();
}
