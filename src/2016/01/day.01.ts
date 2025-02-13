import fs from "fs";

import "@/utils/array";
import { toKey } from "@/utils/common";
import { lpr } from "@/utils/number";

enum Directions {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

const DELTA_LOOKUP = {
  [Directions.NORTH]: [1, 0],
  [Directions.EAST]: [0, 1],
  [Directions.SOUTH]: [-1, 0],
  [Directions.WEST]: [0, -1],
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/01/day.01.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .flatMap((x) =>
      x.split(", ").map<[string, number]>((x) => [x[0], Number(x.slice(1))])
    );
}

export function part1() {
  const [, dx, dy] = parseInput().reduce<[Directions, number, number]>(
    (state, [turn, blocks]) => {
      state[0] = turn === "R" ? lpr(state[0] + 1, 4) : lpr(state[0] - 1, 4);

      state[1] += DELTA_LOOKUP[state[0]][0] * blocks;
      state[2] += DELTA_LOOKUP[state[0]][1] * blocks;

      return state;
    },
    [Directions.NORTH, 0, 0]
  );

  return Math.abs(dx) + Math.abs(dy);
}

export function part2() {
  const instructions = parseInput();

  const state: [Directions, number, number] = [Directions.NORTH, 0, 0];
  const cache = new Set<string>([toKey(state.slice(1))]);

  for (const [turn, blocks] of instructions) {
    state[0] = turn === "R" ? lpr(state[0] + 1, 4) : lpr(state[0] - 1, 4);

    for (let n = 0; n < blocks; n++) {
      state[1] += DELTA_LOOKUP[state[0]][0];
      state[2] += DELTA_LOOKUP[state[0]][1];

      const key = toKey(state.slice(1));

      if (cache.has(key)) {
        return fromKey(key).map(Math.abs).sum();
      } else {
        cache.add(key);
      }
    }
  }
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
