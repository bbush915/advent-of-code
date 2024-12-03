import fs from "fs";

import { part1, part2 } from "./day.03";

describe("2024 Day 03", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2024/03/day.03.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(161);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe(188741603);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the second example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2024/03/day.03.example.02.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(48);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();
      expect(answer).toBe(67269798);
    });
  });
});
