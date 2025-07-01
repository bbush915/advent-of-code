import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/09/day.09.input.txt")
    .toString()
    .replace(/\s/g, "");
}

export function part1() {
  const file = parseInput();

  return getDecompressedLength(file, false);
}

export function part2() {
  const file = parseInput();

  return getDecompressedLength(file, true);
}

function getDecompressedLength(file: string, v2: boolean) {
  let length = 0;

  for (let i = 0; i < file.length; i++) {
    if (file[i] === "(") {
      const j = file.indexOf(")", i);

      const [characters, repeat] = file
        .slice(i + 1, j)
        .split("x")
        .map(Number);

      i = characters + j;

      length +=
        (v2
          ? getDecompressedLength(file.slice(j + 1, j + 1 + characters), true)
          : characters) * repeat;

      continue;
    }

    length++;
  }

  return length;
}
