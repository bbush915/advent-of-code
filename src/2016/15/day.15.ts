import fs from "fs";

import { crt, lpr } from "@/utils/number";

type Disc = {
  id: number;
  positions: number;
  initial: number;
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/15/day.15.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseDisc);
}

function parseDisc(value: string): Disc {
  const parts = value.split(" ");

  return {
    id: Number(parts[1].slice(1)),
    positions: Number(parts[3]),
    initial: Number(parts[11].slice(0, -1)),
  };
}

export function part1() {
  const discs = parseInput();

  return getCapsuleTime(discs);
}

export function part2() {
  const discs = parseInput();

  discs.push({ id: discs.length + 1, positions: 11, initial: 0 });

  return getCapsuleTime(discs);
}

function getCapsuleTime(discs: Disc[]) {
  const a: number[] = [];
  const m: number[] = [];

  for (const disc of discs) {
    a.push(lpr(-1 * (disc.initial + disc.id), disc.positions));
    m.push(disc.positions);
  }

  return crt(a, m);
}
