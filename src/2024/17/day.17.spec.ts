import fs from "fs";

import { part1, part2 } from "./day.17";

describe("2024 Day 17", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2024/17/day.17.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe("4,6,3,5,6,3,5,2,1,0");
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe("7,3,1,3,6,3,6,0,2");
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the second example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2024/17/day.17.example.02.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(117440);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(105843716614554);
    });
  });
});
