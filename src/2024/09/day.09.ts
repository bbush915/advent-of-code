import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/inputs/2024/09/day.09.input.txt")
    .toString()
    .split("")
    .map(Number);
}

export function part1() {
  const diskMap = parseInput();

  // NOTE - Expand disk map.

  const disk: number[] = [];

  for (let i = 0; i < diskMap.length; i += 2) {
    disk.push(
      ...new Array(diskMap[i]).fill(Math.floor(i / 2)),
      ...new Array(diskMap[i + 1] ?? 0).fill(-1)
    );
  }

  // NOTE - Compact files.

  let freeSpaceIndex = disk.findIndex((x) => x < 0);

  while (freeSpaceIndex < disk.length) {
    disk.splice(freeSpaceIndex, 1, disk.pop()!);

    while (disk[freeSpaceIndex] >= 0) {
      freeSpaceIndex++;
    }
  }

  // NOTE - Calculate checksum.

  return disk.reduce(
    (checksum, id, i) => (checksum += (id === -1 ? 0 : id) * i),
    0
  );
}

export function part2() {
  const diskMap = parseInput();

  // NOTE - Compute indices of files and free space on disk.

  const { fileIndices, freeSpaceIndices } = diskMap.reduce<{
    diskSize: number;
    fileIndices: number[][];
    freeSpaceIndices: number[][];
  }>(
    (acc, val, i, arr) => {
      if (i % 2) {
        return acc;
      }

      const { fileIndices, freeSpaceIndices } = acc;

      const fileId = Math.floor(i / 2);
      const fileSize = val;

      fileIndices.push([acc.diskSize, fileId, fileSize]);
      acc.diskSize += fileSize;

      const freeSpaceSize = arr[i + 1];

      freeSpaceIndices.push([acc.diskSize, freeSpaceSize]);
      acc.diskSize += freeSpaceSize;

      return acc;
    },
    { diskSize: 0, fileIndices: [], freeSpaceIndices: [] }
  );

  // NOTE - Compact files.

  for (let n = fileIndices.length - 1; n > 0; n--) {
    const freeSpaceIndexIndex = freeSpaceIndices.findIndex(
      (x) => x[0] < fileIndices[n][0] && x[1] >= fileIndices[n][2]
    );

    if (freeSpaceIndexIndex >= 0) {
      const freeSpaceIndex = freeSpaceIndices[freeSpaceIndexIndex];

      fileIndices[n][0] = freeSpaceIndex[0];

      freeSpaceIndex[0] += fileIndices[n][2];
      freeSpaceIndex[1] -= fileIndices[n][2];

      if (!freeSpaceIndex[1]) {
        freeSpaceIndices.splice(freeSpaceIndexIndex, 1);
      }
    }
  }

  // NOTE - Calculate checksum.

  return fileIndices.reduce((checksum, [index, fileId, fileSize]) => {
    for (let i = 0; i < fileSize; i++) {
      checksum += fileId * (index + i);
    }

    return checksum;
  }, 0);
}
