import { part1, part2 } from "./day.10";

describe("2017 Day 10", function () {
  describe("Part 1", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(46600);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe("23234babdc6afa036749cfa9b597de1b");
    });
  });
});
