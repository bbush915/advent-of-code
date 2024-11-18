import { part1, part2 } from "./day.06";

describe("2015 Day 06", function () {
  describe("Part 1", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe(400410);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();
      expect(answer).toBe(15343601);
    });
  });
});
