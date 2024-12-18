import fs from "fs";

import { upperBound } from "@/utils/array";
import { search } from "@/utils/graph";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/18/day.18.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x);
}

export function part1(width = 70, height = 70, n = 1_024) {
  const bytes = parseInput().slice(0, n);

  return getPath(width, height, bytes);
}

export function part2(width = 70, height = 70) {
  const bytes = parseInput();

  return bytes[
    upperBound(
      bytes,
      (_byte, i) => !!getPath(width, height, bytes.slice(0, i + 1))
    )
  ];
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
        .filter(([j, i]) => j >= 0 && j <= width && i >= 0 && i <= height)
        .map(([j, i]) => toKey(j, i))
        .filter((key) => !byteLookup.has(key));
    },
    source,
    target
  );

  return distanceLookup.get(target);
}

function toKey(j: number, i: number) {
  return `${j},${i}`;
}

function fromKey(key: string) {
  return key.split(",").map(Number);
}
