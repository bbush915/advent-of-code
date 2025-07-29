import fs from "fs";

import { part1, part2 } from "./day.15";

describe("2018 Day 15", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2018/15/day.15.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(27730);
    });

    it("should calculate the correct answer for the second example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2018/15/day.15.example.02.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(36334);
    });

    it("should calculate the correct answer for the third example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2018/15/day.15.example.03.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(39514);
    });

    it("should calculate the correct answer for the fourth example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2018/15/day.15.example.04.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(27755);
    });

    it("should calculate the correct answer for the fifth example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2018/15/day.15.example.05.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(28944);
    });

    it("should calculate the correct answer for the sixth example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2018/15/day.15.example.06.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(18740);
    });

    it.skip("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(215168);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(52374);
    });
  });
});
