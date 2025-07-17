import fs from "fs";

import { clone } from "@/utils/common";
import { isNumeric } from "@/utils/number";

type Instruction = {
  type: InstructionTypes;
  arguments: (string | number)[];
};

enum InstructionTypes {
  PLAY_SOUND = "snd",
  SET = "set",
  INCREASE = "add",
  MULTIPLY = "mul",
  REMAINDER = "mod",
  RECOVER_SOUND = "rcv",
  JUMP_IF_GREATER_THAN_ZERO = "jgz",
}

function parseInput() {
  const instructions = fs
    .readFileSync("src/inputs/2017/18/day.18.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseInstruction);

  const registers = [
    ...new Set(
      instructions.flatMap((x) => x.arguments.filter((x) => !isNumeric(x)))
    )
      .values()
      .map((x) => x as string),
  ];

  return {
    instructions,
    registers,
  };
}

function parseInstruction(value: string): Instruction {
  const parts = value.split(" ");
  const type = parts[0] as InstructionTypes;

  return {
    type,
    arguments: parts.slice(1).map((x) => (isNumeric(x) ? Number(x) : x)),
  };
}

export function part1() {
  const { instructions, registers: registers_ } = parseInput();
  const registers = initializeRegisters(registers_, 0);

  let index = 0;
  let sound = 0;

  while (1) {
    const instruction = instructions[index];

    switch (instruction.type) {
      case InstructionTypes.PLAY_SOUND: {
        sound = getValue(registers, instruction.arguments[0]);
        break;
      }

      case InstructionTypes.SET: {
        set(registers, instruction);
        break;
      }

      case InstructionTypes.INCREASE: {
        increase(registers, instruction);
        break;
      }

      case InstructionTypes.MULTIPLY: {
        multiply(registers, instruction);
        break;
      }

      case InstructionTypes.REMAINDER: {
        remainder(registers, instruction);
        break;
      }

      case InstructionTypes.RECOVER_SOUND: {
        if (getValue(registers, instruction.arguments[0])) {
          return sound;
        }

        break;
      }

      case InstructionTypes.JUMP_IF_GREATER_THAN_ZERO: {
        if (getValue(registers, instruction.arguments[0]) > 0) {
          index += getValue(registers, instruction.arguments[1]);
          continue;
        }

        break;
      }
    }

    index++;
  }

  return sound;
}

export function part2() {
  const { instructions, registers } = parseInput();

  const programs = [
    new Program(instructions, initializeRegisters(registers, 0)),
    new Program(instructions, initializeRegisters(registers, 1)),
  ];

  programs[0].registerReceiver(programs[1]);
  programs[1].registerReceiver(programs[0]);

  let deadlock = true;

  while (1) {
    for (const program of programs) {
      deadlock = !program.executeUntilWait()! && deadlock;
    }

    if (deadlock) {
      break;
    } else {
      deadlock = true;
    }
  }

  return programs[1].sendCount;
}

class Program {
  private readonly _instructions: Instruction[];
  private readonly _registers: Map<string, number>;

  private readonly _programs: Program[] = [];
  private readonly _queue: number[] = [];

  private _index = 0;
  private _isWaiting = false;
  private _sendCount = 0;

  constructor(instructions: Instruction[], registers: Map<string, number>) {
    this._instructions = instructions;
    this._registers = registers;
  }

  get sendCount() {
    return this._sendCount;
  }

  registerReceiver(program: Program) {
    this._programs.push(program);
  }

  receive(value: number) {
    this._queue.push(value);
  }

  executeUntilWait() {
    if (this._isWaiting && !this._queue.length) {
      return false;
    }

    while (1) {
      const instruction = this._instructions[this._index];

      switch (instruction.type) {
        case InstructionTypes.PLAY_SOUND: {
          const value = getValue(this._registers, instruction.arguments[0]);

          this.send(value);

          break;
        }

        case InstructionTypes.SET: {
          set(this._registers, instruction);
          break;
        }

        case InstructionTypes.INCREASE: {
          increase(this._registers, instruction);
          break;
        }

        case InstructionTypes.MULTIPLY: {
          multiply(this._registers, instruction);
          break;
        }

        case InstructionTypes.REMAINDER: {
          remainder(this._registers, instruction);
          break;
        }

        case InstructionTypes.RECOVER_SOUND: {
          const value = this._queue.shift();

          if (value !== undefined) {
            this._isWaiting = false;

            this._registers.set(instruction.arguments[0] as string, value);
          } else {
            this._isWaiting = true;

            return true;
          }

          break;
        }

        case InstructionTypes.JUMP_IF_GREATER_THAN_ZERO: {
          if (getValue(this._registers, instruction.arguments[0]) > 0) {
            this._index += getValue(this._registers, instruction.arguments[1]);
            continue;
          }

          break;
        }
      }

      this._index++;
    }
  }

  private send(value: number) {
    this._sendCount++;

    for (const program of this._programs) {
      program.receive(value);
    }
  }
}

function initializeRegisters(registers: string[], id: number) {
  const lookup = registers.reduce(
    (lookup, register) => lookup.set(register, 0),
    new Map<string, number>()
  );

  lookup.set("p", id);

  return lookup;
}

function set(registers: Map<string, number>, instruction: Instruction) {
  registers.set(
    instruction.arguments[0] as string,
    getValue(registers, instruction.arguments[1])
  );
}

function increase(registers: Map<string, number>, instruction: Instruction) {
  registers.set(
    instruction.arguments[0] as string,
    registers.get(instruction.arguments[0] as string)! +
      getValue(registers, instruction.arguments[1])
  );
}

function multiply(registers: Map<string, number>, instruction: Instruction) {
  registers.set(
    instruction.arguments[0] as string,
    registers.get(instruction.arguments[0] as string)! *
      getValue(registers, instruction.arguments[1])
  );
}

function remainder(registers: Map<string, number>, instruction: Instruction) {
  registers.set(
    instruction.arguments[0] as string,
    registers.get(instruction.arguments[0] as string)! %
      getValue(registers, instruction.arguments[1])
  );
}

function getValue(registers: Map<string, number>, argument: number | string) {
  return isNumeric(argument)
    ? (argument as number)
    : registers.get(argument as string)!;
}
