import fs from "fs";

enum OperationTypes {
  RECT = "rect",
  ROTATE_ROW = "rotate row",
  ROTATE_COL = "rotate column",
}

type Operation = {
  type: OperationTypes;
  a: number;
  b: number;
};

const WIDTH = 50;
const HEIGHT = 6;

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/08/day.08.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseOperation);
}

function parseOperation(value: string): Operation {
  const parts = value.split(" ");

  let type = OperationTypes.RECT;

  if (parts[1] === "row") {
    type = OperationTypes.ROTATE_ROW;
  } else if (parts[1] === "column") {
    type = OperationTypes.ROTATE_COL;
  }

  const [a, b] = value.match(/\d+/g)!.map(Number);

  return {
    type,
    a,
    b,
  };
}

export function part1() {
  const screen = execute();

  return screen.flatMap((x) => x).filter((x) => x === "#").length;
}

export function part2() {
  const screen = execute();

  return ["", ...screen.map((x) => x.join("")), ""].join("\n");
}

function execute() {
  const operations = parseInput();

  const screen = new Array(HEIGHT)
    .fill(null)
    .map(() => new Array<string>(WIDTH).fill("."));

  for (const operation of operations) {
    switch (operation.type) {
      case OperationTypes.RECT: {
        for (let i = 0; i < operation.b; i++) {
          for (let j = 0; j < operation.a; j++) {
            screen[i][j] = "#";
          }
        }

        break;
      }

      case OperationTypes.ROTATE_ROW: {
        const values: string[] = [];

        for (let j = 0; j < WIDTH; j++) {
          values.push(screen[operation.a][j]);
        }

        for (let j = 0; j < WIDTH; j++) {
          screen[operation.a][j] = values[(j + WIDTH - operation.b) % WIDTH];
        }

        break;
      }

      case OperationTypes.ROTATE_COL: {
        const values: string[] = [];

        for (let i = 0; i < HEIGHT; i++) {
          values.push(screen[i][operation.a]);
        }

        for (let i = 0; i < HEIGHT; i++) {
          screen[i][operation.a] = values[(i + HEIGHT - operation.b) % HEIGHT];
        }

        break;
      }
    }
  }

  return screen;
}
