import fs from "fs";

type Step = [number, number, Directions];

enum Directions {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

function parseInput() {
  const diagram = fs
    .readFileSync("src/inputs/2017/19/day.19.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));

  const start: Step = [
    0,
    diagram[0].findIndex((x) => x === "|"),
    Directions.DOWN,
  ];

  return {
    diagram,
    start,
  };
}

export function part1() {
  const [letters] = follow();
  return letters;
}

export function part2() {
  const [, steps] = follow();
  return steps;
}

function follow() {
  const { diagram, start } = parseInput();

  let letters = "";

  const steps = [start];

  while (1) {
    const [i, j, direction] = steps.at(-1)!;

    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(diagram[i][j])) {
      letters += diagram[i][j];
    }

    const neighbors = (
      [
        [i - 1, j, Directions.UP],
        [i, j + 1, Directions.RIGHT],
        [i + 1, j, Directions.DOWN],
        [i, j - 1, Directions.LEFT],
      ] as Step[]
    ).filter(([i_next, j_next, direction_next]) => {
      // NOTE - Don't leave path.

      if ([" ", undefined].includes(diagram[i_next]?.[j_next])) {
        return false;
      }

      // NOTE - Don't change direction unless it's a junction.

      if (diagram[i][j] !== "+" && direction_next !== direction) {
        return false;
      }

      // NOTE - Don't backtrack.

      if (steps.length > 1) {
        const [i_prev, j_prev] = steps.at(-2)!;

        if (i_next === i_prev && j_next === j_prev) {
          return false;
        }
      }

      return true;
    });

    if (neighbors.length === 0) {
      break;
    } else if (neighbors.length > 1) {
      throw new Error("Unexpected neighbor count!");
    } else {
      steps.push(neighbors[0]);
    }
  }

  return [letters, steps.length];
}
