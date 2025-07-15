import fs from "fs";

type Layer = {
  depth: number;
  range: number;
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/13/day.13.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseLayer);
}

function parseLayer(value: string): Layer {
  const parts = value.split(": ");

  return {
    depth: Number(parts[0]),
    range: Number(parts[1]),
  };
}

export function part1() {
  const layers = parseInput();

  return getSeverity(layers, 0)[1];
}

export function part2() {
  const layers = parseInput();

  let n = 0;

  while (getSeverity(layers, n)[0]) {
    n++;
  }

  return n;
}

function getSeverity(layers: Layer[], delay: number) {
  let caught = false;
  let severity = 0;

  for (const layer of layers) {
    if (!getScannerPosition(layer.range, delay + layer.depth)) {
      severity += layer.depth * layer.range;
      caught = true;
    }
  }

  return [caught, severity];
}

function getScannerPosition(range: number, t: number) {
  const offset = t % (2 * range - 2);

  return offset < range ? offset : 2 * range - offset - 2;
}
