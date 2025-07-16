import { range } from "@/utils/array";

export function getKnotHash(value: string) {
  let position = 0;
  let skip = 0;

  const list = range(0, 256);

  const lengths = [
    ...value.split("").map((x) => x.charCodeAt(0)),
    17,
    31,
    73,
    47,
    23,
  ];

  for (let n = 0; n < 64; n++) {
    [position, skip] = performSparseKnotHash(list, lengths, position, skip);
  }

  const denseHash: number[] = [];

  for (let i = 0; i < 16; i++) {
    let value = list[16 * i];

    for (let j = 1; j < 16; j++) {
      value ^= list[16 * i + j];
    }

    denseHash.push(value);
  }

  return denseHash.map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function performSparseKnotHash(
  list: number[],
  lengths: number[],
  position: number,
  skip: number
) {
  for (const length of lengths) {
    for (let n = 0; n < Math.floor(length / 2); n++) {
      const i = (position + n) % list.length;
      const j = (position + length - 1 - n) % list.length;

      [list[i], list[j]] = [list[j], list[i]];
    }

    position = (position + skip + length) % list.length;
    skip++;
  }

  return [position, skip];
}
