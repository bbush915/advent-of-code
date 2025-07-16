import fs from "fs";

type Move =
  | {
      type: MoveTypes.SPIN;
      n: number;
    }
  | {
      type: MoveTypes.EXCHANGE;
      i: number;
      j: number;
    }
  | {
      type: MoveTypes.PARTNER;
      x: string;
      y: string;
    };

enum MoveTypes {
  SPIN = "s",
  EXCHANGE = "x",
  PARTNER = "p",
}

function parseInput() {
  const moves = fs
    .readFileSync("src/inputs/2017/16/day.16.input.txt")
    .toString()
    .trim()
    .split(",")
    .map(parseMove);

  const programs = "abcdefghijklmnop".split("");

  return {
    moves,
    programs,
  };
}

function parseMove(value: string): Move {
  const type = value[0] as MoveTypes;

  switch (type) {
    case MoveTypes.SPIN: {
      return {
        type,
        n: Number(value.slice(1)),
      };
    }

    case MoveTypes.EXCHANGE: {
      const [i, j] = value.slice(1).split("/");

      return {
        type,
        i: Number(i),
        j: Number(j),
      };
    }

    case MoveTypes.PARTNER: {
      const [x, y] = value.slice(1).split("/");

      return {
        type,
        x,
        y,
      };
    }
  }
}

export function part1() {
  const { moves, programs } = parseInput();

  dance(moves, programs);

  return programs.join("");
}

export function part2() {
  const { moves, programs } = parseInput();

  const period = getPeriod(moves, programs)!;

  for (let n = 0; n < 1_000_000_000 % period; n++) {
    dance(moves, programs);
  }

  return programs.join("");
}

function getPeriod(moves: Move[], comparison: string[]) {
  const programs = [...comparison];

  for (let n = 0; n < 1_000_000_000; n++) {
    dance(moves, programs);

    if (programs.join("") === comparison.join("")) {
      return n + 1;
    }
  }
}

function dance(moves: Move[], programs: string[]) {
  for (const move of moves) {
    switch (move.type) {
      case MoveTypes.SPIN: {
        for (let n = 0; n < move.n; n++) {
          programs.unshift(programs.pop()!);
        }

        break;
      }

      case MoveTypes.EXCHANGE: {
        const { i, j } = move;

        [programs[i], programs[j]] = [programs[j], programs[i]];

        break;
      }

      case MoveTypes.PARTNER: {
        const i = programs.findIndex((x) => x === move.x);
        const j = programs.findIndex((x) => x === move.y);

        [programs[i], programs[j]] = [programs[j], programs[i]];

        break;
      }
    }
  }
}
