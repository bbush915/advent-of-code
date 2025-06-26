import fs from "fs";

enum Directions {
  UP = "U",
  LEFT = "L",
  RIGHT = "R",
  DOWN = "D",
}

const DIRECTION_MAP = {
  [Directions.UP]: [-1, 0],
  [Directions.LEFT]: [0, -1],
  [Directions.RIGHT]: [0, 1],
  [Directions.DOWN]: [1, 0],
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/02/day.02.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("") as Directions[]);
}

export function part1() {
  return getCode(
    [
      [" ", " ", " ", " ", " "],
      [" ", "1", "2", "3", " "],
      [" ", "4", "5", "6", " "],
      [" ", "7", "8", "9", " "],
      [" ", " ", " ", " ", " "],
    ],
    [2, 2]
  );
}

export function part2() {
  return getCode(
    [
      [" ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", "1", " ", " ", " "],
      [" ", " ", "2", "3", "4", " ", " "],
      [" ", "5", "6", "7", "8", "9", " "],
      [" ", " ", "A", "B", "C", " ", " "],
      [" ", " ", " ", "D", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " "],
    ],
    [3, 1]
  );
}

function getCode(keypad: string[][], [x, y]: number[]) {
  const instructions = parseInput();

  let code = "";

  for (const line of instructions) {
    for (const direction of line) {
      [x, y] = move(keypad, [x, y], direction);
    }

    code += keypad[x][y];
  }

  return code;
}

function move(keypad: string[][], [x, y]: number[], direction: Directions) {
  const [dx, dy] = DIRECTION_MAP[direction];

  return keypad[x + dx][y + dy] === " " ? [x, y] : [x + dx, y + dy];
}
