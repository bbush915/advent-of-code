export type OpcodeFn = (
  registers: Registers,
  inputs: [number, number],
  output: number
) => Registers;

export type Registers = number[];

export function addr(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] + registers[inputs[1]];
  return registers;
}

export function addi(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] + inputs[1];
  return registers;
}

export function mulr(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] * registers[inputs[1]];
  return registers;
}

export function muli(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] * inputs[1];
  return registers;
}

export function banr(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] & registers[inputs[1]];
  return registers;
}

export function bani(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] & inputs[1];
  return registers;
}

export function borr(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] | registers[inputs[1]];
  return registers;
}

export function bori(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] | inputs[1];
  return registers;
}

export function setr(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]];
  return registers;
}

export function seti(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = inputs[0];
  return registers;
}

export function gtir(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = inputs[0] > registers[inputs[1]] ? 1 : 0;
  return registers;
}

export function gtri(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] > inputs[1] ? 1 : 0;
  return registers;
}

export function gtrr(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] > registers[inputs[1]] ? 1 : 0;
  return registers;
}

export function eqir(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = inputs[0] === registers[inputs[1]] ? 1 : 0;
  return registers;
}

export function eqri(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] === inputs[1] ? 1 : 0;
  return registers;
}

export function eqrr(
  registers: Registers,
  inputs: [number, number],
  output: number
) {
  registers[output] = registers[inputs[0]] === registers[inputs[1]] ? 1 : 0;
  return registers;
}
