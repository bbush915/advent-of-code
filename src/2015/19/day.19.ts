import fs from "fs";

function parseInput() {
  const sections = fs
    .readFileSync("src/inputs/2015/19/day.19.input.txt")
    .toString()
    .split("\n\n");

  const replacements = sections[0].split("\n").map((x) => x.split(" => "));
  const molecule = sections[1];

  return {
    replacements,
    molecule,
  };
}

export function part1() {
  const { replacements, molecule } = parseInput();

  const molecules = new Set<string>();

  for (let i = 0; i < molecule.length; i++) {
    for (const replacement of replacements) {
      if (molecule.slice(i).startsWith(replacement[0])) {
        molecules.add(
          molecule.slice(0, i) +
            replacement[1] +
            molecule.slice(i + replacement[0].length)
        );
      }
    }
  }

  return molecules.size;
}

export function part2() {
  let { replacements, molecule } = parseInput();

  let count = 0;

  while (molecule !== "e") {
    for (let i = molecule.length - 1; i >= 0; i--) {
      const replacement = replacements.filter((x) =>
        molecule.slice(i).startsWith(x[1])
      )[0];

      if (replacement) {
        molecule =
          molecule.slice(0, i) +
          replacement[0] +
          molecule.slice(i + replacement[1].length);

        break;
      }
    }

    count++;
  }

  return count;
}
