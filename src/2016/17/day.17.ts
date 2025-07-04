import crypto from "crypto";
import fs from "fs";

type State = [number, number, string];

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/17/day.17.input.txt")
    .toString()
    .trim();
}

export function part1() {
  const passcode = parseInput();

  const states: State[] = [[0, 0, ""]];

  while (states.length) {
    const state = states.shift()!;

    if (state[0] === 3 && state[1] === 3) {
      return state[2];
    }

    states.push(...getNextStates(state, passcode));
  }
}

export function part2() {
  const passcode = parseInput();

  const states: State[] = [[0, 0, ""]];
  let maximumLength = 0;

  while (states.length) {
    const state = states.shift()!;

    if (state[0] === 3 && state[1] === 3) {
      maximumLength = Math.max(maximumLength, state[2].length);
      continue;
    }

    states.push(...getNextStates(state, passcode));
  }

  return maximumLength;
}

function getNextStates([i, j, path]: State, passcode: string) {
  const states: State[] = [];

  const hash = crypto
    .createHash("md5")
    .update(`${passcode}${path}`)
    .digest("hex");

  // NOTE - Up

  if (i > 0 && isOpen(hash[0])) {
    states.push([i - 1, j, path + "U"]);
  }

  // NOTE - Down

  if (i < 3 && isOpen(hash[1])) {
    states.push([i + 1, j, path + "D"]);
  }

  // NOTE - Left

  if (j > 0 && isOpen(hash[2])) {
    states.push([i, j - 1, path + "L"]);
  }

  // NOTE - Right

  if (j < 3 && isOpen(hash[3])) {
    states.push([i, j + 1, path + "R"]);
  }

  return states;
}

function isOpen(value: string) {
  return parseInt(value, 16) > 10;
}
