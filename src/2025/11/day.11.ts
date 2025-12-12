import fs from "fs";

import { topologicalSort } from "@/utils/graph";

type Device = [string, string[]];

function parseInput() {
  const inputLookup = fs
    .readFileSync("src/inputs/2025/11/day.11.input.txt")
    .toString()
    .trim()
    .split("\n")
    .map(parseDevice)
    .flatMap(([name, outputs]) => outputs.map((output) => [output, name]))
    .reduce((lookup, [output, name]) => {
      if (!lookup.has(output)) {
        lookup.set(output, []);
      }

      lookup.get(output)!.push(name);

      return lookup;
    }, new Map<string, string[]>());

  const devices = topologicalSort(inputLookup);

  return {
    devices,
    inputLookup,
  };
}

function parseDevice(value: string): Device {
  const [name, outputs] = value.split(": ");

  return [name, outputs.split(" ")];
}

export function part1() {
  const { devices, inputLookup } = parseInput();

  return getPathCount(devices, inputLookup, "you", "out");
}

export function part2() {
  const { devices, inputLookup } = parseInput();

  const milestones = ["svr", "dac", "fft", "out"].sort(
    (x, y) => devices.indexOf(x) - devices.indexOf(y)
  );

  let count = 1;

  for (let i = 0; i < milestones.length - 1; i++) {
    count *= getPathCount(
      devices,
      inputLookup,
      milestones[i],
      milestones[i + 1]
    );
  }

  return count;
}

function getPathCount(
  devices: string[],
  inputLookup: Map<string, string[]>,
  source: string,
  target: string
) {
  const sourceIndex = devices.findIndex((x) => x === source);
  const targetIndex = devices.findIndex((x) => x === target);

  const countLookup = new Map<string, number>([[source, 1]]);

  for (const device of devices.slice(sourceIndex + 1, targetIndex + 1)) {
    let count = 0;

    for (const input of inputLookup.get(device)!) {
      count += countLookup.get(input) ?? 0;
    }

    countLookup.set(device, count);
  }

  return countLookup.get(target)!;
}
