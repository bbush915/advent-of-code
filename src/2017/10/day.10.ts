import fs from "fs";

import { getKnotHash, performSparseKnotHash } from "2017/utils/knot-hash";
import { range } from "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/10/day.10.input.txt")
    .toString()
    .trim();
}

export function part1() {
  const input = parseInput();

  const list = range(0, 256);
  const lengths = input.split(",").map(Number);

  performSparseKnotHash(list, lengths, 0, 0);

  return list[0] * list[1];
}

export function part2() {
  const input = parseInput();

  return getKnotHash(input);
}
