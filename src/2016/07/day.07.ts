import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/07/day.07.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x);
}

export function part1() {
  return getSupportCount(supportsTLS);
}

export function part2() {
  return getSupportCount(supportsSSL);
}

function getSupportCount(supports: (ip: string) => boolean) {
  const ips = parseInput();

  return ips.map((x) => (supports(x) ? 1 : 0)).sum();
}

function supportsTLS(ip: string) {
  let result = false;

  let bracket = false;

  for (let i = 0; i < ip.length - 3; i++) {
    if (ip[i] === "[") {
      bracket = true;
    } else if (ip[i] === "]") {
      bracket = false;
    } else {
      const sequence = ip.slice(i, i + 4);

      if (
        sequence[0] === sequence[3] &&
        sequence[1] === sequence[2] &&
        sequence[0] !== sequence[1]
      ) {
        if (bracket) {
          return false;
        }

        result = true;
      }
    }
  }

  return result;
}

function supportsSSL(ip: string) {
  const abaLookup = new Set<string>();
  const babLookup = new Set<string>();

  let bracket = false;

  for (let i = 0; i < ip.length - 2; i++) {
    if (ip[i] === "[") {
      bracket = true;
    } else if (ip[i] === "]") {
      bracket = false;
    } else {
      const sequence = ip.slice(i, i + 3);

      if (sequence[0] === sequence[2] && sequence[0] !== sequence[1]) {
        const inverseSequence = sequence[1] + sequence[0] + sequence[1];

        if (bracket) {
          babLookup.add(sequence);

          if (abaLookup.has(inverseSequence)) {
            return true;
          }
        } else {
          abaLookup.add(sequence);

          if (babLookup.has(inverseSequence)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
