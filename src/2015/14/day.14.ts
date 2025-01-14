import fs from "fs";

import "@/utils/array";

type Reindeer = {
  name: string;
  speed: number;
  active: number;
  inactive: number;
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/14/day.14.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseReindeer);
}

function parseReindeer(line: string): Reindeer {
  const parts = line.split(" ");

  return {
    name: parts[0],
    speed: Number(parts[3]),
    active: Number(parts[6]),
    inactive: Number(parts[13]),
  };
}

export function part1(totalDuration = 2503) {
  return parseInput()
    .map((x) => getPosition(x, totalDuration))
    .max();
}

export function part2(totalDuration = 2503) {
  const reindeer = parseInput();

  const positions = new Array(reindeer.length).fill(0);
  const points = new Array(reindeer.length).fill(0);

  for (let t = 1; t <= totalDuration; t++) {
    for (let n = 0; n < reindeer.length; n++) {
      positions[n] = getPosition(reindeer[n], t);
    }

    const leader = Math.max(...positions);

    for (let n = 0; n < reindeer.length; n++) {
      if (positions[n] === leader) {
        points[n]++;
      }
    }
  }

  return Math.max(...points);
}

function getPosition({ speed, active, inactive }: Reindeer, t: number) {
  const interval = active + inactive;

  return (
    speed * (active * Math.floor(t / interval) + Math.min(t % interval, active))
  );
}
