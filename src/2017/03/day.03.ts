import fs from "fs";

import "@/utils/array";

const SIDE_DELTAS = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

function parseInput() {
  return Number(
    fs.readFileSync("src/inputs/2017/03/day.03.input.txt").toString().trim()
  );
}

export function part1() {
  const n = parseInput();
  const [i, j] = getSpiralPosition(n);

  return Math.abs(i) + Math.abs(j);
}

export function part2() {
  const target = parseInput();

  let n = 1;
  const squareLookup = new Map<number, Map<number, number>>();

  while (1) {
    const [i, j] = getSpiralPosition(n);

    if (!squareLookup.has(i)) {
      squareLookup.set(i, new Map<number, number>());
    }

    const value =
      [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, j - 1],
        [i, j + 1],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ]
        .filter(([i, j]) => squareLookup.has(i) && squareLookup.get(i)!.has(j))
        .map(([i, j]) => squareLookup.get(i)!.get(j)!)
        .sum() || 1;

    if (value > target) {
      return value;
    }

    squareLookup.get(i)!.set(j, value);

    n++;
  }
}

function getSpiralPosition(n: number) {
  if (n === 1) {
    return [0, 0];
  }

  const layer = Math.ceil(0.5 * (Math.sqrt(n) - 1));

  let i = layer - 1;
  let j = layer;

  const sideLength = 2 * layer - 1;
  const layerOffset = n - (Math.pow(sideLength, 2) + 1);

  const sideIndex = Math.floor(layerOffset / (sideLength + 1));
  const sideOffset = layerOffset % (sideLength + 1);

  let index = 0;

  while (index < sideIndex) {
    i += sideLength * SIDE_DELTAS[index][0] + SIDE_DELTAS[index + 1][0];
    j += sideLength * SIDE_DELTAS[index][1] + SIDE_DELTAS[index + 1][1];

    index++;
  }

  i += sideOffset * SIDE_DELTAS[index][0];
  j += sideOffset * SIDE_DELTAS[index][1];

  return [i, j];
}
