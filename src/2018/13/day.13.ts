import fs from "fs";

enum Paths {
  HORIZONTAL = "-",
  VERTICAL = "|",
  CURVE_1 = "/",
  CURVE_2 = "\\",
  INTERSECTION = "+",
}

type Cart = {
  n: number;
  i: number;
  j: number;
  direction: Directions;
  turn: Turns;
  crashed: boolean;
};

enum Directions {
  LEFT,
  UP,
  RIGHT,
  DOWN,
}

enum Turns {
  LEFT,
  STRAIGHT,
  RIGHT,
}

const DIRECTION_MAP = {
  ["<"]: Directions.LEFT,
  ["^"]: Directions.UP,
  [">"]: Directions.RIGHT,
  ["v"]: Directions.DOWN,
};

const DIRECTION_OFFSET_MAP = {
  [Directions.LEFT]: [0, -1],
  [Directions.UP]: [-1, 0],
  [Directions.RIGHT]: [0, 1],
  [Directions.DOWN]: [1, 0],
};

const CURVE_1_MAP = {
  [Directions.LEFT]: Directions.DOWN,
  [Directions.UP]: Directions.RIGHT,
  [Directions.RIGHT]: Directions.UP,
  [Directions.DOWN]: Directions.LEFT,
};

const CURVE_2_MAP = {
  [Directions.LEFT]: Directions.UP,
  [Directions.UP]: Directions.LEFT,
  [Directions.RIGHT]: Directions.DOWN,
  [Directions.DOWN]: Directions.RIGHT,
};

function parseInput() {
  const tracks = fs
    .readFileSync("src/inputs/2018/13/day.13.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));

  const carts: Cart[] = [];

  let n = 1;

  for (let i = 0; i < tracks.length; i++) {
    for (let j = 0; j < tracks[i].length; j++) {
      if (!["<", "^", ">", "v"].includes(tracks[i][j])) {
        continue;
      }

      const direction =
        DIRECTION_MAP[tracks[i][j] as keyof typeof DIRECTION_MAP];

      carts.push({
        n,
        i,
        j,
        direction,
        turn: Turns.LEFT,
        crashed: false,
      });

      n++;

      tracks[i][j] = [Directions.LEFT, Directions.RIGHT].includes(direction)
        ? Paths.HORIZONTAL
        : Paths.VERTICAL;
    }
  }

  return {
    tracks,
    carts,
  };
}

export function part1() {
  return simulate(haltAfterOneCollision, false);
}

export function part2() {
  return simulate(haltAfterAllCollisions, true);
}

function simulate(
  handleCollision: (carts: Cart[], cart: Cart) => [boolean, Cart | null],
  completeTick: boolean
) {
  const { tracks, carts } = parseInput();

  let stop = false;
  let result: Cart | null = null;

  while (!stop) {
    carts.sort(cartComparator);

    for (const cart of carts) {
      if (cart.crashed) {
        continue;
      }

      const [di, dj] = DIRECTION_OFFSET_MAP[cart.direction];

      cart.i += di;
      cart.j += dj;

      [stop, result] = handleCollision(carts, cart);

      if (stop && !completeTick) {
        break;
      }

      switch (tracks[cart.i][cart.j]) {
        case Paths.CURVE_1: {
          cart.direction = CURVE_1_MAP[cart.direction];
          break;
        }

        case Paths.CURVE_2: {
          cart.direction = CURVE_2_MAP[cart.direction];
          break;
        }

        case Paths.INTERSECTION: {
          switch (cart.turn) {
            case Turns.LEFT: {
              cart.direction = (cart.direction + 3) % 4;
              break;
            }

            case Turns.STRAIGHT: {
              break;
            }

            case Turns.RIGHT: {
              cart.direction = (cart.direction + 1) % 4;
              break;
            }
          }

          cart.turn = (cart.turn + 1) % 3;

          break;
        }
      }
    }
  }

  return `${result!.j},${result!.i}`;
}

function haltAfterOneCollision(
  carts: Cart[],
  cart: Cart
): [boolean, Cart | null] {
  const collision = carts.find(
    (x) => x.n !== cart.n && x.i === cart.i && x.j === cart.j && !x.crashed
  );

  return collision ? [true, cart] : [false, null];
}

function haltAfterAllCollisions(
  carts: Cart[],
  cart: Cart
): [boolean, Cart | null] {
  const collision = carts.find(
    (x) => x.n !== cart.n && x.i === cart.i && x.j === cart.j && !x.crashed
  );

  if (collision) {
    cart.crashed = true;
    collision.crashed = true;

    const survivors = carts.filter((x) => !x.crashed);

    if (survivors.length === 1) {
      return [true, survivors[0]];
    }
  }

  return [false, null];
}

function cartComparator(x: Cart, y: Cart) {
  return x.i === y.i ? x.j - y.j : x.i - y.i;
}
