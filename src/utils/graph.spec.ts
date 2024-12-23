import { search, topologicalSort } from "./graph";

describe("utils", function () {
  describe("graph", function () {
    describe("search", function () {
      it("correctly computes the shortest path", function () {
        const vertices: Record<string, Record<string, number>> = {
          "0": { "1": 4, "7": 8 },
          "1": { "0": 4, "2": 8, "7": 11 },
          "2": { "1": 8, "3": 7, "5": 4, "8": 2 },
          "3": { "2": 7, "4": 9, "5": 14 },
          "4": { "3": 9, "5": 10 },
          "5": { "2": 4, "3": 14, "4": 10, "6": 2 },
          "6": { "5": 2, "7": 1, "8": 6 },
          "7": { "0": 8, "1": 11, "6": 1, "8": 7 },
          "8": { "2": 2, "6": 6, "7": 7 },
        };

        function getNeighbors(key: string) {
          return Object.keys(vertices[key]);
        }

        function getDistance(x: string, y: string) {
          return vertices[x][y];
        }

        const source = "0";
        const target = "8";

        const result = search(getNeighbors, source, target, getDistance);

        expect(result.distanceLookup.get("8")).toBe(14);
      });
    });

    describe("topologicalSort", function () {
      it("correctly sorts the input", function () {
        const neighborLookup = new Map<string, string[]>([
          ["5", []],
          ["7", []],
          ["3", []],
          ["11", ["5", "7"]],
          ["8", ["7", "3"]],
          ["2", ["11"]],
          ["9", ["11", "8"]],
          ["10", ["3", "11"]],
        ]);

        const result = topologicalSort(neighborLookup);

        expect(result).toEqual(["5", "7", "3", "11", "8", "2", "9", "10"]);
      });
    });
  });
});
