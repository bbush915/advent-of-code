import fs from "fs";

import "@/utils/array";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2018/02/day.02.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x);
}

export function part1() {
  const boxes = parseInput();

  return boxes
    .map((box) => {
      const counts = [
        ...box
          .split("")
          .reduce(
            (counts, letter) =>
              counts.set(letter, (counts.get(letter) ?? 0) + 1),
            new Map<string, number>()
          )
          .values(),
      ];

      return [counts.includes(2), counts.includes(3)];
    })
    .reduce(
      ([box_2, box_3], [has_2, has_3]) => [
        box_2 + (has_2 ? 1 : 0),
        box_3 + (has_3 ? 1 : 0),
      ],
      [0, 0]
    )
    .product();
}

export function part2() {
  const boxes = parseInput();

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const mismatches: string[] = [];

      for (let n = 0; n < boxes[i].length; n++) {
        if (boxes[i][n] !== boxes[j][n]) {
          mismatches.push(boxes[i][n]);
        }
      }

      if (mismatches.length === 1) {
        return boxes[i]
          .split("")
          .filter((x) => x !== mismatches[0])
          .join("");
      }
    }
  }
}
