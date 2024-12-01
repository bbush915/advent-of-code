import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/01/day.01.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("   ").map(Number))
    .reduce<number[][]>(
      (lists, [x, y]) => {
        lists[0].push(x);
        lists[1].push(y);

        return lists;
      },
      [[], []]
    );
}

export function part1() {
  const [list1, list2] = parseInput();

  sortList(list1);
  sortList(list2);

  let totalDistance = 0;

  for (let i = 0; i < list1.length; i++) {
    totalDistance += Math.abs(list1[i] - list2[i]);
  }

  return totalDistance;
}

export function part2() {
  const [list1, list2] = parseInput();

  const list2CountLookup = getListCountLookup(list2);

  let similarityScore = 0;

  for (let i = 0; i < list1.length; i++) {
    similarityScore += list1[i] * (list2CountLookup.get(list1[i]) ?? 0);
  }

  return similarityScore;
}

function sortList(list: number[]) {
  return list.sort((x, y) => x - y);
}

function getListCountLookup(list: number[]) {
  return list.reduce((lookup, value) => {
    const count = lookup.get(value);
    return lookup.set(value, (count ?? 0) + 1);
  }, new Map<number, number>());
}
