import fs from "fs";

import { part1, part2 } from "./day.11";

describe("2024 Day 11", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2024/11/day.11.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(55312);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(220999);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(261936432123724);
    });
  });
});
