import fs from "fs";

import { part1, part2 } from "./day.02";

describe("2016 Day 02", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2016/02/day.02.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe("1985");
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe("78293");
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2016/02/day.02.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe("5DB3");
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe("AC8C8");
    });
  });
});
