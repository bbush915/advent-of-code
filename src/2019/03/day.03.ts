import fs from "fs";

import { clone } from "utils/common";

type Point = { x: number; y: number };

type Segment = { x1: number; y1: number; x2: number; y2: number };

function parseInput() {
  return fs
    .readFileSync("src/inputs/2019/03/day.03.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) =>
      x.split(",").reduce<Point[]>(
        (points, step, i) => {
          const direction = step[0];
          const distance = Number(step.slice(1));

          const point = clone(points[i]);

          switch (direction) {
            case "R": {
              point.x += distance;
              break;
            }

            case "L": {
              point.x -= distance;
              break;
            }

            case "U": {
              point.y += distance;
              break;
            }

            case "D": {
              point.y -= distance;
              break;
            }
          }

          points.push(point);

          return points;
        },
        [{ x: 0, y: 0 }]
      )
    );
}

export function part1() {
  const wires = parseInput();

  const segments1 = getSegments(wires[0]);
  const segments2 = getSegments(wires[1]);

  const intersections = getIntersections(segments1, segments2);

  return Math.min(
    ...intersections.map(({ intersection }) =>
      getDistance(intersection, { x: 0, y: 0 })
    )
  );
}

export function part2() {
  const wires = parseInput();

  const segments1 = getSegments(wires[0]);
  const segments2 = getSegments(wires[1]);

  const intersections = getIntersections(segments1, segments2);

  return Math.min(
    ...intersections.map(({ intersection, m, n }) => {
      const delay1 = segments1
        .slice(0, m)
        .reduce(
          (sum, val) =>
            (sum += getDistance(
              { x: val.x1, y: val.y1 },
              { x: val.x2, y: val.y2 }
            )),
          getDistance(
            { x: segments1[m].x1, y: segments1[m].y1 },
            { x: intersection.x, y: intersection.y }
          )
        );

      const delay2 = segments2
        .slice(0, n)
        .reduce(
          (sum, val) =>
            (sum += getDistance(
              { x: val.x1, y: val.y1 },
              { x: val.x2, y: val.y2 }
            )),
          getDistance(
            { x: segments2[n].x1, y: segments2[n].y1 },
            { x: intersection.x, y: intersection.y }
          )
        );

      return delay1 + delay2;
    })
  );
}

function getSegments(points: Point[]) {
  const segments = [];

  for (let i = 1; i < points.length; i++) {
    const segment = {
      x1: points[i - 1].x,
      x2: points[i].x,
      y1: points[i - 1].y,
      y2: points[i].y,
    };

    segments.push(segment);
  }

  return segments;
}

function getIntersections(segments1: Segment[], segments2: Segment[]) {
  const intersections = [];

  for (let i = 0; i < segments1.length; i++) {
    for (let j = 0; j < segments2.length; j++) {
      const intersection = getIntersection(segments1[i], segments2[j]);

      if (intersection) {
        intersections.push({ intersection, m: i, n: j });
      }
    }
  }

  return intersections;
}

function getIntersection(segment1: Segment, segment2: Segment) {
  const t_num =
    (segment1.x1 - segment2.x1) * (segment2.y1 - segment2.y2) -
    (segment1.y1 - segment2.y1) * (segment2.x1 - segment2.x2);

  const u_num =
    (segment1.x1 - segment2.x1) * (segment1.y1 - segment1.y2) -
    (segment1.y1 - segment2.y1) * (segment1.x1 - segment1.x2);

  const D =
    (segment1.x1 - segment1.x2) * (segment2.y1 - segment2.y2) -
    (segment1.y1 - segment1.y2) * (segment2.x1 - segment2.x2);

  if (D === 0) {
    return null;
  }

  const t = t_num / D;
  const u = u_num / D;

  if (t < 0 || t > 1 || u < 0 || u > 1) {
    return null;
  }

  return {
    x: Math.round(segment1.x1 + t * (segment1.x2 - segment1.x1)),
    y: Math.round(segment1.y1 + t * (segment1.y2 - segment1.y1)),
  };
}

function getDistance(point1: Point, point2: Point) {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}
