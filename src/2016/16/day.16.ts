import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2016/16/day.16.input.txt")
    .toString()
    .trim();
}

export function part1(disk = 272) {
  const data = parseInput();

  return checksum(expand(data, disk));
}

export function part2() {
  const data = parseInput();

  return checksum(expand(data, 35_651_584));
}

function expand(data: string, disk: number) {
  let a = data;

  while (a.length < disk) {
    const b = a
      .split("")
      .map((x) => (x === "0" ? "1" : "0"))
      .reverse()
      .join("");

    a = `${a}0${b}`;
  }

  return a.slice(0, disk);
}

function checksum(data: string) {
  let checksum = data;

  do {
    let checksum_ = "";

    for (let i = 0; i < checksum.length; i += 2) {
      switch (checksum[i] + checksum[i + 1]) {
        case "00":
        case "11": {
          checksum_ += "1";
          break;
        }

        case "01":
        case "10": {
          checksum_ += "0";
          break;
        }
      }
    }

    checksum = checksum_;
  } while (checksum.length % 2 === 0);

  return checksum;
}
