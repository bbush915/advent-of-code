import fs from "fs";

type Context = {
  index: number;
  limit: number;
  diagnostic: Set<number>;
  state: string;
  stateLookup: Map<string, State>;
};

type State = {
  id: string;
  [0]: Branch;
  [1]: Branch;
};

type Branch = {
  value: number;
  direction: Directions;
  next: string;
};

enum Directions {
  LEFT = -1,
  RIGHT = 1,
}

function parseInput(): Context {
  const sections = fs
    .readFileSync("src/inputs/2017/25/day.25.input.txt")
    .toString()
    .split("\n\n");

  const lines = sections[0].split("\n");

  return {
    index: 0,
    limit: Number(lines[1].split(" ")[5]),
    diagnostic: new Set<number>(),
    state: lines[0].at(-2)!,
    stateLookup: sections.slice(1).reduce((lookup, section) => {
      const state = parseState(section);
      return lookup.set(state.id, state);
    }, new Map<string, State>()),
  };
}

function parseState(value: string): State {
  const lines = value.split("\n");

  return {
    id: lines[0].at(-2)!,
    [0]: {
      value: Number(lines[2].at(-2)!),
      direction:
        lines[3].split(" ").at(-1) === "left."
          ? Directions.LEFT
          : Directions.RIGHT,
      next: lines[4].at(-2)!,
    },
    [1]: {
      value: Number(lines[6].at(-2)!),
      direction:
        lines[7].split(" ").at(-1) === "left."
          ? Directions.LEFT
          : Directions.RIGHT,
      next: lines[8].at(-2)!,
    },
  };
}

export function part1() {
  const context = parseInput();

  for (let n = 0; n < context.limit; n++) {
    const state = context.stateLookup.get(context.state)!;

    const value = context.diagnostic.has(context.index) ? 1 : 0;
    const branch = state[value];

    if (branch.value) {
      context.diagnostic.add(context.index);
    } else {
      context.diagnostic.delete(context.index);
    }

    context.index += branch.direction;
    context.state = branch.next;
  }

  return context.diagnostic.size;
}

export function part2() {
  return "Merry Christmas!";
}
