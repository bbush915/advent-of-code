import fs from "fs";

import "@/utils/array";
import { toKey } from "@/utils/common";
import { search } from "@/utils/graph";

enum Cells {
  WALL = "#",
  CAVERN = ".",
  ELF = "E",
  GOBLIN = "G",
}

type Unit = {
  type: UnitTypes;
  i: number;
  j: number;
  hitPoints: number;
  attack: number;
};

type UnitTypes = Cells.ELF | Cells.GOBLIN;

type Evaluation = {
  distance: number;
  move: {
    i: number;
    j: number;
  };
};

function parseInput() {
  const grid = fs
    .readFileSync("src/inputs/2018/15/day.15.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("") as Cells[]);

  const units: Unit[] = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (![Cells.ELF, Cells.GOBLIN].includes(grid[i][j])) {
        continue;
      }

      const unit: Unit = {
        type: grid[i][j] as UnitTypes,
        i,
        j,
        hitPoints: 200,
        attack: 3,
      };

      units.push(unit);
    }
  }

  return { grid, units };
}

export function part1() {
  const [outcome] = battle(0);

  return outcome;
}

export function part2() {
  let n = 1;

  while (1) {
    const [outcome, units] = battle(n);

    if (
      units.filter((x) => x.type === Cells.ELF).every((x) => x.hitPoints > 0)
    ) {
      return outcome;
    }

    n++;
  }
}

function battle(elfBuff: number): [number, Unit[]] {
  const { grid, units } = parseInput();

  for (const unit of units.filter((x) => x.type === Cells.ELF)) {
    unit.attack += elfBuff;
  }

  let round = 0;

  loop: while (1) {
    units.sort(unitComparator);

    for (const unit of units) {
      if (unit.hitPoints <= 0) {
        continue;
      }

      const targets = units.filter(
        (x) => x.type !== unit.type && x.hitPoints > 0
      );

      if (!targets.length) {
        break loop;
      }

      // NOTE - Move

      if (!isTargetInRange(unit, targets)) {
        const move = targets
          .flatMap(({ i, j }) =>
            [
              [i - 1, j],
              [i, j - 1],
              [i, j + 1],
              [i + 1, j],
            ].filter(([i, j]) => grid[i][j] === Cells.CAVERN)
          )
          .map((cell) => evaluateCell(grid, unit, cell))
          .sort((x, y) => evaluationComparator(x, y))[0]?.move;

        if (move) {
          grid[unit.i][unit.j] = Cells.CAVERN;

          unit.i = move.i;
          unit.j = move.j;

          grid[unit.i][unit.j] = unit.type;
        }
      }

      // NOTE - Attack

      const target = targets
        .filter((target) => manhattan(unit, target) === 1)
        .sort(targetComparator)[0];

      if (!target) {
        continue;
      }

      target.hitPoints -= unit.attack;

      if (target.hitPoints <= 0) {
        grid[target.i][target.j] = Cells.CAVERN;
      }
    }

    round++;
  }

  return [round * units.map((x) => Math.max(x.hitPoints, 0)).sum(), units];
}

function unitComparator(x: Unit, y: Unit) {
  return x.i === y.i ? x.j - y.j : x.i - y.i;
}

function isTargetInRange(unit: Unit, targets: Unit[]) {
  return targets.some((target) => manhattan(unit, target) === 1);
}

function manhattan(x: Unit, y: Unit) {
  return Math.abs(x.i - y.i) + Math.abs(x.j - y.j);
}

function evaluateCell(
  grid: string[][],
  unit: Unit,
  cell: number[]
): Evaluation | null {
  const source = toKey([unit.i, unit.j]);
  const target = toKey(cell);

  const { distanceLookup, predecessorLookup } = search(
    function getNeighbors(key: string) {
      const [i, j] = fromKey(key);

      return [
        [i - 1, j],
        [i, j - 1],
        [i, j + 1],
        [i + 1, j],
      ]
        .filter(([i, j]) => grid[i][j] === Cells.CAVERN)
        .map((cell) => toKey(cell));
    },
    source,
    target
  );

  const distance = distanceLookup.get(target);

  if (distance === undefined) {
    return null;
  }

  const move = getMove(predecessorLookup, source, target);

  return { distance, move };
}

function getMove(
  predecessorLookup: Map<string, Set<string>>,
  source: string,
  target: string
): Evaluation["move"] {
  const moves = new Set<string>();

  const stack = [target];
  const cache = new Set<string>();

  while (stack.length) {
    const cell = stack.pop()!;

    if (cache.has(cell)) {
      continue;
    } else {
      cache.add(cell);
    }

    for (const predecessor of predecessorLookup.get(cell)!) {
      if (predecessor === source) {
        moves.add(cell);
      } else {
        stack.push(predecessor);
      }
    }
  }

  const [i, j] = [...moves.values()]
    .map((x) => fromKey(x))
    .sort(moveComparator)[0];

  return {
    i,
    j,
  };
}

function moveComparator(x: number[], y: number[]) {
  return x[0] === y[0] ? x[1] - y[1] : x[0] - y[0];
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}

function evaluationComparator(x: Evaluation | null, y: Evaluation | null) {
  if (!x && !y) {
    return 0;
  } else if (!x) {
    return 1;
  } else if (!y) {
    return -1;
  }

  if (x.distance === y.distance) {
    return x.move.i === y.move.i ? x.move.j - y.move.j : x.move.i - y.move.i;
  }

  return x.distance - y.distance;
}

function targetComparator(x: Unit, y: Unit) {
  return x.hitPoints === y.hitPoints
    ? unitComparator(x, y)
    : x.hitPoints - y.hitPoints;
}
