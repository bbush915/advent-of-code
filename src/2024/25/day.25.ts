import fs from "fs";

type Schematic = {
  type: SchematicTypes;
  pins: number[];
};

enum SchematicTypes {
  LOCK,
  KEY,
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/25/day.25.input.txt")
    .toString()
    .split("\n\n")
    .map(parseSchematic)
    .reduce<{ locks: number[][]; keys: number[][] }>(
      (schematics, schematic) => {
        switch (schematic.type) {
          case SchematicTypes.LOCK: {
            schematics.locks.push(schematic.pins);
            break;
          }

          case SchematicTypes.KEY: {
            schematics.keys.push(schematic.pins);
            break;
          }
        }

        return schematics;
      },
      {
        locks: [],
        keys: [],
      }
    );
}

function parseSchematic(section: string): Schematic {
  const rows = section.split("\n").filter((x) => x);

  const type = rows[0][0] === "#" ? SchematicTypes.LOCK : SchematicTypes.KEY;
  const pins = new Array(5).fill(0);

  if (type === SchematicTypes.KEY) {
    rows.reverse();
  }

  for (const row of rows.slice(1)) {
    for (let i = 0; i < pins.length; i++) {
      if (row[i] === "#") {
        pins[i]++;
      }
    }
  }

  return {
    type,
    pins,
  };
}

export function part1() {
  const { locks, keys } = parseInput();

  let count = 0;

  for (const lock of locks) {
    keyLoop: for (const key of keys) {
      for (let i = 0; i < 5; i++) {
        if (lock[i] + key[i] > 5) {
          continue keyLoop;
        }
      }

      count++;
    }
  }

  return count;
}

export function part2() {
  return "Merry Christmas!";
}
