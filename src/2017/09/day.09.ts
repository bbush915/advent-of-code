import fs from "fs";

type Item = {
  type: ItemTypes;
  i: number;
  j: number;
  children: Item[];
};

enum ItemTypes {
  GROUP,
  GARBAGE,
}

function parseInput() {
  const stream = fs
    .readFileSync("src/inputs/2017/09/day.09.input.txt")
    .toString()
    .trim()
    .split("");

  const [root] = parseItem(stream, 0);

  return {
    stream,
    root,
  };
}

function parseItem(stream: string[], index: number): [Item, number] {
  const type = stream[index] === "{" ? ItemTypes.GROUP : ItemTypes.GARBAGE;
  const seek = type === ItemTypes.GROUP ? "}" : ">";

  const i = index;
  let j = index + 1;

  const children: Item[] = [];

  while (stream[j] !== seek) {
    switch (stream[j]) {
      case "!": {
        j++;
        break;
      }

      case "{":
      case "<": {
        if (type === ItemTypes.GARBAGE) {
          break;
        }

        const [child, j_] = parseItem(stream, j);
        children.push(child);

        j = j_;
        break;
      }
    }

    j++;
  }

  return [
    {
      type,
      i,
      j,
      children,
    },
    j,
  ];
}

export function part1() {
  const { root } = parseInput();

  return getGroupScore(root, 0);
}

export function part2() {
  const { stream, root } = parseInput();

  return getGarbageCount(stream, root);
}

function getGroupScore(item: Item, depth: number): number {
  if (item.type === ItemTypes.GARBAGE) {
    return 0;
  }

  let score = depth + 1;

  for (const child of item.children) {
    score += getGroupScore(child, depth + 1);
  }

  return score;
}

function getGarbageCount(stream: string[], item: Item): number {
  let count = 0;

  if (item.type === ItemTypes.GARBAGE) {
    for (let i = item.i + 1; i < item.j; i++) {
      if (stream[i] === "!") {
        i++;
      } else {
        count++;
      }
    }
  } else {
    for (const child of item.children) {
      count += getGarbageCount(stream, child);
    }
  }

  return count;
}
