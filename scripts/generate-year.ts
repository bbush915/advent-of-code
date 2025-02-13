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

console.info(`Generating ${year} folder...`);

try {
  fs.mkdirSync(`./src/${year}`);

  console.info("Created folder successfully!");
} catch (error: any) {
  console.error("Failed to create folder: ", error.message);
}
