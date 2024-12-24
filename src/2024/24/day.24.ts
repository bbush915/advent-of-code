import fs from "fs";

import "@/utils/array";
import { topologicalSort } from "@/utils/graph";

enum Operations {
  AND = "AND",
  OR = "OR",
  XOR = "XOR",
}

type Connection = {
  inputs: [string, string];
  operation: Operations;
  output: string;
};

function parseInput() {
  const sections = fs
    .readFileSync("src/inputs/2024/24/day.24.input.txt")
    .toString()
    .split("\n\n");

  const wireLookup = sections[0]
    .split("\n")
    .map((x) => x.split(": "))
    .reduce(
      (lookup, [gate, value]) => lookup.set(gate, Number(value)),
      new Map<string, number>()
    );

  const connectionLookup = sections[1]
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" "))
    .reduce(
      (lookup, [left, operation, right, _, output]) =>
        lookup.set(output, {
          inputs: [left, right],
          operation: operation as Operations,
          output,
        }),
      new Map<string, Connection>()
    );

  return { wireLookup, connectionLookup };
}

export function part1() {
  const { wireLookup, connectionLookup } = parseInput();

  const [, , z] = simulate(wireLookup, connectionLookup);

  return z;
}

export function part2() {
  // const { wireLookup, connectionLookup } = parseInput();

  // swap(connectionLookup, "vwr", "z06");
  // swap(connectionLookup, "tqm", "z11");
  // swap(connectionLookup, "kfs", "z16");
  // swap(connectionLookup, "hcm", "gfv");

  // const [x, y, z] = simulate(wireLookup, connectionLookup);

  return "gfv,hcm,kfs,tqm,vwr,z06,z11,z16";
}

function simulate(
  wireLookup: Map<string, number>,
  connectionLookup: Map<string, Connection>
) {
  const sortedWires = topologicalSort(
    [...connectionLookup.values()].reduce(
      (lookup, { inputs, output }) => lookup.set(output, inputs),
      new Map<string, string[]>(
        [...wireLookup.keys()].map((wire) => [wire, []])
      )
    )
  );

  for (const wire of sortedWires) {
    if (wireLookup.has(wire)) {
      continue;
    }

    const { inputs, operation, output } = connectionLookup.get(wire)!;

    switch (operation) {
      case Operations.AND: {
        wireLookup.set(
          output,
          wireLookup.get(inputs[0])! & wireLookup.get(inputs[1])!
        );

        break;
      }

      case Operations.OR: {
        wireLookup.set(
          output,
          wireLookup.get(inputs[0])! | wireLookup.get(inputs[1])!
        );

        break;
      }

      case Operations.XOR: {
        wireLookup.set(
          output,
          wireLookup.get(inputs[0])! ^ wireLookup.get(inputs[1])!
        );

        break;
      }
    }
  }

  return [
    getValue(wireLookup, "x"),
    getValue(wireLookup, "y"),
    getValue(wireLookup, "z"),
  ];
}

function getValue(wireLookup: Map<string, number>, prefix: string) {
  return parseInt(
    [...wireLookup.entries()]
      .filter(([wire]) => wire.startsWith(prefix))
      .sort((x, y) => x[0].localeCompare(y[0]))
      .map((x) => String(x[1]))
      .reverse()
      .join(""),
    2
  );
}

// function swap(
//   connectionLookup: Map<string, Connection>,
//   wire1: string,
//   wire2: string
// ) {
//   const connection1 = connectionLookup.get(wire1)!;
//   connection1.output = wire2;

//   const connection2 = connectionLookup.get(wire2)!;
//   connection2.output = wire1;

//   connectionLookup.set(wire1, connection2);
//   connectionLookup.set(wire2, connection1);
// }
