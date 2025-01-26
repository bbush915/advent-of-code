import { part1 } from "./day.25";

describe("2015 Day 25", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe(9132360);
    });
  });
});
