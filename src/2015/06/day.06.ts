import fs from "fs";

enum Actions {
  OFF,
  ON,
  TOGGLE,
}

const ACTION_MAP = {
  off: Actions.OFF,
  on: Actions.ON,
  toggle: Actions.TOGGLE,
};

type Instruction = {
  action: Actions;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/06/day.06.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseInstruction);
}

function parseInstruction(value: string): Instruction {
  const action =
    ACTION_MAP[value.match(/on|off|toggle/)![0] as keyof typeof ACTION_MAP];

  const [minX, minY, maxX, maxY] = value.match(/\d+/g)!.map(Number);

  return { action, minX, minY, maxX, maxY };
}

export function part1() {
  return getTotalBrightness(calculateBinaryBrightness);
}

export function part2() {
  return getTotalBrightness(calculateCumulativeBrightness);
}

function getTotalBrightness(
  calculateBrightness: (previousBrightness: number, action: Actions) => number
) {
  const instructions = parseInput();

  let totalBrightness = 0;

  for (let x = 0; x < 1_000; x++) {
    for (let y = 0; y < 1_000; y++) {
      let brightness = 0;

      for (const instruction of instructions) {
        if (isApplicable(x, y, instruction)) {
          brightness = calculateBrightness(brightness, instruction.action);
        }
      }

      totalBrightness += brightness;
    }
  }

  return totalBrightness;
}

function calculateBinaryBrightness(
  previousBrightness: number,
  action: Actions
) {
  let currentBrightness: number;

  switch (action) {
    case Actions.ON: {
      currentBrightness = 1;
      break;
    }

    case Actions.OFF: {
      currentBrightness = 0;
      break;
    }

    case Actions.TOGGLE: {
      currentBrightness = 1 - previousBrightness;
      break;
    }
  }

  return currentBrightness;
}

function calculateCumulativeBrightness(
  previousBrightness: number,
  action: Actions
) {
  let currentBrightness: number;

  switch (action) {
    case Actions.ON: {
      currentBrightness = previousBrightness + 1;
      break;
    }

    case Actions.OFF: {
      currentBrightness = Math.max(0, previousBrightness - 1);
      break;
    }

    case Actions.TOGGLE: {
      currentBrightness = previousBrightness + 2;
      break;
    }
  }

  return currentBrightness;
}

function isApplicable(x: number, y: number, instruction: Instruction) {
  return (
    instruction.minX <= x &&
    x <= instruction.maxX &&
    instruction.minY <= y &&
    y <= instruction.maxY
  );
}
