import fs from "fs";

import { toKey } from "@/utils/common";

function parseInput() {
  const connectionLookup = fs
    .readFileSync("src/inputs/2024/23/day.23.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("-"))
    .reduce((connectionLookup, [computer1, computer2]) => {
      const connections1 = connectionLookup.get(computer1) ?? new Set<string>();
      connectionLookup.set(computer1, connections1.add(computer2));

      const connections2 = connectionLookup.get(computer2) ?? new Set<string>();
      connectionLookup.set(computer2, connections2.add(computer1));

      return connectionLookup;
    }, new Map<string, Set<string>>());

  const computers = [...connectionLookup.keys()];

  return {
    computers,
    connectionLookup,
  };
}

export function part1() {
  const { computers, connectionLookup } = parseInput();

  const sets = new Set<string>();

  for (const x of computers) {
    for (const y of connectionLookup.get(x)!) {
      for (const z of connectionLookup.get(y)!) {
        if (
          connectionLookup.get(x)!.has(z) &&
          [x, y, z].some((computer) => computer.startsWith("t"))
        ) {
          sets.add(toKey([x, y, z].sort()));
        }
      }
    }
  }

  return sets.size;
}

export function part2() {
  const { computers, connectionLookup } = parseInput();

  const sets = computers.map((x) => [x]);

  for (const set of sets) {
    let i = 0;

    while (i < computers.length) {
      if (
        set.includes(computers[i]) ||
        set.some((x) => !connectionLookup.get(x)!.has(computers[i]))
      ) {
        i++;
        continue;
      }

      set.push(computers[i]);
      i = 0;
    }
  }

  return sets
    .sort((x, y) => y.length - x.length)[0]
    .sort()
    .join(",");
}
