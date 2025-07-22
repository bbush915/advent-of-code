import fs from "fs";

import "@/utils/array";

type Unit = {
  type: string;
  next: Unit | null;
  prev: Unit | null;
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2018/05/day.05.input.txt")
    .toString()
    .trim();
}

export function part1() {
  const polymer = parseInput();

  return react(polymer);
}

export function part2() {
  const polymer = parseInput();

  return "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map((type) =>
      react(
        polymer.replaceAll(new RegExp(`${type}|${type.toUpperCase()}`, "g"), "")
      )
    )
    .min();
}

function react(polymer: string) {
  const { head, length } = toList(polymer);

  let unit: Unit | null = head;
  let reactions = 0;

  while (unit?.next) {
    if (opposite(unit.type, unit.next.type)) {
      if (unit.prev) {
        unit.prev.next = unit.next.next;
      }

      if (unit.next.next) {
        unit.next.next.prev = unit.prev;
      }

      if (unit.prev) {
        unit = unit.prev;
      } else {
        unit = unit.next.next;
      }

      reactions++;
    } else {
      unit = unit.next;
    }
  }

  return length - reactions * 2;
}

function toList(polymer: string) {
  let head: Unit = {
    type: polymer[0],
    next: null,
    prev: null,
  };

  let prev = head;

  for (let n = 1; n < polymer.length; n++) {
    const unit: Unit = {
      type: polymer[n],
      prev,
      next: null,
    };

    prev.next = unit;
    prev = unit;
  }

  return { head, length: polymer.length };
}

function opposite(x: string, y: string) {
  return Math.abs(x.charCodeAt(0) - y.charCodeAt(0)) === 32;
}
