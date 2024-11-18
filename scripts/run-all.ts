import fs from "fs";

const days = fs
  .readdirSync("./src", { encoding: "utf8", recursive: true })
  .filter((x) => x.match(/^\d{4}\/\d{2}\/day\.\d+\.ts$/g))
  .map((x) => ({ year: x.split("/")[0], day: x.split("/")[1] }))
  .sort((x, y) => {
    if (x.year === y.year) {
      return x.day.localeCompare(y.day);
    }

    return x.year.localeCompare(y.year);
  });

let totalElapsed = 0;

for (const { year, day } of days) {
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
