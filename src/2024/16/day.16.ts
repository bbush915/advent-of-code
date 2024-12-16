import fs from "fs";

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

type Path1 = [number, number, Directions, number];
type Path2 = [number, number, Directions, number, string[]];

function parseInput() {
  const maze = fs
    .readFileSync("src/inputs/2024/16/day.16.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("") as Tiles[]);

  const start: number[] = [];

  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === Tiles.START) {
        start.push(i, j);
      }
    }
  }

  return {
    maze,
    start,
  };
}

export function part1() {
  const { maze, start } = parseInput();

  let lowestScore = Number.POSITIVE_INFINITY;

  const paths: Path1[] = [[start[0], start[1], Directions.EAST, 0]];
  const scoreLookup = new Map<string, number>();

  while (paths.length) {
    const path = paths.pop()!;

    const [, , direction, score] = path;
    let [i, j] = path;

    const key = toKey(i, j, direction);

    if (score >= (scoreLookup.get(key) ?? Number.POSITIVE_INFINITY)) {
      continue;
    } else {
      scoreLookup.set(key, score);
    }

    if (score >= lowestScore) {
      continue;
    }

    if (maze[i][j] === Tiles.END) {
      if (score < lowestScore) {
        lowestScore = score;
      }

      continue;
    }

    // NOTE - Rotate

    const clockwiseDirection = (direction + 1) % 4;

    if (getNextTile(maze, i, j, clockwiseDirection) !== Tiles.WALL) {
      paths.push([i, j, clockwiseDirection, score + 1_000]);
    }

    const counterclockwiseDirection = (direction + 3) % 4;

    if (getNextTile(maze, i, j, counterclockwiseDirection) !== Tiles.WALL) {
      paths.push([i, j, counterclockwiseDirection, score + 1_000]);
    }

    // NOTE - Move

    i += DELTA_MAP[direction][0];
    j += DELTA_MAP[direction][1];

    if (maze[i][j] !== Tiles.WALL) {
      paths.push([i, j, direction, score + 1]);
    }
  }

  return lowestScore;
}

export function part2(lowestScore = 85_420) {
  const { maze, start } = parseInput();

  const paths: Path2[] = [
    [start[0], start[1], Directions.EAST, 0, [toKey(...start)]],
  ];

  const scoreLookup = new Map<string, number>();
  const tileLookup = new Set<string>();

  while (paths.length) {
    const path = paths.pop()!;

    const [, , direction, score, tiles] = path;
    let [i, j] = path;

    if (maze[i][j] === Tiles.END) {
      if (score === lowestScore) {
        for (const tile of tiles) {
          tileLookup.add(tile);
        }
      }

      continue;
    }

    const key = toKey(i, j, direction);

    if (score > (scoreLookup.get(key) ?? Number.POSITIVE_INFINITY)) {
      continue;
    } else {
      scoreLookup.set(key, score);
    }

    if (score > lowestScore) {
      continue;
    }

    // NOTE - Rotate

    const clockwiseDirection = (direction + 1) % 4;

    if (getNextTile(maze, i, j, clockwiseDirection) !== Tiles.WALL) {
      paths.push([
        i,
        j,
        clockwiseDirection,
        score + 1_000,
        [...tiles, toKey(i, j)],
      ]);
    }

    const counterclockwiseDirection = (direction + 3) % 4;

    if (getNextTile(maze, i, j, counterclockwiseDirection) !== Tiles.WALL) {
      paths.push([
        i,
        j,
        counterclockwiseDirection,
        score + 1_000,
        [...tiles, toKey(i, j)],
      ]);
    }

    // NOTE - Move

    i += DELTA_MAP[direction][0];
    j += DELTA_MAP[direction][1];

    if (maze[i][j] !== Tiles.WALL) {
      paths.push([i, j, direction, score + 1, [...tiles, toKey(i, j)]]);
    }
  }

  return tileLookup.size;
}

function toKey(...args: any[]) {
  return args.map(String).join("|");
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
