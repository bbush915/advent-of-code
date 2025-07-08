import fs from "fs";

import "@/utils/array";
import { getPermutations } from "@/utils/array";
import { toKey } from "@/utils/common";
import { search } from "@/utils/graph";

enum Cells {
  WALL = "#",
  EMPTY = ".",
}

function parseInput() {
  const map = fs
    .readFileSync("src/inputs/2016/24/day.24.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("") as Cells[]);

  const locations: number[][] = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === Cells.EMPTY || map[i][j] === Cells.WALL) {
        continue;
      }

      locations.push([Number(map[i][j]), i, j]);
    }
  }

  return {
    map,
    locations,
  };
}

export function part1() {
  return getMinimumSteps(false);
}

export function part2() {
  return getMinimumSteps(true);
}

function getMinimumSteps(includeReturn: boolean) {
  const { map, locations } = parseInput();

  const distanceLookup = getDistanceLookup(map, locations);

  const routes = getPermutations(
    locations.filter((x) => x[0]).map((x) => x[0])
  );

  return routes
    .map((route) => {
      route.splice(0, 0, 0);

      if (includeReturn) {
        route.push(0);
      }

      let steps = 0;

      for (let i = 1; i < route.length; i++) {
        steps += distanceLookup.get(route[i - 1])!.get(route[i])!;
      }

      return steps;
    })
    .min();
}

function getDistanceLookup(map: Cells[][], locations: number[][]) {
  const distanceLookup = new Map<number, Map<number, number>>();

  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const x = locations[i][0];
      const y = locations[j][0];

      const source = toKey(locations[i].slice(1));
      const target = toKey(locations[j].slice(1));

      const { distanceLookup: distanceLookup_ } = search(
        function getNeighbors(key: string) {
          const [i, j] = key.split("|").map(Number);

          return [
            [i - 1, j],
            [i + 1, j],
            [i, j - 1],
            [i, j + 1],
          ]
            .filter(
              ([i, j]) =>
                i >= 0 &&
                i < map.length &&
                j >= 0 &&
                j < map[i].length &&
                map[i][j] !== Cells.WALL
            )
            .map((x) => toKey(x));
        },
        source,
        target
      );

      if (!distanceLookup.has(x)) {
        distanceLookup.set(x, new Map<number, number>());
      }

      distanceLookup.get(x)!.set(y, distanceLookup_.get(target)!);

      if (!distanceLookup.has(y)) {
        distanceLookup.set(y, new Map<number, number>());
      }

      distanceLookup.get(y)!.set(x, distanceLookup_.get(target)!);
    }
  }

  return distanceLookup;
}
