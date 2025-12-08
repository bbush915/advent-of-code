import fs from "fs";

import "@/utils/array";

function parseInput() {
  const boxes = fs
    .readFileSync("src/inputs/2025/08/day.08.input.txt")
    .toString()
    .trim()
    .split("\n")
    .map((x) => x.split(",").map(Number));

  const distances: number[][] = [];

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      distances.push([getEuclideanDistance(boxes[i], boxes[j]), i, j]);
    }
  }

  distances.sort((x, y) => y[0] - x[0]);

  const circuits: number[][] = [];
  const circuitLookup = new Map<number, number>();

  for (let n = 0; n < boxes.length; n++) {
    circuits.push([n]);
    circuitLookup.set(n, n);
  }

  return {
    boxes,
    distances,
    circuits,
    circuitLookup,
  };
}

export function part1(connections = 1_000) {
  const { distances, circuits, circuitLookup } = parseInput();

  for (let n = 0; n < connections; n++) {
    const [, i, j] = distances.pop()!;

    let iCircuitIndex = circuitLookup.get(i)!;
    let jCircuitIndex = circuitLookup.get(j)!;

    if (iCircuitIndex === jCircuitIndex) {
      continue;
    }

    if (circuits[iCircuitIndex].length < circuits[jCircuitIndex].length) {
      [iCircuitIndex, jCircuitIndex] = [jCircuitIndex, iCircuitIndex];
    }

    for (const box of circuits[jCircuitIndex]) {
      circuits[iCircuitIndex].push(box);
      circuitLookup.set(box, iCircuitIndex);
    }

    if (jCircuitIndex < circuits.length - 1) {
      for (const box of circuits[circuits.length - 1]) {
        circuitLookup.set(box, jCircuitIndex);
      }

      [circuits[circuits.length - 1], circuits[jCircuitIndex]] = [
        circuits[jCircuitIndex],
        circuits[circuits.length - 1],
      ];
    }

    circuits.pop();
  }

  return circuits
    .sort((x, y) => y.length - x.length)
    .slice(0, 3)
    .map((x) => x.length)
    .product();
}

export function part2() {
  const { boxes, distances, circuits, circuitLookup } = parseInput();

  while (distances.length) {
    const [, i, j] = distances.pop()!;

    let iCircuitIndex = circuitLookup.get(i)!;
    let jCircuitIndex = circuitLookup.get(j)!;

    if (iCircuitIndex === jCircuitIndex) {
      continue;
    }

    if (circuits[iCircuitIndex].length < circuits[jCircuitIndex].length) {
      [iCircuitIndex, jCircuitIndex] = [jCircuitIndex, iCircuitIndex];
    }

    for (const box of circuits[jCircuitIndex]) {
      circuits[iCircuitIndex].push(box);
      circuitLookup.set(box, iCircuitIndex);
    }

    if (jCircuitIndex < circuits.length - 1) {
      for (const box of circuits[circuits.length - 1]) {
        circuitLookup.set(box, jCircuitIndex);
      }

      [circuits[circuits.length - 1], circuits[jCircuitIndex]] = [
        circuits[jCircuitIndex],
        circuits[circuits.length - 1],
      ];
    }

    circuits.pop();

    if (circuits.length === 1) {
      return boxes[i][0] * boxes[j][0];
    }
  }
}

function getEuclideanDistance(x: number[], y: number[]) {
  let distance = 0;

  for (let n = 0; n < x.length; n++) {
    distance += (x[n] - y[n]) * (x[n] - y[n]);
  }

  return Math.sqrt(distance);
}
