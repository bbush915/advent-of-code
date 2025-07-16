import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/15/day.15.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => Number(x.split(" ").at(-1)!));
}

export function part1() {
  const [a, b] = parseInput();

  const generator_a = generator(16_807, a, 1);
  const generator_b = generator(48_271, b, 1);

  return getJudgeCount(generator_a, generator_b, 40_000_000);
}

export function part2() {
  const [a, b] = parseInput();

  const generator_a = generator(16_807, a, 4);
  const generator_b = generator(48_271, b, 8);

  return getJudgeCount(generator_a, generator_b, 5_000_000);
}

function getJudgeCount(
  generator_a: Generator<string>,
  generator_b: Generator<string>,
  pairs: number
) {
  let judge = 0;

  for (let n = 0; n < pairs; n++) {
    if (generator_a.next().value! === generator_b.next().value!) {
      judge++;
    }
  }

  return judge;
}

function* generator(factor: number, previous: number, multiple: number) {
  let value = previous;

  while (1) {
    value = (value * factor) % 2_147_483_647;

    if (value % multiple === 0) {
      yield value.toString(2).slice(-16);
    }
  }
}
