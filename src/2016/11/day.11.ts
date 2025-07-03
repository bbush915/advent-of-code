import fs from "fs";

import "@/utils/array";
import { toKey } from "@/utils/common";
import { DefaultGetDistance, search } from "@/utils/graph";

type State = number[];

const MIN_FLOOR = 0;
const MAX_FLOOR = 3;

function parseInput() {
  const lines = fs
    .readFileSync("src/inputs/2016/11/day.11.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x);

  const state: State = [0];

  const elementLookup = new Map<string, [number, number]>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const generatorElements = [
      ...line.matchAll(/(?<element>\w+) generator/g),
    ].map((x) => x[1]);

    for (const element of generatorElements) {
      const floors = elementLookup.get(element);

      if (floors) {
        floors[0] = i;
      } else {
        elementLookup.set(element, [i, -1]);
      }
    }

    const microchipElements = [
      ...line.matchAll(/(?<element>\w+)-compatible microchip/g),
    ].map((x) => x[1]);

    for (const element of microchipElements) {
      const floors = elementLookup.get(element);

      if (floors) {
        floors[1] = i;
      } else {
        elementLookup.set(element, [-1, i]);
      }
    }
  }

  const elements = [...elementLookup.keys()].sort();

  for (const element of elements) {
    const [generator, microchip] = elementLookup.get(element)!;

    state.push(generator, microchip);
  }

  return state;
}

export function part1() {
  const state = parseInput();

  return getMinimumSteps(state);
}

export function part2() {
  const state = parseInput();

  return getMinimumSteps([...state, 0, 0, 0, 0]);
}

function getMinimumSteps(state: State) {
  const source = toKey(state);
  const target = toKey(new Array(state.length).fill(MAX_FLOOR));

  const { distanceLookup } = search(
    getNeighbors,
    source,
    target,
    DefaultGetDistance,
    (key) =>
      fromKey(key)
        .map((x) => MAX_FLOOR - x)
        .sum()
  );

  return distanceLookup.get(target);
}

function getNeighbors(key: string) {
  const state = fromKey(key);

  const states: State[] = [];

  // NOTE - Move one item.

  for (let i = 1; i < state.length; i++) {
    if (state[i] !== state[0]) {
      continue;
    }

    states.push(move(state, [0, i], 1), move(state, [0, i], -1));
  }

  // NOTE - Move two items.

  for (let i = 1; i < state.length; i++) {
    for (let j = i + 1; j < state.length; j++) {
      if (state[i] !== state[0] || state[j] !== state[0]) {
        continue;
      }

      states.push(move(state, [0, i, j], 1), move(state, [0, i, j], -1));
    }
  }

  return states.filter(isValid).map((x) => toKey(x));
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}

function move(state: State, components: number[], floors: number) {
  const state_ = [...state];

  for (const component of components) {
    state_[component] += floors;
  }

  return state_;
}

function isValid(state: State) {
  // NOTE - Elevator must be on a valid floor.

  if (state[0] < MIN_FLOOR || state[0] > MAX_FLOOR) {
    return false;
  }

  // NOTE - If a microchip is not connected to its generator, there cannot be
  // another generator on the same floor.

  for (let i = 1; i < state.length; i += 2) {
    if (state[i] === state[i + 1]) {
      continue;
    }

    for (let j = 1; j < state.length; j += 2) {
      if (state[i + 1] === state[j]) {
        return false;
      }
    }
  }

  return true;
}
