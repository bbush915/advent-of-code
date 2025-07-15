import fs from "fs";

type Coordinates = [number, number, number];

enum Directions {
  NORTH = "n",
  NORTH_EAST = "ne",
  SOUTH_EAST = "se",
  SOUTH = "s",
  SOUTH_WEST = "sw",
  NORTH_WEST = "nw",
}

const DIRECTION_OFFSET_MAP = {
  [Directions.NORTH]: [0, -1, 1],
  [Directions.NORTH_EAST]: [1, -1, 0],
  [Directions.SOUTH_EAST]: [1, 0, -1],
  [Directions.SOUTH]: [0, 1, -1],
  [Directions.SOUTH_WEST]: [-1, 1, 0],
  [Directions.NORTH_WEST]: [-1, 0, 1],
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/11/day.11.input.txt")
    .toString()
    .trim()
    .split(",") as Directions[];
}

export function part1() {
  const directions = parseInput();
  const position = [0, 0, 0] as Coordinates;

  for (const direction of directions) {
    position[0] += DIRECTION_OFFSET_MAP[direction][0];
    position[1] += DIRECTION_OFFSET_MAP[direction][1];
    position[2] += DIRECTION_OFFSET_MAP[direction][2];
  }

  return getDistance(position, [0, 0, 0]);
}

export function part2() {
  const directions = parseInput();
  const position = [0, 0, 0] as Coordinates;

  let maxDistance = 0;

  for (const direction of directions) {
    position[0] += DIRECTION_OFFSET_MAP[direction][0];
    position[1] += DIRECTION_OFFSET_MAP[direction][1];
    position[2] += DIRECTION_OFFSET_MAP[direction][2];

    const distance = getDistance(position, [0, 0, 0]);

    if (distance > maxDistance) {
      maxDistance = distance;
    }
  }

  return maxDistance;
}

function getDistance(x: Coordinates, y: Coordinates) {
  return (
    0.5 *
    (Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]))
  );
}
