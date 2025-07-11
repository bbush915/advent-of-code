import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/04/day.04.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" "));
}

export function part1() {
  return getValidCount(isDuplicate);
}

export function part2() {
  return getValidCount(isAnagram);
}

function getValidCount(
  predicate: (passphrase: string[], i: number, j: number) => boolean
) {
  const passphrases = parseInput();

  return passphrases
    .map((passphrase) => {
      for (let i = 0; i < passphrase.length; i++) {
        for (let j = i + 1; j < passphrase.length; j++) {
          if (predicate(passphrase, i, j)) {
            return 0;
          }
        }
      }

      return 1;
    })
    .sum();
}

function isDuplicate(passphrase: string[], i: number, j: number) {
  return passphrase[i] === passphrase[j];
}

function isAnagram(passphrase: string[], i: number, j: number) {
  return (
    passphrase[i].split("").sort().join() ===
    passphrase[j].split("").sort().join()
  );
}
