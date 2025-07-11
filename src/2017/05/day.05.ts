import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/05/day.05.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(Number);
}

export function part1() {
  return getExitStepCount(normalJump);
}

export function part2() {
  return getExitStepCount(strangeJump);
}

function getExitStepCount(
  jump: (instructions: number[], index: number) => void
) {
  const instructions = parseInput();

  let index = 0;
  let steps = 0;

  while (index >= 0 && index < instructions.length) {
    const offset = instructions[index];

    jump(instructions, index);

    index += offset;
    steps++;
  }

  return steps;
}

function normalJump(instructions: number[], index: number) {
  instructions[index]++;
}

function strangeJump(instructions: number[], index: number) {
  instructions[index] += instructions[index] >= 3 ? -1 : 1;
}
