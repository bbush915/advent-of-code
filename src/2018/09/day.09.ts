import fs from "fs";

import "@/utils/array";

type Node = {
  value: number;
  next: Node;
  prev: Node;
};

function parseInput() {
  const parts = fs
    .readFileSync("src/inputs/2018/09/day.09.input.txt")
    .toString()
    .trim()
    .split(" ");

  return {
    players: Number(parts[0]),
    limit: Number(parts[6]),
  };
}

export function part1() {
  const { players, limit } = parseInput();

  return getWinningScore(players, limit);
}

export function part2() {
  const { players, limit } = parseInput();

  return getWinningScore(players, limit * 100);
}

function getWinningScore(players: number, limit: number) {
  const scores = new Array(players).fill(0);

  let node = makeNode(0);

  node.next = node;
  node.prev = node;

  for (let n = 1; n < limit; n++) {
    if (n % 23) {
      const cw1 = node.next;
      const cw2 = node.next.next;

      let node_ = makeNode(n);

      node_.prev = cw1;
      cw1.next = node_;

      node_.next = cw2;
      cw2.prev = node_;

      node = node_;
    } else {
      const player = (n - 1) % players;

      let remove = node;

      for (let i = 0; i < 7; i++) {
        remove = remove.prev;
      }

      remove.prev.next = remove.next;
      remove.next.prev = remove.prev;

      scores[player] += n + remove.value;

      node = remove.next;
    }
  }

  return scores.max();
}

function makeNode(value: number): Node {
  return {
    value,
    next: null!,
    prev: null!,
  };
}
