import fs from "fs";

import { part1, part2 } from "./day.14";

describe("2016 Day 14", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2016/14/day.14.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(22728);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(18626);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2016/14/day.14.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(22551);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(20092);
    });
  });
});
