import { part1, part2 } from "./day.12";

describe("2017 Day 12", function () {
  describe("Part 1", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(239);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(215);
    });
  });
});
