import fs from "fs";

import { part1, part2 } from "./day.15";

describe("2015 Day 15", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    // it("should calculate the correct answer for the first example", function () {
    //   const input = fs.readFileSync(
    //     "./src/inputs/2015/15/day.15.example.01.txt"
    //   );

    //   jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

    //   const answer = part1();

    //   expect(answer).toBe(62842880);
    // });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(222870);
    });
  });

  describe("Part 2", function () {
    // it("should calculate the correct answer for the first example", function () {
    //   const input = fs.readFileSync("./src/inputs/2015/15/day.15.example.01.txt");

    //   jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

    //   const answer = part2();

    //   expect(answer).toBe(57600000);
    // });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(117936);
    });
  });
});
