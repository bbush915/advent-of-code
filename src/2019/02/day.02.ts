import fs from "fs";

import { clone } from "utils/common";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2019/02/day.02.input.txt", "utf-8")
    .split(",")
    .map(Number);
}

export function part1() {
  const program = parseInput();

  program[1] = 12;
  program[2] = 2;

  return executeProgram(program);
}

export function part2() {
  const program = parseInput();

  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const program_ = clone(program);

      program_[1] = i;
      program_[2] = j;

      const result = executeProgram(program_);

      if (result === 19_690_720) {
        return 100 * i + j;
      }
    }
  }
}

function executeProgram(program: number[]) {
  let currentPosition = 0;

  loop: while (true) {
    switch (program[currentPosition]) {
      case 1: {
        program[program[currentPosition + 3]] =
          program[program[currentPosition + 1]] +
          program[program[currentPosition + 2]];
        break;
      }

      case 2: {
        program[program[currentPosition + 3]] =
          program[program[currentPosition + 1]] *
          program[program[currentPosition + 2]];
        break;
      }

      case 99: {
        break loop;
      }
    }

    currentPosition += 4;
  }

  return program[0];
}
