import fs from "fs";

import "@/utils/array";
import { topologicalSort } from "@/utils/graph";

type Program = {
  name: string;
  weight: number;
  subtowers: string[];
};

function parseInput() {
  const programs = fs
    .readFileSync("src/inputs/2017/07/day.07.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseProgram);

  const root = topologicalSort(
    programs.reduce(
      (lookup, program) => lookup.set(program.name, program.subtowers),
      new Map<string, string[]>()
    )
  ).at(-1)!;

  const programLookup = programs.reduce(
    (lookup, program) => lookup.set(program.name, program),
    new Map<string, Program>()
  );

  return {
    root,
    programLookup,
  };
}

function parseProgram(value: string): Program {
  const parts = value.split(" -> ");

  const [name, weight] = parts[0].split(" ");

  return {
    name,
    weight: Number(weight.slice(1, -1)),
    subtowers: parts[1]?.split(", ") ?? [],
  };
}

export function part1() {
  const { root } = parseInput();

  return root;
}

export function part2() {
  const { root, programLookup } = parseInput();

  const [, weight] = visit(root, programLookup);

  return weight;
}

function visit(
  name: string,
  programLookup: Map<string, Program>
): [number, number] {
  const { weight, subtowers } = programLookup.get(name)!;

  if (!subtowers.length) {
    return [weight, 0];
  }

  let towerWeight = weight;
  let result = 0;

  const subtowerWeights: [string, number][] = [];

  for (const subtower of subtowers) {
    const [subtowerWeight, subtowerResult] = visit(subtower, programLookup);
    subtowerWeights.push([subtower, subtowerWeight]);

    towerWeight += subtowerWeight;

    if (subtowerResult) {
      result = subtowerResult;
    }
  }

  if (!result) {
    const mode = subtowerWeights.map((x) => x[1]).mode()![0];

    for (const [subtower, weight] of subtowerWeights) {
      if (weight !== mode) {
        result = programLookup.get(subtower)!.weight + (mode - weight);
      }
    }
  }

  return [towerWeight, result];
}
