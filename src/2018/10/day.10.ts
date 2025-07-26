import fs from "fs";

type Point = {
  p: [number, number];
  v: [number, number];
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2018/10/day.10.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parsePoint);
}

function parsePoint(value: string): Point {
  const values = [...value.matchAll(/-?\d+/g)].map(Number);

  return {
    p: [values[0], values[1]],
    v: [values[2], values[3]],
  };
}

export function part1() {
  const [message] = getMessage();

  return message;
}

export function part2() {
  const [, n] = getMessage();

  return n;
}

function getMessage(): [string, number] {
  const points = parseInput();

  let message = "\n";
  let n = 1;

  while (1) {
    for (const point of points) {
      point.p[0] += point.v[0];
      point.p[1] += point.v[1];
    }

    const adjacentCount = getAdjacentCount(points);

    if (adjacentCount > points.length) {
      const bounds = [
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
      ];

      for (const point of points) {
        bounds[0] = Math.min(bounds[0], point.p[0]);
        bounds[1] = Math.min(bounds[1], point.p[1]);
        bounds[2] = Math.max(bounds[2], point.p[0]);
        bounds[3] = Math.max(bounds[3], point.p[1]);
      }

      for (let j = 0; j < bounds[3] - bounds[1] + 1; j++) {
        let row = "";

        for (let i = 0; i < bounds[2] - bounds[0] + 1; i++) {
          row += points.some(
            (x) => x.p[0] === bounds[0] + i && x.p[1] === bounds[1] + j
          )
            ? "#"
            : ".";
        }

        message += row + "\n";
      }

      break;
    }

    n++;
  }

  return [message, n];
}

function getAdjacentCount(points: Point[]) {
  let count = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (
        Math.abs(points[i].p[0] - points[j].p[0]) +
          Math.abs(points[i].p[1] - points[j].p[1]) ===
        1
      ) {
        count++;
      }
    }
  }

  return count;
}
