import crypto from "crypto";
import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/05/day.05.input.txt")
    .toString()
    .trim();
}

export function part1() {
  const door = parseInput();

  let password = "";
  let index = -1;

  while (password.length < 8) {
    const { index: index_, hash } = discover(door, index + 1)!;

    password += hash[5];
    index = index_;
  }

  return password;
}

export function part2() {
  const door = parseInput();

  let password = "________";
  let index = -1;

  while (password.includes("_")) {
    const { index: index_, hash } = discover(door, index + 1)!;

    const position = parseInt(hash[5], 16);

    if (password[position] === "_") {
      password =
        password.slice(0, position) + hash[6] + password.slice(position + 1);
    }

    index = index_;
  }

  return password;
}

function discover(key: string, index: number) {
  const prefix = "0".repeat(5);

  let i = index;

  while (1) {
    const hash = crypto.createHash("md5").update(`${key}${i}`).digest("hex");

    if (hash.startsWith(prefix)) {
      return {
        index: i,
        hash,
      };
    }

    i++;
  }
}
