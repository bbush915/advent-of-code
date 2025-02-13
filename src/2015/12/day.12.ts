import fs from "fs";

import { isArray } from "@/utils/array";
import { isNumeric } from "@/utils/number";

function parseInput() {
  return fs.readFileSync("src/inputs/2015/12/day.12.input.txt").toString();
}

export function part1() {
  let total = 0;

  JSON.parse(parseInput(), (_, value) => {
    if (isNumeric(value)) {
      total += Number(value);
    }
  });

  return total;
}

export function part2() {
  let total = 0;

  JSON.stringify(
    JSON.parse(parseInput(), (_, value) => {
      if (!isArray(value) && Object.values(value).includes("red")) {
        return;
      }

      return value;
    }),
    (_, value) => {
      if (isNumeric(value)) {
        total += Number(value);
      }

      return value;
    }
  );

  return total;
}
