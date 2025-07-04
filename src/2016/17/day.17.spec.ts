import fs from "fs";

import { part1, part2 } from "./day.17";

describe("2016 Day 17", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2016/17/day.17.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe("DDRRRD");
    });

    it("should calculate the correct answer for the second example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2016/17/day.17.example.02.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe("DDUDRLRRUDRD");
    });

    it("should calculate the correct answer for the third example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2016/17/day.17.example.03.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe("DRURDRUDDLLDLUURRDULRLDUUDDDRR");
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();

      expect(answer).toBe("DUDDRLRRRD");
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2016/17/day.17.example.01.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(370);
    });

    it("should calculate the correct answer for the second example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2016/17/day.17.example.02.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(492);
    });

    it("should calculate the correct answer for the third example", function () {
      const input = fs.readFileSync(
        "./src/inputs/2016/17/day.17.example.03.txt"
      );

      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(830);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(578);
    });
  });
});
