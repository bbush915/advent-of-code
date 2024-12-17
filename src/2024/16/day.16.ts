import fs from "fs";

import { toKey } from "@/utils/common";
import { MinPriorityQueue } from "@/utils/data-structure";

enum Tiles {
  WALL = "#",
  EMPTY = ".",
  START = "S",
  END = "E",
}

enum Directions {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

const DELTA_MAP = {
  [Directions.NORTH]: [-1, 0],
  [Directions.EAST]: [0, 1],
  [Directions.SOUTH]: [1, 0],
  [Directions.WEST]: [0, -1],
};

function parseInput() {
  const maze = fs
    .readFileSync("src/inputs/2024/16/day.16.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("") as Tiles[]);

  let start: string;
  let end: string;

  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === Tiles.START) {
        start = toKey(i, j, Directions.EAST);
      } else if (maze[i][j] === Tiles.END) {
        end = toKey(i, j);
      }
    }
  }

  const { scoreLookup, predecessorLookup } = search(maze, start!, end!);

  return {
    scoreLookup,
    predecessorLookup,
    end: end!,
  };
}

export function part1() {
  const { scoreLookup, end } = parseInput();

  return Math.min(
    ...[...scoreLookup.entries()]
      .filter(([key]) => key.startsWith(end))
      .map(([, score]) => score)
  );
}

export function part2(lowestScore = 85_420) {
  const { scoreLookup, predecessorLookup, end } = parseInput();

  const tileLookup = new Set<string>();

  const keys: string[] = [...scoreLookup.entries()]
    .filter(([key, score]) => key.startsWith(end) && score === lowestScore)
    .map(([key]) => key);

  while (keys.length) {
    const key = keys.pop()!;

    tileLookup.add(key.slice(0, key.lastIndexOf("|")));

    for (const predecessor of predecessorLookup.get(key)!) {
      keys.push(predecessor);
    }
  }

  return tileLookup.size;
}

function search(maze: Tiles[][], start: string, end: string) {
  const scoreLookup = new Map<string, number>([[start, 0]]);
  const predecessorLookup = new Map<string, string[]>([[start, []]]);

  const priorityQueue = new MinPriorityQueue();
  priorityQueue.insert(start, 0);

  while (priorityQueue.size) {
    const { key } = priorityQueue.pop()!;

    if (key.startsWith(end)) {
      continue;
    }

    for (const neighborKey of getNeighbors(maze, key)) {
      const newScore = scoreLookup.get(key)! + getDistance(key, neighborKey);
      const oldScore = scoreLookup.get(neighborKey) ?? Number.POSITIVE_INFINITY;

      if (newScore === oldScore) {
        const predecessors = predecessorLookup.get(neighborKey) ?? [];

        if (!predecessors.includes(key)) {
          predecessors.push(key);
          predecessorLookup.set(neighborKey, predecessors);
        }
      } else if (newScore < oldScore) {
        scoreLookup.set(neighborKey, newScore);
        predecessorLookup.set(neighborKey, [key]);

        if (priorityQueue.includes(neighborKey)) {
          priorityQueue.update(neighborKey, newScore);
        } else {
          priorityQueue.insert(neighborKey, newScore);
        }
      }
    }
  }

  return { scoreLookup, predecessorLookup };
}

function getNeighbors(maze: Tiles[][], key: string) {
  const [i, j, direction] = fromKey(key);

  const neighbors: string[] = [];

  // NOTE - Rotate

  const clockwiseDirection = (direction + 1) % 4;

  if (getNextTile(maze, i, j, clockwiseDirection) !== Tiles.WALL) {
    neighbors.push(toKey(i, j, clockwiseDirection));
  }

  const counterclockwiseDirection = (direction + 3) % 4;

  if (getNextTile(maze, i, j, counterclockwiseDirection) !== Tiles.WALL) {
    neighbors.push(toKey(i, j, counterclockwiseDirection));
  }

  // NOTE - Move

  if (getNextTile(maze, i, j, direction) !== Tiles.WALL) {
    neighbors.push(
      toKey(i + DELTA_MAP[direction][0], j + DELTA_MAP[direction][1], direction)
    );
  }

  return neighbors;
}

function getNextTile(
  maze: Tiles[][],
  i: number,
  j: number,
  direction: Directions
) {
  i += DELTA_MAP[direction][0];
  j += DELTA_MAP[direction][1];

  return maze[i][j];
}

function getDistance(x: string, y: string) {
  const [i1, j1] = fromKey(x);
  const [i2, j2] = fromKey(y);

  return i1 === i2 && j1 === j2 ? 1_000 : 1;
}

function fromKey(key: string) {
  return key.split("|").map(Number) as [number, number, Directions];
}
