import fs from "fs";

type Instruction = {
  op: string;
  arg: number;
  visited: boolean;
};

type Result = {
  terminates: boolean;
  accumulator: number;
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2020/08/day.08.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map<Instruction>((x) => ({
      op: x.slice(0, 3),
      arg: Number(x.slice(4)),
      visited: false,
    }));
}

export function part1() {
  const instructions = parseInput();

  return evaluate(instructions)!.accumulator;
}

export function part2() {
  const instructions = parseInput();

  for (let i = 0; i < instructions.length; i++) {
    const clone = JSON.parse(JSON.stringify(instructions));

    const instruction = clone[i];

    if (instruction.op === "nop") {
      clone.splice(i, 1, { op: "jmp", arg: instruction.arg, visited: false });
    } else if (instruction.op === "jmp") {
      clone.splice(i, 1, { op: "nop", arg: instruction.arg, visited: false });
    }

    const result = evaluate(clone)!;

    if (result.terminates) {
      return result.accumulator;
    }
  }
}

function evaluate(instructions: Instruction[]): Result | undefined {
  let accumulator = 0;
  let currentIndex = 0;

  while (1) {
    if (currentIndex === instructions.length) {
      return { terminates: true, accumulator };
    }

    const instruction = instructions[currentIndex];

    if (instruction.visited) {
      return { terminates: false, accumulator };
    }

    instruction.visited = true;

    switch (instruction.op) {
      case "nop": {
        currentIndex++;
        break;
      }

      case "acc": {
        accumulator += instruction.arg;
        currentIndex++;
        break;
      }

      case "jmp": {
        currentIndex += instruction.arg;
        break;
      }
    }
  }
}
