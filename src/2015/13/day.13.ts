import fs from "fs";

import { getPermutations } from "@/utils/array";
import { lpr } from "@/utils/number";

function parseInput() {
  const happinessLookup = fs
    .readFileSync("src/inputs/2015/13/day.13.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map<[string, string, number]>((x) => {
      const parts = x.split(" ");

      return [
        parts[0],
        parts[10].slice(0, -1),
        Number(parts[3]) * (parts[2] === "gain" ? 1 : -1),
      ];
    })
    .reduce((lookup, [source, target, value]) => {
      if (!lookup.has(source)) {
        lookup.set(source, new Map<string, number>());
      }

      lookup.get(source)!.set(target, value);

      return lookup;
    }, new Map<string, Map<string, number>>());

  const people = [...happinessLookup.keys()];

  return {
    people,
    happinessLookup,
  };
}

export function part1() {
  const { people, happinessLookup } = parseInput();

  return getPermutations(people)
    .map((permutation) =>
      permutation
        .map(
          (person, i) =>
            happinessLookup
              .get(person)!
              .get(permutation[lpr(i + 1, permutation.length)])! +
            happinessLookup
              .get(person)!
              .get(permutation[lpr(i - 1, permutation.length)])!
        )
        .sum()
    )
    .max();
}

export function part2() {
  const { people, happinessLookup } = parseInput();

  happinessLookup.set("Me", new Map<string, number>());

  for (const entry of happinessLookup) {
    if (entry[0] === "Me") {
      continue;
    }

    entry[1].set("Me", 0);
    happinessLookup.get("Me")!.set(entry[0], 0);
  }

  people.push("Me");

  return getPermutations(people)
    .map((permutation) =>
      permutation
        .map(
          (person, i) =>
            happinessLookup
              .get(person)!
              .get(permutation[lpr(i + 1, permutation.length)])! +
            happinessLookup
              .get(person)!
              .get(permutation[lpr(i - 1, permutation.length)])!
        )
        .sum()
    )
    .max();
}
