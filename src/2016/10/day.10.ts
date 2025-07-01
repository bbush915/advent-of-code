import fs from "fs";

type Bot = {
  id: number;
  lo: [Targets, number];
  hi: [Targets, number];
  microchips: number[];
};

enum Targets {
  BOT = "bot",
  OUTPUT = "output",
}

function parseInput() {
  const botLookup = new Map<number, Bot>();

  const lines = fs
    .readFileSync("src/inputs/2016/10/day.10.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .sort();

  for (const line of lines) {
    const parts = line.split(" ");

    if (parts[0] === "value") {
      botLookup.get(Number(parts[5]))!.microchips.push(Number(parts[1]));
    } else {
      const bot: Bot = {
        id: Number(parts[1]),
        lo: [parts[5] as Targets, Number(parts[6])],
        hi: [parts[10] as Targets, Number(parts[11])],
        microchips: [],
      };

      botLookup.set(bot.id, bot);
    }
  }

  return botLookup;
}

export function part1() {
  const { id } = process();

  return id;
}

export function part2() {
  const { outputLookup } = process();

  return outputLookup.get(0)! * outputLookup.get(1)! * outputLookup.get(2)!;
}

function process() {
  const botLookup = parseInput();

  let id = 0;
  const outputLookup = new Map<number, number>();

  const bots = [...botLookup.values()].filter((x) => x.microchips.length === 2);

  while (bots.length) {
    const bot = bots.pop()!;

    bot.microchips.sort((x, y) => x - y);

    if (bot.microchips[0] === 17 && bot.microchips[1] === 61) {
      id = bot.id;
    }

    if (bot.lo[0] === Targets.OUTPUT) {
      outputLookup.set(bot.lo[1], bot.microchips[0]);
    } else {
      const loBot = botLookup.get(bot.lo[1])!;

      loBot.microchips.push(bot.microchips[0]);

      if (loBot.microchips.length === 2) {
        bots.push(loBot);
      }
    }

    if (bot.hi[0] === Targets.OUTPUT) {
      outputLookup.set(bot.hi[1], bot.microchips[1]);
    } else {
      const hiBot = botLookup.get(bot.hi[1])!;

      hiBot.microchips.push(bot.microchips[1]);

      if (hiBot.microchips.length === 2) {
        bots.push(hiBot);
      }
    }

    bot.microchips = [];
  }

  return { id, outputLookup };
}
