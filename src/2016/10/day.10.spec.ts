import { part1, part2 } from "./day.10";

describe("2016 Day 10", function () {
  describe("Part 1", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(98);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(4042);
    });
  });
});
