import fs from "fs";

import "@/utils/array";
import { topologicalSort } from "@/utils/graph";

function parseInput() {
  const sections = fs
    .readFileSync("src/inputs/2024/05/day.05.input.txt")
    .toString()
    .split("\n\n");

  const rules = sections[0].split("\n").map((x) => x.split("|").map(Number));

  const updates = sections[1]
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(",").map(Number));

  return {
    rules,
    updates,
  };
}

export function part1() {
  const { rules, updates } = parseInput();

  return updates
    .map((update) =>
      isOrderedCorrectly(
        update,
        getOrderedPages(rules.filter(([x]) => update.includes(x)))
      )
        ? update[Math.floor(update.length / 2)]
        : 0
    )
    .sum();
}

export function part2() {
  const { rules, updates } = parseInput();

  return updates
    .map((update) => {
      const orderedPages = getOrderedPages(
        rules.filter(([x]) => update.includes(x))
      );

      return isOrderedCorrectly(update, orderedPages)
        ? 0
        : update.sort(
            (x, y) =>
              orderedPages.indexOf(x.toString()) -
              orderedPages.indexOf(y.toString())
          )[Math.floor(update.length / 2)];
    })
    .sum();
}

function isOrderedCorrectly(update: number[], orderedPages: string[]) {
  return update
    .map((x) => orderedPages.indexOf(x.toString()))
    .every((x, i, arr) => x >= (arr[i + 1] ?? 0));
}

function getOrderedPages(rules: number[][]) {
  const neighborLookup = rules.reduce((lookup, rule) => {
    const [x, y] = rule.map((x) => x.toString());

    const neighbors = lookup.get(x) ?? [];
    neighbors.push(y);

    lookup.set(x, neighbors);

    if (!lookup.has(y)) {
      lookup.set(y, []);
    }

    return lookup;
  }, new Map<string, string[]>());

  return topologicalSort(neighborLookup);
}
