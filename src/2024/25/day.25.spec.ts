import fs from "fs";

import { part1, part2 } from "./day.25";

describe("2024 Day 25", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2024/25/day.25.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(3);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(3255);
    });
  });
});
