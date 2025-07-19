import fs from "fs";

import "@/utils/array";

type Bridge = {
  i: number;
  port: number;
}[];

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/24/day.24.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x, i) => [i, ...x.split("/").map(Number)]);
}

export function part1() {
  const components = parseInput();
  const [maxOverallStrength] = analyze(components);

  return maxOverallStrength;
}

export function part2() {
  const components = parseInput();
  const [, maxLongestStrength] = analyze(components);

  return maxLongestStrength;
}

function analyze(components: number[][]) {
  let maxOverallStrength = 0;
  let longestBridge: Bridge | null = null;

  const bridges: Bridge[] = components
    .filter(([, ...ports]) => ports.includes(0))
    .map(([i]) => [{ i, port: 0 }]);

  while (bridges.length) {
    const bridge = bridges.pop()!;

    const strength = getStrength(components, bridge);

    if (strength > maxOverallStrength) {
      maxOverallStrength = strength;
    }

    if (
      bridge.length > (longestBridge?.length ?? 0) ||
      (bridge.length === longestBridge!.length &&
        getStrength(components, bridge) >
          getStrength(components, longestBridge!))
    ) {
      longestBridge = bridge;
    }

    const extensions = getExtensions(components, bridge);

    if (!extensions.length) {
      continue;
    }

    bridges.push(...extensions.map((extension) => [...bridge, extension]));
  }

  return [maxOverallStrength, getStrength(components, longestBridge!)];
}

function getStrength(components: number[][], bridge: Bridge) {
  return bridge.flatMap(({ i }) => components[i].slice(1)).sum();
}

function getExtensions(components: number[][], bridge: Bridge) {
  const last = bridge.at(-1)!;

  const port =
    last.port === components[last.i][1]
      ? components[last.i][2]
      : components[last.i][1];

  return components
    .filter(
      ([i, ...ports]) =>
        !bridge.find((component) => component.i === i) && ports.includes(port)
    )
    .map(([i]) => ({ i, port }));
}
