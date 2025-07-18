import { part1, part2 } from "./day.21";

describe("2017 Day 21", function () {
  describe("Part 1", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(208);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(2480380);
    });
  });
});
