import fs from "fs";

import "@/utils/array";
import { toKey } from "@/utils/common";
import { DefaultGetDistance, search } from "@/utils/graph";

type Node = {
  x: number;
  y: number;
  used: number;
  available: number;
};

enum Cells {
  FREE = "_",
  PARTIAL = ".",
  FULL = "#",
  GOAL = "G",
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/22/day.22.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .slice(2)
    .map(parseNode);
}

function parseNode(value: string): Node {
  const parts = value.split(/\s+/);

  const [x, y] = parts[0]
    .split("-")
    .slice(1)
    .map((x) => Number(x.slice(1)));

  return {
    x,
    y,
    used: Number(parts[2].slice(0, -1)),
    available: Number(parts[3].slice(0, -1)),
  };
}

export function part1() {
  const nodes = parseInput();

  let count = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i !== j && nodes[i].used && nodes[j].available >= nodes[i].used) {
        count++;
      }
    }
  }

  return count;
}

export function part2() {
  const nodes = parseInput();

  const { grid, free, goal } = makeGrid(nodes);

  const source = toKey([free.x, free.y, goal.x, goal.y]);
  const target = toKey([1, 0, 0, 0]);

  const { distanceLookup } = search(
    function getNeighbors(key: string) {
      const [freeX, freeY, goalX, goalY] = fromKey(key);

      const neighbors: string[] = [];

      // NOTE - Up

      if (freeX > 0 && grid[freeX - 1][freeY] !== Cells.FULL) {
        if (freeX - 1 === goalX && freeY === goalY) {
          neighbors.push(toKey([goalX, freeY, freeX, goalY]));
        } else {
          neighbors.push(toKey([freeX - 1, freeY, goalX, goalY]));
        }
      }

      // NOTE - Down

      if (freeX < grid.length - 1 && grid[freeX + 1][freeY] !== Cells.FULL) {
        if (freeX + 1 === goalX && freeY === goalY) {
          neighbors.push(toKey([goalX, freeY, freeX, goalY]));
        } else {
          neighbors.push(toKey([freeX + 1, freeY, goalX, goalY]));
        }
      }

      // NOTE - Left

      if (freeY > 0 && grid[freeX][freeY - 1] !== Cells.FULL) {
        if (freeY - 1 === goalY && freeX === goalX) {
          neighbors.push(toKey([freeX, goalY, goalX, freeY]));
        } else {
          neighbors.push(toKey([freeX, freeY - 1, goalX, goalY]));
        }
      }

      // NOTE - Right

      if (freeY < grid[0].length - 1 && grid[freeX][freeY + 1] !== Cells.FULL) {
        if (freeY + 1 === goalY && freeX === goalX) {
          neighbors.push(toKey([freeX, goalY, goalX, freeY]));
        } else {
          neighbors.push(toKey([freeX, freeY + 1, goalX, goalY]));
        }
      }

      return neighbors;
    },
    source,
    target,
    DefaultGetDistance,
    function getHeuristic(key: string) {
      const [freeX, freeY, goalX, goalY] = fromKey(key);

      return Math.abs(freeX - goalX) + Math.abs(freeY - goalY) + goalX + goalY;
    }
  );

  return distanceLookup.get(target)!;
}

function makeGrid(nodes: Node[]) {
  const grid: Cells[][] = [];

  let free: Node;
  let goal: Node;

  const maxX = nodes.map((x) => x.x).max();
  const maxY = nodes.map((x) => x.y).max();

  const average = nodes.map((x) => x.used).avg();

  for (let i = 0; i <= maxX; i++) {
    const row: Cells[] = [];

    for (let j = 0; j <= maxY; j++) {
      const node = nodes.find((node) => node.x === i && node.y === j)!;

      if (node.used === 0) {
        free = node;
        row.push(Cells.FREE);
      } else if (node.used > 1.5 * average) {
        row.push(Cells.FULL);
      } else if (i === maxX && j === 0) {
        goal = node;
        row.push(Cells.GOAL);
      } else {
        row.push(Cells.PARTIAL);
      }
    }

    grid.push(row);
  }

  return { grid, free: free!, goal: goal! };
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
