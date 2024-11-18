import commandLineArgs from "command-line-args";
import dotenv from "dotenv";

dotenv.config();

const options = commandLineArgs([
  {
    name: "year",
    alias: "y",
    type: Number,
    defaultValue: Number(process.env.YEAR),
  },
  {
    name: "day",
    alias: "d",
    type: Number,
    defaultValue: Number(process.env.DAY),
  },
  { name: "part", alias: "p", type: Number },
]);

const { year, day: day_, part } = options;
const day = day_.toString().padStart(2, "0");

if (part && ![1, 2].includes(part)) {
  console.error("Invalid Part specified. If present, must be 1 or 2.");
  process.exit(1);
}

const { part1, part2 } = require(`../src/${year}/${day}/day.${day}`);

console.info(`----- ${year} Day ${day} -----`);

if (part !== 2) {
  const { result: p1Answer, timeElapsed: p1TimeElapsed } = timePart(part1);
  console.info(`Part 1: ${p1Answer} [${p1TimeElapsed} ms]`);
}

if (part !== 1) {
  const { result: p2Answer, timeElapsed: p2TimeElapsed } = timePart(part2);
  console.info(`Part 2: ${p2Answer} [${p2TimeElapsed} ms]`);
}

function timePart(getResult: () => number | string) {
  const start = performance.now();

  const result = getResult();

  return {
    result,
    timeElapsed: Math.round((performance.now() - start) * 1000) / 1000,
  };
}
