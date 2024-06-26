import axios from "axios";
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
  {
    name: "day",
    alias: "d",
    type: Number,
    defaultValue: Number(process.env.DAY),
  },
  { name: "delay", type: Number, defaultValue: 0 },
]);

const { year, day: day_, delay } = options;
const day = day_.toString().padStart(2, "0");

console.info(`Fetching ${year} Day ${day} input file in ${delay} seconds...`);

setTimeout(() => {
  axios
    .get(`https://adventofcode.com/${year}/day/${day_}/input`, {
      headers: {
        cookie: `session=${process.env.SESSION}`,
      },
    })
    .then((response) => {
      fs.mkdirSync(`./src/inputs/${year}/${day}`, { recursive: true });

      fs.writeFileSync(
        `./src/inputs/${year}/${day}/day.${day}.input.txt`,
        response.data
      );

      console.info("Downloaded input file successfully!");
    })
    .catch((error) => {
      console.error("Failed to download input file: ", error.message);
    });
}, delay * 1000);
