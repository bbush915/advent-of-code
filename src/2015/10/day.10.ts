import fs from "fs";

function parseInput() {
  return fs.readFileSync("src/inputs/2015/10/day.10.input.txt").toString();
}

export function part1() {
  return lookAndSay(parseInput(), 40).length;
}

export function part2() {
  return lookAndSay(parseInput(), 50).length;
}

function lookAndSay(sequence: string, iterations: number) {
  for (let n = 0; n < iterations; n++) {
    sequence += "~";
    let sequence_ = "";

    let i = 0;

    let runDigit = sequence[i];
    let runCount = 0;

    while (i < sequence.length) {
      if (sequence[i] !== runDigit) {
        sequence_ += String(runCount) + runDigit;
        runCount = 0;
      }

      runDigit = sequence[i];
      runCount++;

      i++;
    }

    sequence = sequence_;
  }

  return sequence;
}
