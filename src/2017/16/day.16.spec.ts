import { part1, part2 } from "./day.16";

describe("2017 Day 16", function () {
  describe("Part 1", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe("bkgcdefiholnpmja");
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe("knmdfoijcbpghlea");
    });
  });
});
