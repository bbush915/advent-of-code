import fs from "fs";

import { matches } from "@/utils/array";
import { clone } from "@/utils/common";

type Sample = {
  instruction: Instruction;
  prev: Registers;
  next: Registers;
};

type Instruction = [number, number, number, number];

type Registers = [number, number, number, number];

type OpcodeFn = (
  registers: Registers,
  inputs: [number, number],
  output: number
) => Registers;

function parseInput() {
  const sections = fs
    .readFileSync("src/inputs/2018/16/day.16.input.txt")
    .toString()
    .trim()
    .split("\n\n\n\n");

  const samples = sections[0].split("\n\n").map(parseSample);

  const program = sections[1]
    .split("\n")
    .map((x) => x.split(" ").map(Number) as Instruction);

  return {
    samples,
    program,
  };
}

function parseSample(value: string): Sample {
  const lines = value.split("\n").filter((x) => x);

  return {
    instruction: lines[1].split(" ").map(Number) as Instruction,
    prev: lines[0]
      .split(": ")[1]
      .slice(1, -1)
      .split(", ")
      .map(Number) as Registers,
    next: lines[2]
      .split(":  ")[1]
      .slice(1, -1)
      .split(", ")
      .map(Number) as Registers,
  };
}

export function part1() {
  const { samples } = parseInput();

  let count = 0;

  for (const sample of samples) {
    const matchCount = [
      addr,
      addi,
      mulr,
      muli,
      banr,
      bani,
      borr,
      bori,
      setr,
      seti,
      gtir,
      gtri,
      gtrr,
      eqir,
      eqri,
      eqrr,
    ]
      .map((opcode) =>
        matches(
          opcode(
            clone(sample.prev),
            [sample.instruction[1], sample.instruction[2]],
            sample.instruction[3]
          ),
          sample.next
        )
          ? 1
          : 0
      )
      .sum();

    if (matchCount >= 3) {
      count++;
    }
  }

  return count;
}

export function part2() {
  const { samples, program } = parseInput();

  const opcodeLookup = getOpcodeLookup(samples);

  const registers: Registers = [0, 0, 0, 0];

  for (const instruction of program) {
    const opcode = opcodeLookup.get(instruction[0])!;

    opcode(registers, [instruction[1], instruction[2]], instruction[3]);
  }

  return registers[0];
}

function getOpcodeLookup(samples: Sample[]) {
  const opcodeLookup = new Map<number, OpcodeFn>();

  while (opcodeLookup.size < 16) {
    for (const sample of samples) {
      const opcodeMatches = [
        addr,
        addi,
        mulr,
        muli,
        banr,
        bani,
        borr,
        bori,
        setr,
        seti,
        gtir,
        gtri,
        gtrr,
        eqir,
        eqri,
        eqrr,
      ]
        .map((opcode) =>
          matches(
            opcode(
              clone(sample.prev),
              [sample.instruction[1], sample.instruction[2]],
              sample.instruction[3]
            ),
            sample.next
          )
            ? opcode
            : null
        )
        .filter((x) => x && ![...opcodeLookup.values()].includes(x));

      if (opcodeMatches.length === 1) {
        opcodeLookup.set(sample.instruction[0], opcodeMatches[0]!);
      }
    }
  }

  return opcodeLookup;
}

function addr(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] + registers[inputs[1]];
  return registers;
}

function addi(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] + inputs[1];
  return registers;
}

function mulr(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] * registers[inputs[1]];
  return registers;
}

function muli(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] * inputs[1];
  return registers;
}

function banr(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] & registers[inputs[1]];
  return registers;
}

function bani(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] & inputs[1];
  return registers;
}

function borr(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] | registers[inputs[1]];
  return registers;
}

function bori(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] | inputs[1];
  return registers;
}

function setr(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]];
  return registers;
}

function seti(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = inputs[0];
  return registers;
}

function gtir(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = inputs[0] > registers[inputs[1]] ? 1 : 0;
  return registers;
}

function gtri(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] > inputs[1] ? 1 : 0;
  return registers;
}

function gtrr(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] > registers[inputs[1]] ? 1 : 0;
  return registers;
}

function eqir(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = inputs[0] === registers[inputs[1]] ? 1 : 0;
  return registers;
}

function eqri(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] === inputs[1] ? 1 : 0;
  return registers;
}

function eqrr(registers: Registers, inputs: [number, number], output: number) {
  registers[output] = registers[inputs[0]] === registers[inputs[1]] ? 1 : 0;
  return registers;
}
