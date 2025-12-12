import fs from "fs";

import { toKey } from "@/utils/common";

enum Locations {
  INSIDE,
  OUTSIDE,
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2025/09/day.09.input.txt")
    .toString()
    .trim()
    .split("\n")
    .map((x, i) => [i, ...x.split(",").map(Number)]);
}

export function part1() {
  const tiles = parseInput();

  let max = 0;

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const area =
        (Math.abs(tiles[i][1] - tiles[j][1]) + 1) *
        (Math.abs(tiles[i][2] - tiles[j][2]) + 1);

      if (area > max) {
        max = area;
      }
    }
  }

  return max;
}

export function part2() {
  const tiles = parseInput();
  const { edgeLookup, vEdges, hEdges } = getEdges(tiles);

  const extentLookup = new Map<number, number[]>();

  for (const [id, x, y] of tiles) {
    // NOTE - Check horizontal extents.

    const vHits = vEdges.filter((edge) => y >= edge[0][1] && y <= edge[1][1]);

    const vHitLocations: [number[][], Locations][] = [];

    for (let i = 0; i < vHits.length - 1; i++) {
      const x0 = Math.min(vHits[i][0][0], vHits[i + 1][0][0]);
      const x1 = Math.max(vHits[i][0][0], vHits[i + 1][0][0]);

      const isEdge = edgeLookup.has(toKey([x0, y, x1, y]));

      const location =
        isEdge ||
        hEdges.filter(
          (edge) =>
            edge[0][1] < y && x0 + 0.5 >= edge[0][0] && x0 + 0.5 <= edge[1][0]
        ).length %
          2 ===
          1
          ? Locations.INSIDE
          : Locations.OUTSIDE;

      vHitLocations.push([vHits[i], location]);
    }

    vHitLocations.push([vHits[vHits.length - 1], Locations.OUTSIDE]);

    let hIndex = Math.max(
      vHitLocations.findIndex(
        ([vHit]) =>
          (vHit[0][0] === x && vHit[0][1] === y) ||
          (vHit[1][0] === x && vHit[1][1] === y)
      ),
      0
    );

    if (vHitLocations[hIndex][1] === Locations.OUTSIDE) {
      hIndex--;
    }

    let hIndexLo = hIndex;

    while (
      hIndexLo > 0 &&
      vHitLocations[hIndexLo - 1][1] === Locations.INSIDE
    ) {
      hIndexLo--;
    }

    let hIndexHi = hIndex;

    while (
      hIndexHi < vHitLocations.length &&
      vHitLocations[hIndexHi][1] === Locations.INSIDE
    ) {
      hIndexHi++;
    }

    // NOTE - Check vertical extents.

    const hHits = hEdges.filter((edge) => x >= edge[0][0] && x <= edge[1][0]);

    const hHitLocations: [number[][], Locations][] = [];

    for (let i = 0; i < hHits.length - 1; i++) {
      const y0 = Math.min(hHits[i][0][1], hHits[i + 1][0][1]);
      const y1 = Math.max(hHits[i][0][1], hHits[i + 1][0][1]);

      const isEdge = edgeLookup.has(toKey([x, y0, x, y1]));

      const location =
        isEdge ||
        vEdges.filter(
          (edge) =>
            edge[0][0] < x && y0 + 0.5 >= edge[0][1] && y0 + 0.5 <= edge[1][1]
        ).length %
          2 ===
          1
          ? Locations.INSIDE
          : Locations.OUTSIDE;

      hHitLocations.push([hHits[i], location]);
    }

    hHitLocations.push([hHits[hHits.length - 1], Locations.OUTSIDE]);

    let vIndex = Math.max(
      hHitLocations.findIndex(
        ([hHit]) =>
          (hHit[0][0] === x && hHit[0][1] === y) ||
          (hHit[1][0] === x && hHit[1][1] === y)
      ),
      0
    );

    if (hHitLocations[vIndex][1] === Locations.OUTSIDE) {
      vIndex--;
    }

    let vIndexLo = vIndex;

    while (
      vIndexLo > 0 &&
      hHitLocations[vIndexLo - 1][1] === Locations.INSIDE
    ) {
      vIndexLo--;
    }

    let vIndexHi = vIndex;

    while (
      vIndexHi < hHitLocations.length &&
      hHitLocations[vIndexHi][1] === Locations.INSIDE
    ) {
      vIndexHi++;
    }

    const extent = [
      vHits[hIndexLo][0][0],
      hHits[vIndexLo][0][1],
      vHits[hIndexHi][0][0],
      hHits[vIndexHi][0][1],
    ];

    extentLookup.set(id, extent);
  }

  let max = 0;

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const tile1 = tiles[i];
      const tile1Extents = extentLookup.get(tile1[0])!;

      const tile2 = tiles[j];
      const tile2Extents = extentLookup.get(tile2[0])!;

      if (
        tile2[1] < tile1Extents[0] ||
        tile2[1] > tile1Extents[2] ||
        tile2[2] < tile1Extents[1] ||
        tile2[2] > tile1Extents[3] ||
        tile1[1] < tile2Extents[0] ||
        tile1[1] > tile2Extents[2] ||
        tile1[2] < tile2Extents[1] ||
        tile1[2] > tile2Extents[3]
      ) {
        continue;
      }

      const area =
        (Math.abs(tiles[i][1] - tiles[j][1]) + 1) *
        (Math.abs(tiles[i][2] - tiles[j][2]) + 1);

      if (area > max) {
        max = area;
      }
    }
  }

  return max;
}

function getEdges(vertices: number[][]) {
  const edgeLookup = new Set<string>();
  const vEdges: number[][][] = [];
  const hEdges: number[][][] = [];

  for (let i = 0; i < vertices.length; i++) {
    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % vertices.length];

    const x0 = Math.min(v1[1], v2[1]);
    const x1 = Math.max(v1[1], v2[1]);
    const y0 = Math.min(v1[2], v2[2]);
    const y1 = Math.max(v1[2], v2[2]);

    const key = toKey([x0, y0, x1, y1]);

    edgeLookup.add(key);

    const edge = [
      [x0, y0],
      [x1, y1],
    ];

    if (x0 === x1) {
      vEdges.push(edge);
    }

    if (y0 === y1) {
      hEdges.push(edge);
    }
  }

  vEdges.sort((e1, e2) => e1[0][0] - e2[0][0]);
  hEdges.sort((e1, e2) => e1[0][1] - e2[0][1]);

  return {
    edgeLookup,
    vEdges,
    hEdges,
  };
}
