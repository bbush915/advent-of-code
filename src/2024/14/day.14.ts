import fs from "fs";

import "@/utils/array";

const WIDTH = 101;
const HEIGHT = 103;

type Robot = [number, number, number, number];

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/14/day.14.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(
      (x) =>
        <Robot>x.split(" ").flatMap((x) => x.slice(2).split(",").map(Number))
    );
}

export function part1() {
  const robots = parseInput();

  for (let n = 0; n < 100; n++) {
    for (const robot of robots) {
      robot[0] = (robot[0] + robot[2] + WIDTH) % WIDTH;
      robot[1] = (robot[1] + robot[3] + HEIGHT) % HEIGHT;
    }
  }

  let tl = 0;
  let tr = 0;
  let bl = 0;
  let br = 0;

  for (const [x, y] of robots) {
    const xMid = (WIDTH - 1) / 2;
    const yMid = (HEIGHT - 1) / 2;

    if (x < xMid) {
      if (y < yMid) {
        tl++;
      } else if (y > yMid) {
        bl++;
      }
    } else if (x > xMid) {
      if (y < yMid) {
        tr++;
      } else if (y > yMid) {
        br++;
      }
    }
  }

  return tl * tr * bl * br;
}

export function part2() {
  const robots = parseInput();

  let n = 0;
  let threshold = robots.length / 2;

  while (1) {
    n++;

    for (const robot of robots) {
      robot[0] = (robot[0] + robot[2] + WIDTH) % WIDTH;
      robot[1] = (robot[1] + robot[3] + HEIGHT) % HEIGHT;
    }

    // NOTE - We assume if a lot of robots are touching, then it's the tree.

    let touchCount = 0;

    for (let i = 0; i < robots.length; i++) {
      for (let j = i + 1; j < robots.length; j++) {
        if (
          (robots[i][0] === robots[j][0] &&
            Math.abs(robots[i][1] - robots[j][1]) <= 1) ||
          (robots[i][1] === robots[j][1] &&
            Math.abs(robots[i][0] - robots[j][0]) <= 1)
        ) {
          touchCount++;
          break;
        }
      }
    }

    if (touchCount > threshold) {
      displayBathroom(robots);
      break;
    }
  }

  return n;
}

function displayBathroom(robots: Robot[]) {
  const picture: string[][] = new Array(HEIGHT)
    .fill(null)
    .map(() => new Array(WIDTH).fill("."));

  for (const [x, y] of robots) {
    picture[y][x] = "*";
  }

  for (const line of picture) {
    console.log(line.join(""));
  }
}
