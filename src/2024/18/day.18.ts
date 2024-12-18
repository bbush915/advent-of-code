import fs from "fs";

import { toKey } from "@/utils/common";
import { search } from "@/utils/graph";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/18/day.18.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => toKey(...x.split(",").map(Number)));
}

export function part1(width = 70, height = 70, n = 1_024) {
  const bytes = parseInput().slice(0, n);

  return getPath(width, height, bytes);
}

export function part2(width = 70, height = 70, n = 1_024) {
  const bytes = parseInput();

  for (let i = n; i < bytes.length; i++) {
    if (!getPath(width, height, bytes.slice(0, i))) {
      return bytes[i - 1].split("|").join(",");
    }
  }
}

function getPath(width: number, height: number, bytes: string[]) {
  const source = toKey(0, 0);
  const target = toKey(width, height);

  const byteLookup = new Set(bytes);

  const { distanceLookup } = search(
    function getNeighbors(key: string) {
      const [j, i] = fromKey(key);

      return [
        [j - 1, i],
        [j, i - 1],
        [j + 1, i],
        [j, i + 1],
      ]
        .filter(
          ([j, i]) =>
            j >= 0 &&
            j <= width &&
            i >= 0 &&
            i <= height &&
            !byteLookup.has(toKey(j, i))
        )
        .map(([j, i]) => toKey(j, i));
    },
    source,
    target
  );

  return distanceLookup.get(target);
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
