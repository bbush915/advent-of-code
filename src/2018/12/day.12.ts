import fs from "fs";

import "@/utils/array";

function parseInput() {
  const sections = fs
    .readFileSync("src/inputs/2018/12/day.12.input.txt")
    .toString()
    .split("\n\n");

  const state = new Set<number>(
    sections[0]
      .split(" ")[2]
      .split("")
      .map<[string, number]>((x, i) => [x, i])
      .filter(([x]) => x === "#")
      .map(([, i]) => i)
  );

  const ruleLookup = sections[1]
    .split("\n")
    .filter((x) => x)
    .reduce((lookup, value) => {
      const parts = value.split(" => ");

      return lookup.set(parts[0], parts[1] === "#");
    }, new Map<string, boolean>());

  return { state, ruleLookup };
}

export function part1() {
  return getPotSum(20);
}

export function part2() {
  return getPotSum(101) + (50_000_000_000 - 101) * 5;
}

function getPotSum(generations: number) {
  let { state, ruleLookup } = parseInput();

  for (let n = 0; n < generations; n++) {
    const bounds = getBounds(state);

    const state_ = new Set<number>();

    for (let i = bounds[0]; i < bounds[1]; i++) {
      if (hasPot(state, ruleLookup, i)) {
        state_.add(i);
      } else {
        state_.delete(i);
      }
    }

    state = state_;
  }

  return [...state.values()].sum();
}

function getBounds(state: Set<number>) {
  const bounds = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

  for (const value of state.values()) {
    bounds[0] = Math.min(value - 2, bounds[0]);
    bounds[1] = Math.max(value + 3, bounds[1]);
  }

  return bounds;
}

function hasPot(
  state: Set<number>,
  ruleLookup: Map<string, boolean>,
  i: number
) {
  const neighborhood = [i - 2, i - 1, i, i + 1, i + 2]
    .map((x) => (state.has(x) ? "#" : "."))
    .join("");

  return ruleLookup.get(neighborhood)!;
}
