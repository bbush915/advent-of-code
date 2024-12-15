import fs from "fs";

enum Tiles {
  EMPTY = ".",
  ROBOT = "@",
  WALL = "#",
  SMALL_BOX = "O",
  LARGE_BOX_LEFT = "[",
  LARGE_BOX_RIGHT = "]",
}

enum Moves {
  LEFT = "<",
  UP = "^",
  RIGHT = ">",
  DOWN = "v",
}

const DELTA_MAP = {
  [Moves.LEFT]: [0, -1],
  [Moves.UP]: [-1, 0],
  [Moves.RIGHT]: [0, 1],
  [Moves.DOWN]: [1, 0],
};

function parseInput() {
  const sections = fs
    .readFileSync("src/inputs/2024/15/day.15.input.txt")
    .toString()
    .split("\n\n");

  const map = sections[0].split("\n").map((x) => x.split("")) as Tiles[][];

  const robot: number[] = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "@") {
        robot.push(i, j);
      }
    }
  }

  const moves = sections[1].split("\n").flatMap((x) => x.split("")) as Moves[];

  return {
    map,
    robot,
    moves,
  };
}

export function part1() {
  const { map, robot, moves } = parseInput();

  let [i, j] = robot;

  for (const move of moves) {
    const [di, dj] = DELTA_MAP[move];

    let n = 1;

    while (map[i + n * di][j + n * dj] === Tiles.SMALL_BOX) {
      n++;
    }

    if (map[i + n * di][j + n * dj] === Tiles.WALL) {
      continue;
    }

    while (n) {
      map[i + n * di][j + n * dj] = map[i + (n - 1) * di][j + (n - 1) * dj];
      map[i + (n - 1) * di][j + (n - 1) * dj] = Tiles.EMPTY;

      n--;
    }

    i += di;
    j += dj;
  }

  return getTotalGpsCoordinates(map);
}

export function part2() {
  const { map: map_, robot, moves } = parseInput();

  const map = getResizedMap(map_);

  let i = robot[0];
  let j = 2 * robot[1];

  for (const move of moves) {
    const [di, dj] = DELTA_MAP[move];

    moveSwitch: switch (move) {
      case Moves.LEFT:
      case Moves.RIGHT: {
        let n = 1;

        while (
          [Tiles.LARGE_BOX_LEFT, Tiles.LARGE_BOX_RIGHT].includes(
            map[i][j + n * dj]
          )
        ) {
          n++;
        }

        if (map[i][j + n * dj] === Tiles.WALL) {
          continue;
        }

        while (n) {
          map[i][j + n * dj] = map[i][j + (n - 1) * dj];
          map[i][j + (n - 1) * dj] = Tiles.EMPTY;

          n--;
        }

        j += dj;

        break;
      }

      case Moves.UP:
      case Moves.DOWN: {
        let n = 1;
        let spans = [[j, j]];

        while (1) {
          const span = [spans[n - 1][0], spans[n - 1][1]];

          let spanContainsBox = false;

          for (let m = spans[n - 1][0]; m <= spans[n - 1][1]; m++) {
            if (map[i + n * di][m] === Tiles.WALL) {
              break moveSwitch;
            } else if (
              [Tiles.LARGE_BOX_LEFT, Tiles.LARGE_BOX_RIGHT].includes(
                map[i + n * di][m]
              )
            ) {
              spanContainsBox = true;

              if (
                m === spans[n - 1][0] &&
                map[i + n * di][m] === Tiles.LARGE_BOX_RIGHT
              ) {
                span[0]--;
              }

              if (
                m === spans[n - 1][1] &&
                map[i + n * di][m] === Tiles.LARGE_BOX_LEFT
              ) {
                span[1]++;
              }
            }
          }

          if (!spanContainsBox) {
            break;
          }

          while (map[i + n * di][span[0]] === Tiles.EMPTY) {
            span[0]++;
          }

          while (map[i + n * di][span[1]] === Tiles.EMPTY) {
            span[1]--;
          }

          n++;
          spans.push(span);
        }

        while (n) {
          for (let m = spans[n - 1][0]; m <= spans[n - 1][1]; m++) {
            map[i + n * di][m] = map[i + (n - 1) * di][m];
            map[i + (n - 1) * di][m] = Tiles.EMPTY;
          }

          n--;
        }

        i += di;

        break;
      }
    }
  }

  return getTotalGpsCoordinates(map);
}

function getResizedMap(map: Tiles[][]) {
  const resizedMap: Tiles[][] = [];

  for (let i = 0; i < map.length; i++) {
    const resizedRow: Tiles[] = [];

    for (let j = 0; j < map[i].length; j++) {
      switch (map[i][j]) {
        case Tiles.WALL: {
          resizedRow.push(Tiles.WALL, Tiles.WALL);
          break;
        }

        case Tiles.SMALL_BOX: {
          resizedRow.push(Tiles.LARGE_BOX_LEFT, Tiles.LARGE_BOX_RIGHT);
          break;
        }

        case Tiles.EMPTY: {
          resizedRow.push(Tiles.EMPTY, Tiles.EMPTY);
          break;
        }

        case Tiles.ROBOT: {
          resizedRow.push(Tiles.ROBOT, Tiles.EMPTY);
          break;
        }
      }
    }

    resizedMap.push(resizedRow);
  }

  return resizedMap;
}

function getTotalGpsCoordinates(map: Tiles[][]) {
  let totalGpsCoordinates = 0;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (![Tiles.SMALL_BOX, Tiles.LARGE_BOX_LEFT].includes(map[i][j])) {
        continue;
      }

      totalGpsCoordinates += 100 * i + j;
    }
  }

  return totalGpsCoordinates;
}
