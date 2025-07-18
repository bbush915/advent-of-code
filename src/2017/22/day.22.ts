import fs from "fs";

import { toKey } from "@/utils/common";

enum States {
  CLEAN = ".",
  WEAKENED = "W",
  INFECTED = "#",
  FLAGGED = "F",
}

enum Directions {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

const DIRECTION_OFFSET_MAP = {
  [Directions.UP]: [-1, 0],
  [Directions.RIGHT]: [0, 1],
  [Directions.DOWN]: [1, 0],
  [Directions.LEFT]: [0, -1],
};

function parseInput() {
  const grid = fs
    .readFileSync("src/inputs/2017/22/day.22.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("") as States[]);

  const stateLookup = new Map<string, States>();

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === States.INFECTED) {
        stateLookup.set(toKey([i, j]), States.INFECTED);
      }
    }
  }

  const virus = [
    Math.floor(grid.length / 2),
    Math.floor(grid[0].length / 2),
    Directions.UP,
  ];

  return {
    virus,
    stateLookup,
  };
}

export function part1() {
  return getInfectedCount(10_000, handleBurst);
}

export function part2() {
  return getInfectedCount(10_000_000, handleEvolvedBurst);
}

function getInfectedCount(
  bursts: number,
  handleBurst: (virus: number[], stateLookup: Map<string, States>) => boolean
) {
  const { virus, stateLookup } = parseInput();

  let count = 0;

  for (let n = 0; n < bursts; n++) {
    if (handleBurst(virus, stateLookup)) {
      count++;
    }

    const [dx, dy] = DIRECTION_OFFSET_MAP[virus[2] as Directions];

    virus[0] += dx;
    virus[1] += dy;
  }

  return count;
}

function handleBurst(virus: number[], stateLookup: Map<string, States>) {
  const key = toKey([virus[0], virus[1]]);
  const state = stateLookup.get(key) ?? States.CLEAN;

  switch (state) {
    case States.CLEAN: {
      virus[2] = (virus[2] + 3) % 4;
      stateLookup.set(key, States.INFECTED);
      return true;
    }

    case States.INFECTED: {
      virus[2] = (virus[2] + 1) % 4;
      stateLookup.delete(key);
      break;
    }
  }

  return false;
}

function handleEvolvedBurst(virus: number[], stateLookup: Map<string, States>) {
  const key = toKey([virus[0], virus[1]]);
  const state = stateLookup.get(key) ?? States.CLEAN;

  switch (state) {
    case States.CLEAN: {
      virus[2] = (virus[2] + 3) % 4;
      stateLookup.set(key, States.WEAKENED);
      break;
    }

    case States.WEAKENED: {
      stateLookup.set(key, States.INFECTED);
      return true;
    }

    case States.INFECTED: {
      virus[2] = (virus[2] + 1) % 4;
      stateLookup.set(key, States.FLAGGED);
      break;
    }

    case States.FLAGGED: {
      virus[2] = (virus[2] + 2) % 4;
      stateLookup.delete(key);
      break;
    }
  }

  return false;
}
