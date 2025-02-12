import { part1, part2 } from "./day.11";

describe("2015 Day 11", function () {
  describe("Part 1", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe("cqjxxyzz");
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe("cqkaabcc");
    });
  });
});
