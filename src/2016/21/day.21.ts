import fs from "fs";

import { clone } from "@/utils/common";

type Operation =
  | {
      type: Operations.SWAP_POSITION;
      i: number;
      j: number;
    }
  | {
      type: Operations.SWAP_LETTER;
      x: string;
      y: string;
    }
  | {
      type: Operations.ROTATE_LEFT | Operations.ROTATE_RIGHT;
      n: number;
    }
  | {
      type: Operations.ROTATE_POSITION;
      x: string;
    }
  | {
      type: Operations.REVERSE;
      i: number;
      j: number;
    }
  | {
      type: Operations.MOVE;
      i: number;
      j: number;
    };

enum Operations {
  SWAP_POSITION = "swap position",
  SWAP_LETTER = "swap letter",
  ROTATE_LEFT = "rotate left",
  ROTATE_RIGHT = "rotate right",
  ROTATE_POSITION = "rotate based",
  REVERSE = "reverse positions",
  MOVE = "move position",
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/21/day.21.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseOperation);
}

function parseOperation(value: string): Operation {
  const parts = value.split(" ");

  const type = (parts[0] + " " + parts[1]) as Operations;

  switch (type) {
    case Operations.SWAP_POSITION:
    case Operations.MOVE: {
      return {
        type,
        i: Number(parts[2]),
        j: Number(parts[5]),
      };
    }

    case Operations.SWAP_LETTER: {
      return {
        type,
        x: parts[2],
        y: parts[5],
      };
    }

    case Operations.ROTATE_LEFT:
    case Operations.ROTATE_RIGHT: {
      return {
        type,
        n: Number(parts[2]),
      };
    }

    case Operations.ROTATE_POSITION: {
      return {
        type,
        x: parts[6],
      };
    }

    case Operations.REVERSE: {
      return {
        type,
        i: Number(parts[2]),
        j: Number(parts[4]),
      };
    }
  }
}

export function part1() {
  const operations = parseInput();

  const password = "abcdefgh".split("");

  for (const operation of operations) {
    switch (operation.type) {
      case Operations.SWAP_POSITION: {
        swapPosition(password, operation.i, operation.j);
        break;
      }

      case Operations.SWAP_LETTER: {
        swapLetter(password, operation.x, operation.y);
        break;
      }

      case Operations.ROTATE_LEFT: {
        rotateLeft(password, operation.n);
        break;
      }

      case Operations.ROTATE_RIGHT: {
        rotateRight(password, operation.n);
        break;
      }

      case Operations.ROTATE_POSITION: {
        rotatePosition(password, operation.x);
        break;
      }

      case Operations.REVERSE: {
        reverse(password, operation.i, operation.j);
        break;
      }

      case Operations.MOVE: {
        move(password, operation.i, operation.j);
        break;
      }
    }
  }

  return password.join("");
}

export function part2() {
  const operations = parseInput();

  const password = "fbgdceah".split("");

  for (const operation of operations.reverse()) {
    switch (operation.type) {
      case Operations.SWAP_POSITION: {
        swapPosition(password, operation.i, operation.j);
        break;
      }

      case Operations.SWAP_LETTER: {
        swapLetter(password, operation.x, operation.y);
        break;
      }

      case Operations.ROTATE_LEFT: {
        rotateRight(password, operation.n);
        break;
      }

      case Operations.ROTATE_RIGHT: {
        rotateLeft(password, operation.n);
        break;
      }

      case Operations.ROTATE_POSITION: {
        for (let n = 0; n < password.length; n++) {
          const password_ = clone(password);

          rotateLeft(password_, n);
          rotatePosition(password_, operation.x);

          if (password_.join("") === password.join("")) {
            rotateLeft(password, n);
            break;
          }
        }

        break;
      }

      case Operations.REVERSE: {
        reverse(password, operation.i, operation.j);
        break;
      }

      case Operations.MOVE: {
        move(password, operation.j, operation.i);
        break;
      }
    }
  }

  return password.join("");
}

function swapPosition(password: string[], i: number, j: number) {
  const letter = password[i];

  password[i] = password[j];
  password[j] = letter;
}

function swapLetter(password: string[], x: string, y: string) {
  const i = password.findIndex((letter) => letter === x);
  const j = password.findIndex((letter) => letter === y);

  swapPosition(password, i, j);
}

function rotateLeft(password: string[], n: number) {
  for (let n_ = 0; n_ < n; n_++) {
    password.push(password.shift()!);
  }
}

function rotateRight(password: string[], n: number) {
  for (let n_ = 0; n_ < n; n_++) {
    password.unshift(password.pop()!);
  }
}

function rotatePosition(password: string[], x: string) {
  let n = password.findIndex((letter) => letter === x);

  if (n > 3) {
    n++;
  }

  n++;

  rotateRight(password, n);
}

function reverse(password: string[], i: number, j: number) {
  const i_ = Math.min(i, j);
  const j_ = Math.max(i, j);

  for (let n = 0; n < (j_ - i_) / 2; n++) {
    swapPosition(password, i_ + n, j_ - n);
  }
}

function move(password: string[], i: number, j: number) {
  const [letter] = password.splice(i, 1);

  password.splice(j, 0, letter);
}
