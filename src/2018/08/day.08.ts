import fs from "fs";

import "@/utils/array";

type Node = {
  children: Node[];
  metadata: number[];
};

function parseInput() {
  const values = fs
    .readFileSync("src/inputs/2018/08/day.08.input.txt")
    .toString()
    .trim()
    .split(" ")
    .map(Number);

  return makeTree(values, 0)[0];
}

function makeTree(values: number[], index: number): [Node, number] {
  const node: Node = {
    children: [],
    metadata: [],
  };

  const childCount = values[index++];
  const metadataCount = values[index++];

  for (let n = 0; n < childCount; n++) {
    const [child, index_] = makeTree(values, index);

    node.children.push(child);
    index = index_;
  }

  node.metadata.push(...values.slice(index, index + metadataCount));

  return [node, index + metadataCount];
}

export function part1() {
  const tree = parseInput();

  return getValue1(tree);
}

export function part2() {
  const tree = parseInput();

  return getValue2(tree);
}

function getValue1(node: Node) {
  let value = node.metadata.sum();

  for (const child of node.children) {
    value += getValue1(child);
  }

  return value;
}

function getValue2(node: Node | undefined) {
  if (!node) {
    return 0;
  }

  if (!node.children.length) {
    return node.metadata.sum();
  }

  let value = 0;

  for (const entry of node.metadata) {
    value += getValue2(node.children[entry - 1]);
  }

  return value;
}
