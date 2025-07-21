import fs from "fs";

type Claim = {
  id: number;
  bounds: number[][];
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2018/03/day.03.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseClaim);
}

function parseClaim(value: string): Claim {
  const parts = value.split(" ");

  const left = Number(parts[2].slice(0, parts[2].indexOf(",")));
  const width = Number(parts[3].split("x")[0]);

  const top = Number(
    parts[2].slice(parts[2].indexOf(",") + 1, parts[2].length - 1)
  );
  const height = Number(parts[3].split("x")[1]);

  return {
    id: Number(parts[0].slice(1)),
    bounds: [
      [top, top + height - 1],
      [left, left + width - 1],
    ],
  };
}

export function part1() {
  const claims = parseInput();

  let count = 0;

  for (let i = 0; i < 1_000; i++) {
    for (let j = 0; j < 1_000; j++) {
      let claimCount = 0;

      for (const claim of claims) {
        if (
          i < claim.bounds[0][0] ||
          i > claim.bounds[0][1] ||
          j < claim.bounds[1][0] ||
          j > claim.bounds[1][1]
        ) {
          continue;
        }

        claimCount++;
      }

      if (claimCount > 1) {
        count++;
      }
    }
  }

  return count;
}

export function part2() {
  const claims = parseInput();

  outer: for (let i = 0; i < claims.length; i++) {
    for (let j = 0; j < claims.length; j++) {
      if (j === i) {
        continue;
      }

      if (claimsOverlap(claims[i], claims[j])) {
        continue outer;
      }
    }

    return claims[i].id;
  }
}

function claimsOverlap(x: Claim, y: Claim) {
  return (
    boundsOverlap(x.bounds[0], y.bounds[0]) &&
    boundsOverlap(x.bounds[1], y.bounds[1])
  );
}

function boundsOverlap(x: number[], y: number[]) {
  return (
    (x[0] >= y[0] && x[0] <= y[1]) ||
    (x[1] >= y[0] && x[1] <= y[1]) ||
    (x[0] <= y[0] && x[1] >= y[1])
  );
}
