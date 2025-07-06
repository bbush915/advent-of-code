import fs from "fs";

type Elf = {
  id: number;
  next: Elf;
  prev: Elf;
};

function parseInput() {
  const count = Number(
    fs.readFileSync("src/inputs/2016/19/day.19.input.txt").toString().trim()
  );

  const head: Elf = {
    id: 1,
    next: null as unknown as Elf,
    prev: null as unknown as Elf,
  };

  let tail = head;

  for (let i = 1; i < count; i++) {
    tail.next = {
      id: i + 1,
      next: null as unknown as Elf,
      prev: tail,
    };

    tail = tail.next;
  }

  tail.next = head;
  head.prev = tail;

  return {
    elf: head,
    count,
  };
}

export function part1() {
  let { elf } = parseInput();

  let target = elf.next;

  while (target !== elf) {
    target.prev.next = target.next;
    target.next.prev = target.prev;

    elf = elf.next;
    target = target.next.next;
  }

  return elf.id;
}

export function part2() {
  let { elf, count } = parseInput();

  let target = elf;

  for (let i = 0; i < Math.floor(count / 2); i++) {
    target = target.next;
  }

  while (target !== elf) {
    target.prev.next = target.next;
    target.next.prev = target.prev;

    elf = elf.next;
    count--;

    if (count % 2) {
      target = target.next;
    } else {
      target = target.next.next;
    }
  }

  return elf.id;
}
