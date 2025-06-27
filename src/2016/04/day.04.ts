import fs from "fs";

import "@/utils/array";

type Room = {
  name: string[];
  sector: number;
  checksum: string;
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/04/day.04.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseRoom);
}

function parseRoom(value: string): Room {
  const name = [...value.matchAll(/([a-z]+)-/g)].flatMap((x) => x[1].split(""));
  const sector = Number(value.match(/\d+/)![0]);
  const checksum = [...value.matchAll(/\[([a-z]{5})\]/g)][0][1];

  return {
    name,
    sector,
    checksum,
  };
}

export function part1() {
  const rooms = parseInput();

  return rooms.map((room) => (isDecoy(room) ? 0 : room.sector)).sum();
}

export function part2() {
  const rooms = parseInput();

  for (const room of rooms) {
    const name = decrypt(room);

    if (name === "northpoleobjectstorage") {
      return room.sector;
    }
  }
}

function isDecoy(room: Room) {
  const checksum = [
    ...room.name
      .reduce(
        (lookup, letter) => lookup.set(letter, (lookup.get(letter) ?? 0) + 1),
        new Map<string, number>()
      )
      .entries(),
  ]
    .sort((x, y) => {
      if (x[1] === y[1]) {
        return x[0].localeCompare(y[0]);
      }

      return y[1] - x[1];
    })
    .slice(0, 5)
    .map((x) => x[0])
    .join("");

  return checksum !== room.checksum;
}

function decrypt(room: Room) {
  return room.name
    .map((x) =>
      String.fromCharCode(((x.charCodeAt(0) - 97 + room.sector) % 26) + 97)
    )
    .join("");
}
