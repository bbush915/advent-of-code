import fs from "fs";

import { range } from "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/10/day.10.input.txt")
    .toString()
    .trim();
}

export function part1() {
  const input = parseInput();

  const lengths = input.split(",").map(Number);
  const list = range(0, 256);

  hash(list, lengths, 0, 0);

  return list[0] * list[1];
}

export function part2() {
  const input = parseInput();

  const lengths = [
    ...input.split("").map((x) => x.charCodeAt(0)),
    17,
    31,
    73,
    47,
    23,
  ];
  const list = range(0, 256);

  let position = 0;
  let skip = 0;

  for (let n = 0; n < 64; n++) {
    const result = hash(list, lengths, position, skip);

    position = result[0];
    skip = result[1];
  }

  const dense: number[] = [];

  for (let i = 0; i < 16; i++) {
    let value = list[16 * i];

    for (let j = 1; j < 16; j++) {
      value ^= list[16 * i + j];
    }

    dense.push(value);
  }

  return dense.map((x) => x.toString(16).padStart(2, "0")).join("");
}

function hash(
  list: number[],
  lengths: number[],
  position: number,
  skip: number
): [number, number] {
  for (const length of lengths) {
    for (let n = 0; n < Math.floor(length / 2); n++) {
      const i = (position + n) % list.length;
      const j = (position + length - 1 - n) % list.length;

      const value = list[i];
      list[i] = list[j];
      list[j] = value;
    }

    position = (position + length + skip) % list.length;
    skip++;
  }

  return [position, skip];
}
