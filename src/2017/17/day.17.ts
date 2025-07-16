import fs from "fs";

type Node = {
  next: Node | null;
  value: number;
};

function parseInput() {
  return Number(
    fs.readFileSync("src/inputs/2017/17/day.17.input.txt").toString().trim()
  );
}

export function part1() {
  const steps = parseInput();

  const buffer = [0];
  let position = 0;

  for (let n = 0; n < 2017; n++) {
    position = (position + steps) % buffer.length;
    buffer.splice(position + 1, 0, n + 1);
    position = (position + 1) % buffer.length;
  }

  return buffer[(position + 1) % buffer.length];
}

export function part2() {
  const steps = parseInput();

  const zero: Node = {
    next: null,
    value: 0,
  };

  zero.next = zero;

  let node = zero;

  for (let n = 1; n < 50_000_000; n++) {
    for (let m = 0; m < steps; m++) {
      node = node.next!;
    }

    const node_: Node = {
      next: node.next!,
      value: n,
    };

    node.next = node_;

    node = node_;
  }

  return zero.next.value;
}
