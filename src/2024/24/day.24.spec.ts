import { part1, part2 } from "./day.24";

describe("2024 Day 24", function () {
  describe("Part 1", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(50411513338638);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe("gfv,hcm,kfs,tqm,vwr,z06,z11,z16");
    });
  });
});
