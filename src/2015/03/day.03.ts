import fs from "fs";

enum Instructions {
  NORTH = "^",
  EAST = ">",
  SOUTH = "v",
  WEST = "<",
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/03/day.03.input.txt")
    .toString()
    .split("")
    .map(parseInstruction);
}

function parseInstruction(value: string) {
  switch (value) {
    case Instructions.NORTH: {
      return [-1, 0];
    }

    case Instructions.EAST: {
      return [0, 1];
    }

    case Instructions.SOUTH: {
      return [1, 0];
    }

    case Instructions.WEST: {
      return [0, -1];
    }

    default: {
      throw new Error("Unexpected instruction!");
    }
  }
}

export function part1() {
  const instructions = parseInput();
  const locations = new Set([toKey([0, 0])]);

  visitUniqueLocations(instructions, locations);

  return locations.size;
}

export function part2() {
  const instructions = parseInput();
  const locations = new Set([toKey([0, 0])]);

  const santaInstructions: number[][] = [];
  const roboSantaInstructions: number[][] = [];

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];

    if (i % 2 === 0) {
      santaInstructions.push(instruction);
    } else {
      roboSantaInstructions.push(instruction);
    }
  }

  visitUniqueLocations(santaInstructions, locations);
  visitUniqueLocations(roboSantaInstructions, locations);

  return locations.size;
}

function visitUniqueLocations(
  instructions: number[][],
  initialLocations: Set<string>
) {
  instructions.reduce(
    ({ position: [x, y], locations }, [dx, dy]) => {
      x += dx;
      y += dy;

      locations.add(toKey([x, y]));

      return { position: [x, y], locations };
    },
    { position: [0, 0], locations: initialLocations }
  );
}

function toKey(position: number[]) {
  return position.join("|");
}
