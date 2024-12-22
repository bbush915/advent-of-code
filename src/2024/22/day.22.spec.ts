import fs from "fs";

import { part1, part2 } from "./day.22";

describe("2024 Day 22", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2024/22/day.22.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(37327623);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(13022553808);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the second example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2024/22/day.22.example.02.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(23);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(1555);
    });
  });
});
