import { part1, part2 } from "./day.02";

describe("2018 Day 02", function () {
  describe("Part 1", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(6723);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe("prtkqyluiusocwvaezjmhmfgx");
    });
  });
});
