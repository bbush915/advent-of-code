import fs from "fs";

import "@/utils/array";

type Ingredient = {
  name: string;
  properties: number[];
};

enum Properties {
  CAPACITY,
  DURABILITY,
  FLAVOR,
  TEXTURE,
  CALORIES,
}

type Cookie = number[];

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/15/day.15.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseIngredient);
}

function parseIngredient(line: string): Ingredient {
  return {
    name: line.slice(0, line.indexOf(":")),
    properties: line.match(/-?\d+/g)!.map(Number),
  };
}

export function part1() {
  const ingredients = parseInput();

  let maxTotalScore = 0;

  for (const cookie of generateFixedLengthCompositions(
    100,
    ingredients.length
  )) {
    const totalScore = getTotalScore(ingredients, cookie);

    if (totalScore > maxTotalScore) {
      maxTotalScore = totalScore;
    }
  }

  return maxTotalScore;
}

export function part2() {
  const ingredients = parseInput();

  let maxTotalScore = 0;

  for (const cookie of generateFixedLengthCompositions(
    100,
    ingredients.length
  )) {
    if (getPropertyScore(ingredients, Properties.CALORIES, cookie) !== 500) {
      continue;
    }

    const totalScore = getTotalScore(ingredients, cookie);

    if (totalScore > maxTotalScore) {
      maxTotalScore = totalScore;
    }
  }

  return maxTotalScore;
}

function* generateFixedLengthCompositions(
  n: number,
  k: number
): Generator<number[]> {
  const compositions: number[][] = [];

  if (k === 0) {
    if (n === 0) {
      yield [];
    }

    return;
  } else if (k === 1) {
    if (n > 0) {
      yield [n];
    }

    return;
  }

  if (k > n) {
    return;
  }

  let composition = [...new Array(k - 1).fill(1), n - k + 1];

  while (composition[0] < n - k + 1) {
    yield composition;

    const index = composition.findLastIndex((x) => x !== 1);
    const value = composition[index];

    composition[index - 1] += 1;
    composition[index] = 1;

    composition[k - 1] = value - 1;
  }

  return compositions;
}

function getTotalScore(ingredients: Ingredient[], cookie: Cookie) {
  return [
    Properties.CAPACITY,
    Properties.DURABILITY,
    Properties.FLAVOR,
    Properties.TEXTURE,
  ]
    .map((property) =>
      Math.max(getPropertyScore(ingredients, property, cookie), 0)
    )
    .product();
}

function getPropertyScore(
  ingredients: Ingredient[],
  property: Properties,
  cookie: Cookie
) {
  return ingredients
    .map((ingredient, i) => cookie[i] * ingredient.properties[property])
    .sum();
}
