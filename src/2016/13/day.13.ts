import fs from "fs";

import "@/utils/array";
import { toKey } from "@/utils/common";
import { search } from "@/utils/graph";

function parseInput() {
  return Number(
    fs.readFileSync("src/inputs/2016/13/day.13.input.txt").toString().trim()
  );
}

export function part1(target: number[] = [31, 39]) {
  const favorite = parseInput();

  const source = toKey([1, 1]);

  const { distanceLookup } = search(
    curryGetNeighbors(favorite),
    source,
    toKey(target)
  );

  return distanceLookup.get(toKey(target))!;
}

export function part2() {
  const favorite = parseInput();

  const source = toKey([1, 1]);

  const { distanceLookup } = search(curryGetNeighbors(favorite), source);

  return [...distanceLookup.values()].filter((x) => x <= 50).length;
}

function curryGetNeighbors(favorite: number) {
  return function getNeighbors(key: string) {
    const [x, y] = fromKey(key);

    return [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]
      .filter((position) => isValid(position, favorite))
      .map((x) => toKey(x));
  };
}

function isValid([x, y]: number[], favorite: number) {
  if (x < 0 || y < 0) {
    return false;
  }

  const value = x * x + 3 * x + 2 * x * y + y + y * y + favorite;

  return value.toString(2).split("").map(Number).sum() % 2 === 0;
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
