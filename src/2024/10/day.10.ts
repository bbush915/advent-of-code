import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/10/day.10.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("").map(Number));
}

export function part1() {
  return getTrailheadTotal(calculateTrailheadScore);
}

export function part2() {
  return getTrailheadTotal(calculateTrailheadRating);
}

function getTrailheadTotal(
  calculateTrailheadValue: (
    map: number[][],
    trailhead: [number, number]
  ) => number
) {
  const map = parseInput();

  let total = 0;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j]) {
        continue;
      }

      total += calculateTrailheadValue(map, [i, j]);
    }
  }

  return total;
}

function calculateTrailheadScore(map: number[][], trailhead: [number, number]) {
  return calculateTrailheadValue(map, trailhead, false);
}

function calculateTrailheadRating(
  map: number[][],
  trailhead: [number, number]
) {
  return calculateTrailheadValue(map, trailhead, true);
}

function calculateTrailheadValue(
  map: number[][],
  trailhead: [number, number],
  distinct: boolean
) {
  const positions = [trailhead];
  const visited = new Set<string>();

  let value = 0;

  while (positions.length) {
    const [i, j] = positions.shift()!;
    const key = toKey(i, j);

    if (!distinct && visited.has(key)) {
      continue;
    } else {
      visited.add(key);
    }

    if (map[i][j] === 9) {
      value++;
      continue;
    }

    if (map[i - 1]?.[j] === map[i][j] + 1) {
      positions.push([i - 1, j]);
    }

    if (map[i]?.[j + 1] === map[i][j] + 1) {
      positions.push([i, j + 1]);
    }

    if (map[i + 1]?.[j] === map[i][j] + 1) {
      positions.push([i + 1, j]);
    }

    if (map[i]?.[j - 1] === map[i][j] + 1) {
      positions.push([i, j - 1]);
    }
  }

  return value;
}

function toKey(i: number, j: number) {
  return `${i}|${j}`;
}
