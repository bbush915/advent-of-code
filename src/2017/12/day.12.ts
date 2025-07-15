import fs from "fs";

type Program = {
  id: number;
  connections: number[];
};

function parseInput() {
  const programs = fs
    .readFileSync("src/inputs/2017/12/day.12.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseProgram);

  const programLookup = programs.reduce(
    (lookup, program) => lookup.set(program.id, program),
    new Map<number, Program>()
  );

  return { programs, programLookup };
}

function parseProgram(value: string): Program {
  const parts = value.split(" <-> ");

  return {
    id: Number(parts[0]),
    connections: parts[1].split(", ").map(Number),
  };
}

export function part1() {
  const { programLookup } = parseInput();

  const group = getGroup(programLookup, 0);
  return group.size;
}

export function part2() {
  const { programs, programLookup } = parseInput();

  const groups: Set<number>[] = [];

  for (const { id } of programs) {
    if (groups.some((x) => x.has(id))) {
      continue;
    }

    const group = getGroup(programLookup, id);
    groups.push(group);
  }

  return groups.length;
}

function getGroup(programLookup: Map<number, Program>, id: number) {
  const group = new Set<number>();

  const queue = [id];

  while (queue.length) {
    const id = queue.pop()!;

    if (group.has(id)) {
      continue;
    }

    group.add(id);

    const { connections } = programLookup.get(id)!;
    queue.push(...connections);
  }

  return group;
}
