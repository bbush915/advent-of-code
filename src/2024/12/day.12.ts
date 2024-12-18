import fs from "fs";

import "@/utils/array";
import { toKey } from "@/utils/common";

type Map = string[][];

type Region = {
  plots: string[];
  edges: number[][];
};

function parseInput(): Map {
  return fs
    .readFileSync("src/inputs/2024/12/day.12.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));
}

export function part1() {
  return getTotalPrice(calculatePrice);
}

export function part2() {
  return getTotalPrice(calculateDiscountedPrice);
}

function getTotalPrice(calculatePrice: (map: Map, region: Region) => number) {
  const map = parseInput();

  const visited = new Set<string>();

  const regions: Region[] = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const plot = toKey([i, j]);

      if (visited.has(plot)) {
        continue;
      }

      const region: Region = {
        plots: [],
        edges: [],
      };

      const plots = [plot];

      while (plots.length > 0) {
        const plot = plots.pop()!;

        if (visited.has(plot)) {
          continue;
        } else {
          visited.add(plot);
          region.plots.push(plot);
        }

        const [m, n] = fromKey(plot);

        const edges = [
          [m, n, m, n + 1],
          [m, n + 1, m + 1, n + 1],
          [m + 1, n, m + 1, n + 1],
          [m, n, m + 1, n],
        ];

        // NOTE - Top

        if (m > 0 && map[m - 1][n] === map[i][j]) {
          plots.push(toKey([m - 1, n]));
          edges[0] = [];
        }

        // NOTE - Right

        if (n < map[m].length - 1 && map[m][n + 1] === map[i][j]) {
          plots.push(toKey([m, n + 1]));
          edges[1] = [];
        }

        // NOTE - Bottom

        if (m < map.length - 1 && map[m + 1][n] === map[i][j]) {
          plots.push(toKey([m + 1, n]));
          edges[2] = [];
        }

        // NOTE - Left

        if (n > 0 && map[m][n - 1] === map[i][j]) {
          plots.push(toKey([m, n - 1]));
          edges[3] = [];
        }

        region.edges.push(...edges.filter((x) => x.length));
      }

      regions.push(region);
    }
  }

  return regions.map((region) => calculatePrice(map, region)).sum();
}

function calculatePrice(_map: Map, { plots, edges }: Region) {
  return plots.length * edges.length;
}

function calculateDiscountedPrice(map: Map, { plots, edges }: Region) {
  const plotLookup = new Set<string>(plots);

  let sides = 0;

  // NOTE - Scan horizontally.

  for (let i = 0; i <= map.length; i++) {
    const horizontalEdges = edges
      .filter((edge) => edge[0] === i && edge[2] === i)
      .sort((x, y) => x[1] - y[1]);

    if (horizontalEdges.length) {
      sides++;

      for (let n = 0; n < horizontalEdges.length - 1; n++) {
        const tl = plotLookup.has(
          toKey([horizontalEdges[n][0] - 1, horizontalEdges[n][1]])
        );

        const tr = plotLookup.has(
          toKey([horizontalEdges[n + 1][0] - 1, horizontalEdges[n + 1][1]])
        );

        const bl = plotLookup.has(
          toKey([horizontalEdges[n][0], horizontalEdges[n][1]])
        );

        const br = plotLookup.has(
          toKey([horizontalEdges[n + 1][0], horizontalEdges[n + 1][1]])
        );

        if (
          horizontalEdges[n][3] !== horizontalEdges[n + 1][1] ||
          (tl !== tr && bl !== br)
        ) {
          sides++;
        }
      }
    }
  }

  // NOTE - Scan vertically.

  for (let j = 0; j <= map[0].length; j++) {
    const verticalEdges = edges
      .filter((edge) => edge[1] === j && edge[3] === j)
      .sort((x, y) => x[0] - y[0]);

    if (verticalEdges.length) {
      sides++;

      for (let n = 0; n < verticalEdges.length - 1; n++) {
        const tl = plotLookup.has(
          toKey([verticalEdges[n][0], verticalEdges[n][1] - 1])
        );

        const bl = plotLookup.has(
          toKey([verticalEdges[n + 1][0], verticalEdges[n + 1][1] - 1])
        );

        const tr = plotLookup.has(
          toKey([verticalEdges[n][0], verticalEdges[n][1]])
        );

        const br = plotLookup.has(
          toKey([verticalEdges[n + 1][0], verticalEdges[n + 1][1]])
        );

        if (
          verticalEdges[n][2] !== verticalEdges[n + 1][0] ||
          (tl !== bl && tr !== br)
        ) {
          sides++;
        }
      }
    }
  }

  return plots.length * sides;
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
