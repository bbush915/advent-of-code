import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/24/day.24.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(Number);
}

export function part1() {
  const packages = parseInput();

  const groups = findPossibleGroups(packages, packages.sum() / 3);

  for (let i = 0; i < groups.length; i++) {
    const [, value, ...x] = groups[i];

    for (let j = i + 1; j < groups.length; j++) {
      const [, , ...y] = groups[j];

      let isValid = true;

      for (let n = 0; n < x.length; n++) {
        if (x[n] && y[n]) {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        return value;
      }
    }
  }
}

export function part2() {
  const packages = parseInput();

  const groups = findPossibleGroups(packages, packages.sum() / 4);

  for (let i = 0; i < groups.length; i++) {
    const [, value, ...x] = groups[i];

    for (let j = i + 1; j < groups.length; j++) {
      const [, , ...y] = groups[j];

      let isValid = true;

      for (let n = 0; n < x.length; n++) {
        if (x[n] && y[n]) {
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        continue;
      }

      for (let k = j + 1; k < groups.length; k++) {
        const [, , ...z] = groups[k];

        let isValid = true;

        for (let n = 0; n < x.length; n++) {
          if ((x[n] && z[n]) || (y[n] && z[n])) {
            isValid = false;
            break;
          }
        }

        if (isValid) {
          return value;
        }
      }
    }
  }
}

function findPossibleGroups(packages: number[], weight: number) {
  const groups: number[][] = [];
  const cache = new Map<string, number[][]>();

  findPossibleGroupsHelper(packages, [], 0, weight, groups, cache);

  return groups
    .map((group) => [
      group.sum(),
      group
        .map((x, i) => x * packages[i])
        .filter((x) => x)
        .product(),
      ...group,
    ])
    .sort((x, y) => (x[0] === y[0] ? x[1] - y[1] : x[0] - y[0]));
}

function findPossibleGroupsHelper(
  packages: number[],
  group: number[],
  index: number,
  target: number,
  groups: number[][],
  cache: Map<string, number[][]>
) {
  if (target < 0) {
    return;
  } else if (target === 0) {
    groups.push([
      ...group,
      ...new Array(packages.length - group.length).fill(0),
    ]);

    return;
  }

  if (index === packages.length) {
    return;
  }

  findPossibleGroupsHelper(
    packages,
    [...group, 1],
    index + 1,
    target - packages[index],
    groups,
    cache
  );

  findPossibleGroupsHelper(
    packages,
    [...group, 0],
    index + 1,
    target,
    groups,
    cache
  );
}
