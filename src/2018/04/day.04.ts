import fs from "fs";

import "@/utils/array";
import { range } from "@/utils/array";

type Guard = {
  id: number;
  sleep: [number, number][];
};

function parseInput() {
  const events = fs
    .readFileSync("src/inputs/2018/04/day.04.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(
      (x) =>
        [[...x.slice(1, x.indexOf("]")).matchAll(/\d+/g)].map(Number), x] as [
          number[],
          string
        ]
    )
    .sort((x, y) => {
      let n = 0;

      while (x[0][n] === y[0][n]) {
        n++;
      }

      return x[0][n] - y[0][n];
    });

  return getGuards(events);
}

function getGuards(events: [number[], string][]) {
  const guardLookup = new Map<number, Guard>();

  let n = 0;

  while (n < events.length) {
    const id = Number(events[n][1].split(" ")[3].slice(1));

    const guard = guardLookup.get(id) ?? {
      id,
      sleep: [],
    };

    while (!(events[n + 1]?.[1].includes("Guard") ?? true)) {
      guard.sleep.push([events[n + 1][0][4], events[n + 2][0][4]]);
      n += 2;
    }

    guardLookup.set(id, guard);

    n++;
  }

  return [...guardLookup.values()];
}

export function part1() {
  const guards = parseInput();

  const guard = getSleepiestGuard(guards);
  const [id, minute] = getSleepiestMinute(guard);

  return id * minute;
}

export function part2() {
  const guards = parseInput();

  const [id, minute] = guards
    .map(getSleepiestMinute)
    .sort((x, y) => y[2] - x[2])[0];

  return id * minute;
}

function getSleepiestGuard(guards: Guard[]) {
  let maxSleepCount = 0;
  let sleepiestGuard: Guard;

  for (const guard of guards) {
    const sleepCount = guard.sleep
      .map(([start, finish]) => finish - start)
      .sum();

    if (sleepCount > maxSleepCount) {
      maxSleepCount = sleepCount;
      sleepiestGuard = guard;
    }
  }

  return sleepiestGuard!;
}

function getSleepiestMinute(guard: Guard) {
  return [
    guard.id,
    ...([
      ...guard.sleep
        .flatMap(([start, finish]) => range(start, finish))
        .reduce(
          (lookup, value) => lookup.set(value, (lookup.get(value) ?? 0) + 1),
          new Map<number, number>()
        )
        .entries(),
    ].sort((x, y) => y[1] - x[1])[0] ?? [-1, -1]),
  ];
}
