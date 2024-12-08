import fs from "fs";

function parseInput() {
  const map = fs
    .readFileSync("src/inputs/2024/08/day.08.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));

  const antennae = new Map<string, number[][]>();

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === ".") {
        continue;
      }

      const antenna = antennae.get(map[i][j]) ?? [];
      antenna.push([i, j]);

      antennae.set(map[i][j], antenna);
    }
  }

  return {
    map,
    antennae,
  };
}

export function part1() {
  const { map, antennae } = parseInput();

  const antinodes = new Set<string>();

  for (const [, locations] of antennae) {
    for (let n = 0; n < locations.length; n++) {
      for (let m = n + 1; m < locations.length; m++) {
        const di = locations[m][0] - locations[n][0];
        const dj = locations[m][1] - locations[n][1];

        // NOTE - Side 1

        const i1 = locations[n][0] - di;
        const j1 = locations[n][1] - dj;

        const antinode1 = toKey(i1, j1);

        if (map[i1]?.[j1]) {
          antinodes.add(antinode1);
        }

        // NOTE - Side 2

        const i2 = locations[m][0] + di;
        const j2 = locations[m][1] + dj;

        const antinode2 = toKey(i2, j2);

        if (map[i2]?.[j2]) {
          antinodes.add(antinode2);
        }
      }
    }
  }

  return antinodes.size;
}

export function part2() {
  const { map, antennae } = parseInput();

  const antinodes = new Set<string>();

  for (const [, locations] of antennae) {
    for (let n = 0; n < locations.length; n++) {
      for (let m = n + 1; m < locations.length; m++) {
        const di = locations[m][0] - locations[n][0];
        const dj = locations[m][1] - locations[n][1];

        // NOTE - Side 1

        let i1 = locations[n][0] - di;
        let j1 = locations[n][1] - dj;

        while (map[i1]?.[j1]) {
          antinodes.add(toKey(i1, j1));

          i1 -= di;
          j1 -= dj;
        }

        // NOTE - Side 2

        let i2 = locations[m][0] + di;
        let j2 = locations[m][1] + dj;

        while (map[i2]?.[j2]) {
          antinodes.add(toKey(i2, j2));

          i2 += di;
          j2 += dj;
        }

        // NOTE - Antennae themselves.

        antinodes.add(toKey(locations[n][0], locations[n][1]));
        antinodes.add(toKey(locations[m][0], locations[m][1]));
      }
    }
  }

  return antinodes.size;
}

function toKey(i: number, j: number) {
  return `${i}|${j}`;
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
