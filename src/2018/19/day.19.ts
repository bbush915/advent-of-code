import fs from "fs";

import {
  addi,
  addr,
  bani,
  banr,
  bori,
  borr,
  eqir,
  eqri,
  eqrr,
  gtir,
  gtri,
  gtrr,
  muli,
  mulr,
  OpcodeFn,
  Registers,
  seti,
  setr,
} from "2018/utils/opcode";
import { eratosthenes } from "@/utils/number";

type Instruction = [string, number, number, number];

const OPCODE_LOOKUP = new Map<string, OpcodeFn>([
  ["addi", addi],
  ["addr", addr],
  ["bani", bani],
  ["banr", banr],
  ["bori", bori],
  ["borr", borr],
  ["eqir", eqir],
  ["eqri", eqri],
  ["eqrr", eqrr],
  ["gtir", gtir],
  ["gtri", gtri],
  ["gtrr", gtrr],
  ["muli", muli],
  ["mulr", mulr],
  ["seti", seti],
  ["setr", setr],
]);

function parseInput() {
  const lines = fs
    .readFileSync("src/inputs/2018/19/day.19.input.txt")
    .toString()
    .trim()
    .split("\n");

  let ip: number;
  const program: Instruction[] = [];

  for (const line of lines) {
    if (line.startsWith("#ip")) {
      ip = Number(line.split(" ")[1]);
    } else {
      const parts = line.split(" ");

      const instruction: Instruction = [
        parts[0],
        Number(parts[1]),
        Number(parts[2]),
        Number(parts[3]),
      ];

      program.push(instruction);
    }
  }

  return { ip: ip!, program };
}

export function part1() {
  const { ip, program } = parseInput();

  const registers: Registers = [0, 0, 0, 0, 0, 0];
  let index = 0;

  while (index >= 0 && index < program.length) {
    registers[ip] = index;

    const instruction = program[index];

    const opcode = OPCODE_LOOKUP.get(instruction[0])!;
    opcode(registers, [instruction[1], instruction[2]], instruction[3]);

    index = registers[ip];

    index++;
  }

  return registers[0];
}

export function part2() {
  let n = 10_551_296;

  let value = 1;

  const primes = eratosthenes(Math.floor(Math.sqrt(n)));

  for (const prime of primes) {
    if (n % prime === 0) {
      let order = 0;

      while (n % prime === 0) {
        n /= prime;

        order++;
      }

      value *= (Math.pow(prime, order + 1) - 1) / (prime - 1);
    }
  }

  return value;
}
