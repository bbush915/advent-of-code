import fs from "fs";

type Aunt = {
  children: number;
  cats: number;
  samoyeds: number;
  pomeranians: number;
  akitas: number;
  vizslas: number;
  goldfish: number;
  trees: number;
  cars: number;
  perfumes: number;
};

const SCAN: Aunt = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/16/day.16.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseAunt);
}

function parseAunt(
  line: string,
  index: number
): { id: number } & Partial<Aunt> {
  const attributes = line
    .slice(line.indexOf(":") + 2)
    .split(", ")
    .map((x) => x.split(": "));

  return {
    id: index + 1,
    [attributes[0][0]]: Number(attributes[0][1]),
    [attributes[1][0]]: Number(attributes[1][1]),
    [attributes[2][0]]: Number(attributes[2][1]),
  };
}

export function part1() {
  return parseInput().find(filterAunts1)!.id;
}

export function part2() {
  return parseInput().find(filterAunts2)!.id;
}

function filterAunts1(aunt: ReturnType<typeof parseInput>[number]) {
  for (const [key, value] of Object.entries(aunt)) {
    if (key === "id") {
      continue;
    }

    if (SCAN[key as keyof Aunt] !== value) {
      return false;
    }
  }

  return true;
}

function filterAunts2(aunt: ReturnType<typeof parseInput>[number]) {
  for (const [key, value] of Object.entries(aunt)) {
    switch (key) {
      case "id": {
        continue;
      }

      case "cats":
      case "trees": {
        if (SCAN[key as keyof Aunt] > value) {
          return false;
        }

        break;
      }

      case "pomeranians":
      case "goldfish": {
        if (SCAN[key as keyof Aunt] < value) {
          return false;
        }

        break;
      }

      default: {
        if (SCAN[key as keyof Aunt] !== value) {
          return false;
        }

        break;
      }
    }
  }

  return true;
}
