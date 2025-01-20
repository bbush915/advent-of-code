import fs from "fs";

function parseInput() {
  const grid = fs
    .readFileSync("src/inputs/2015/18/day.18.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("").map((x) => x === "#"));

  const height = grid.length;
  const width = grid[0].length;

  const lights = new Set<number>();

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (grid[i][j]) {
        lights.add(i * width + j);
      }
    }
  }

  return {
    height,
    width,
    lights,
  };
}

export function part1(steps = 100) {
  let { height, width, lights } = parseInput();

  for (let n = 0; n < steps; n++) {
    lights = step(height, width, lights);
  }

  return lights.size;
}

export function part2(steps = 100) {
  let { height, width, lights } = parseInput();

  lights.add(0);
  lights.add(width - 1);
  lights.add((height - 1) * width);
  lights.add((height - 1) * width + (width - 1));

  for (let n = 0; n < steps; n++) {
    lights = step(height, width, lights);

    lights.add(0);
    lights.add(width - 1);
    lights.add((height - 1) * width);
    lights.add((height - 1) * width + (width - 1));
  }

  return lights.size;
}

function step(height: number, width: number, lights: Set<number>) {
  const lights_ = new Set<number>();

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const neighbors = [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, j - 1],
        [i, j + 1],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ].filter(
        ([i, j]) =>
          i >= 0 &&
          i < height &&
          j >= 0 &&
          j < width &&
          lights.has(i * width + j)
      ).length;

      const key = i * width + j;

      if (
        lights.has(key) ? neighbors === 2 || neighbors === 3 : neighbors === 3
      ) {
        lights_.add(key);
      }
    }
  }

  return lights_;
}
