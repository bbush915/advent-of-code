import fs from "fs";

import { clone } from "@/utils/common";

enum Directions {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

function parseInput() {
  const lines = fs
    .readFileSync("src/inputs/2024/06/day.06.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x);

  const map: string[][] = [];
  let guard: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    map.push([]);

    for (let j = 0; j < lines[i].length; j++) {
      map[i].push(lines[i][j]);

      if (lines[i][j] === "^") {
        guard = [i, j, Directions.UP];
      }
    }
  }

  return {
    map,
    guard,
  };
}

export function part1() {
  const { map, guard } = parseInput();

  const [locations] = tryPatrol(map, guard);

  return locations.size;
}

export function part2() {
  const { map, guard } = parseInput();

  const [locations] = tryPatrol(map, guard);

  let options = 0;

  for (const location of locations) {
    const [i, j] = location.split("|").map(Number);

    const map_ = clone(map);
    map_[i][j] = "#";

    const [, didLoop] = tryPatrol(map_, guard);

    if (didLoop) {
      options++;
    }
  }

  return options;
}

function tryPatrol(map: string[][], guard: number[]): [Set<string>, boolean] {
  let [i, j, facing] = guard;

  const history = new Set<string>();
  let didLoop = false;

  patrolLoop: while (i >= 0 && i < map.length && j >= 0 && j < map[i].length) {
    const key = toKey(i, j, facing);

    if (history.has(key)) {
      didLoop = true;
      break;
    } else {
      history.add(key);
    }

    switch (facing) {
      case Directions.UP: {
        if (i === 0) {
          break patrolLoop;
        } else if (map[i - 1][j] === "#") {
          facing = (facing + 1) % 4;
        } else {
          i--;
        }

        break;
      }

      case Directions.RIGHT: {
        if (j === map[i].length - 1) {
          break patrolLoop;
        } else if (map[i][j + 1] === "#") {
          facing = (facing + 1) % 4;
        } else {
          j++;
        }

        break;
      }

      case Directions.DOWN: {
        if (i === map.length - 1) {
          break patrolLoop;
        } else if (map[i + 1][j] === "#") {
          facing = (facing + 1) % 4;
        } else {
          i++;
        }

        break;
      }

      case Directions.LEFT: {
        if (j === 0) {
          break patrolLoop;
        } else if (map[i][j - 1] === "#") {
          facing = (facing + 1) % 4;
        } else {
          j--;
        }

        break;
      }

      default: {
        throw new Error("Unexpected direction encountered.");
      }
    }
  }

  return [
    new Set([...history.values()].map((x) => fromKey(x).slice(0, 2).join("|"))),
    didLoop,
  ];
}

function toKey(i: number, j: number, facing: Directions) {
  return `${i}|${j}|${facing}`;
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
