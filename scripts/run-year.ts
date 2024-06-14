import commandLineArgs from "command-line-args";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const options = commandLineArgs([
  {
    name: "year",
    alias: "y",
    type: Number,
    defaultValue: Number(process.env.YEAR),
  },
]);

const { year } = options;

const days = fs
  .readdirSync(`./src/${year}`, { encoding: "utf8", recursive: true })
  .filter((x) => x.match(/^\d{2}\/day\.\d+\.ts$/g))
  .map((x) => x.split("/")[0])
  .sort((x, y) => x.localeCompare(y));

let totalElapsed = 0;

for (const day of days) {
  const { part1, part2 } = require(`../src/${year}/${day}/day.${day}`);

  console.info(`----- ${year} Day ${day} -----`);

  const { result: p1Answer, timeElapsed: p1TimeElapsed } = timePart(part1);
  console.info(`Part 1: ${p1Answer} [${p1TimeElapsed} ms]`);

  const { result: p2Answer, timeElapsed: p2TimeElapsed } = timePart(part2);
  console.info(`Part 2: ${p2Answer} [${p2TimeElapsed} ms]`);

  totalElapsed += p1TimeElapsed + p2TimeElapsed;

  console.info();
}

console.info(`Total: ${Math.round(totalElapsed * 1000) / 1000} ms`);

function timePart(getResult: () => number | string) {
  const start = performance.now();

  const result = getResult();

  return {
    result,
    timeElapsed: Math.round((performance.now() - start) * 1000) / 1000,
  };
}
