import fs from "fs";

type Context = {
  workers: Worker[];
  time: number;
  remaining: string[];
  available: string[];
  completed: string[];
  prerequisiteLookup: Map<string, string[]>;
};

type Worker = {
  step: string | null;
  time: number | null;
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2018/07/day.07.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" ");

      return [parts[1], parts[7]];
    })
    .reduce((lookup, [step, prerequisite]) => {
      if (!lookup.has(prerequisite)) {
        lookup.set(prerequisite, []);
      }

      if (!lookup.has(step)) {
        lookup.set(step, []);
      }

      lookup.get(prerequisite)!.push(step);

      return lookup;
    }, new Map<string, string[]>());
}

export function part1() {
  const [order] = getInstructionSteps(1);
  return order;
}

export function part2() {
  const [, time] = getInstructionSteps(5);
  return time;
}

function getInstructionSteps(workers: number, delay: number = 60) {
  const prerequisiteLookup = parseInput();

  const context: Context = {
    workers: new Array(workers)
      .fill(null)
      .map(() => ({ step: null, time: null })),
    time: 0,
    remaining: [...prerequisiteLookup.keys()],
    available: [],
    completed: [],
    prerequisiteLookup,
  };

  loop: while (1) {
    for (const worker of context.workers) {
      if (worker.time === context.time) {
        context.completed.push(worker.step!);

        worker.step = null;
        worker.time = null;

        if (!context.remaining.length) {
          break loop;
        }
      }
    }

    updateAvailableSteps(context);

    let time = Number.POSITIVE_INFINITY;

    for (const worker of context.workers) {
      if (!worker.step && context.available.length) {
        const step = context.available.shift()!;

        worker.step = step;
        worker.time = context.time + delay + (step.charCodeAt(0) - 64);
      }

      time = Math.min(worker.time ?? Number.POSITIVE_INFINITY, time);
    }

    context.time = time;
  }

  return [context.completed.join(""), context.time];
}

function updateAvailableSteps({
  remaining,
  available,
  completed,
  prerequisiteLookup,
}: Context) {
  for (let i = remaining.length - 1; i >= 0; i--) {
    const step = remaining[i];

    const prerequisites = prerequisiteLookup.get(step)!;

    let satisfied = true;

    for (const prerequisite of prerequisites) {
      if (!completed.includes(prerequisite)) {
        satisfied = false;
      }
    }

    if (satisfied) {
      available.push(...remaining.splice(i, 1));
    }
  }

  available.sort();
}
