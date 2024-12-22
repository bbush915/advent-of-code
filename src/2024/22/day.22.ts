import fs from "fs";

import "@/utils/array";
import { toKey } from "@/utils/common";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/22/day.22.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(Number);
}

export function part1() {
  return parseInput()
    .map((x) => generateNth(x, 2_000))
    .sum();
}

export function part2() {
  return [
    ...parseInput()
      .reduce((lookup, x) => {
        const prices: number[] = [x % 10];
        const deltas: number[] = [];

        const sequences = new Set<string>();

        for (let i = 0; i < 2_000; i++) {
          x = generate(x);

          prices.push(x % 10);
          deltas.push(prices.at(-1)! - prices.at(-2)!);

          if (i >= 3) {
            const key = toKey([
              deltas[i - 3],
              deltas[i - 2],
              deltas[i - 1],
              deltas[i],
            ]);

            if (!sequences.has(key)) {
              sequences.add(key);
              lookup.set(key, (lookup.get(key) ?? 0) + prices[i + 1]);
            }
          }
        }

        return lookup;
      }, new Map<string, number>())
      .values(),
  ].max();
}

function generateNth(x: number, n: number) {
  for (let i = 0; i < n; i++) {
    x = generate(x);
  }

  return x;
}

function generate(x: number) {
  let value = BigInt(x);

  value = prune(mix(value << 6n, value));
  value = prune(mix(value >> 5n, value));
  value = prune(mix(value << 11n, value));

  return Number(value);
}

function mix(x: bigint, y: bigint) {
  return x ^ y;
}

function prune(x: bigint) {
  return x % 16777216n;
}
