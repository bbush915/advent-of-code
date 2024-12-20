import fs from "fs";

import { toKey } from "@/utils/common";
import { search } from "@/utils/graph";

enum Tiles {
  EMPTY = ".",
  WALL = "#",
  START = "S",
  END = "E",
}

function parseInput() {
  const map = fs
    .readFileSync("src/inputs/2024/20/day.20.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("") as Tiles[]);

  let start: string;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "S") {
        start = toKey([i, j]);
      }
    }
  }

  return {
    map,
    start: start!,
  };
}

export function part1() {
  return getCheatCount(2);
}

export function part2() {
  return getCheatCount(20);
}

function getCheatCount(maxDuration: number) {
  const { map, start } = parseInput();

  const { distanceLookup } = search((key) => {
    const [i, j] = fromKey(key);
    return getNeighbors(map, i, j);
  }, start);

  const positions = [start];
  const visited = new Set<string>();

  const cheats = new Map<string, number>();

  while (positions.length) {
    const position = positions.pop()!;

    if (visited.has(position)) {
      continue;
    } else {
      visited.add(position);
    }

    const [i, j] = fromKey(position);

    for (let di = -maxDuration; di <= maxDuration; di++) {
      for (
        let dj = Math.abs(di) - maxDuration;
        dj <= maxDuration - Math.abs(di);
        dj++
      ) {
        if (!map[i + di]?.[j + dj] || map[i + di][j + dj] === Tiles.WALL) {
          continue;
        }

        const oldTime = distanceLookup.get(toKey([i + di, j + dj]))!;
        const newTime =
          distanceLookup.get(position)! + Math.abs(di) + Math.abs(dj);

        if (oldTime > newTime) {
          cheats.set(toKey([i, j, i + di, j + dj]), oldTime - newTime);
        }
      }
    }

    positions.push(...getNeighbors(map, i, j));
  }

  return [...cheats.values()].filter((x) => x >= 100).length;
}

function getNeighbors(map: Tiles[][], i: number, j: number) {
  return [
    [i - 1, j],
    [i, j + 1],
    [i + 1, j],
    [i, j - 1],
  ]
    .filter(([i, j]) => map[i]?.[j] && map[i][j] !== Tiles.WALL)
    .map(([i, j]) => toKey([i, j]));
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
