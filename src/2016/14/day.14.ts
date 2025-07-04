import crypto from "crypto";
import fs from "fs";

import { memoize } from "@/utils/common";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/14/day.14.input.txt")
    .toString()
    .trim();
}

export function part1() {
  return getKey(getHash);
}

export function part2() {
  return getKey(getStretchedHash);
}

function getKey(getHash: (salt: string, index: number) => string) {
  const salt = parseInput();

  let i = 0;
  const keys: string[] = [];

  while (keys.length < 64) {
    const hash = getHash(salt, i);

    const triplet = hash.match(/(.)\1\1/)?.[0];

    if (triplet) {
      const search = triplet[0].repeat(5);

      for (let j = 0; j < 1000; j++) {
        const hash_ = getHash(salt, i + j + 1);

        if (hash_.includes(search)) {
          keys.push(hash);
          break;
        }
      }
    }

    i++;
  }

  return i - 1;
}

const getHash = memoize(function (salt: string, index: number) {
  return crypto.createHash("md5").update(`${salt}${index}`).digest("hex");
});

const getStretchedHash = memoize(function (salt: string, index: number) {
  let hash = crypto.createHash("md5").update(`${salt}${index}`).digest("hex");

  for (let i = 0; i < 2016; i++) {
    hash = crypto.createHash("md5").update(hash).digest("hex");
  }

  return hash;
});
