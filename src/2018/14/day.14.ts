import fs from "fs";

function parseInput() {
  return Number(
    fs.readFileSync("src/inputs/2018/14/day.14.input.txt").toString().trim()
  );
}

export function part1() {
  return createRecipes(getResult1);
}

export function part2() {
  return createRecipes(getResult2);
}

function createRecipes(
  getResult: (recipes: number[], recipeCount: number) => string | number | null
) {
  const recipeCount = parseInput();

  const elves = [0, 1];
  const recipes = [3, 7];

  while (1) {
    const recipe = (recipes[elves[0]] + recipes[elves[1]])
      .toString()
      .split("")
      .map(Number);

    recipes.push(...recipe);

    elves[0] = (elves[0] + recipes[elves[0]] + 1) % recipes.length;
    elves[1] = (elves[1] + recipes[elves[1]] + 1) % recipes.length;

    const result = getResult(recipes, recipeCount);

    if (result) {
      return result;
    }
  }
}

function getResult1(recipes: number[], recipeCount: number) {
  if (recipes.length > recipeCount + 10) {
    return recipes.slice(recipeCount, recipeCount + 10).join("");
  }

  return null;
}

function getResult2(recipes: number[], recipeCount: number) {
  const found = recipes.slice(-10).join("").indexOf(String(recipeCount));

  if (found >= 0) {
    return recipes.length - 10 + found;
  }

  return null;
}
