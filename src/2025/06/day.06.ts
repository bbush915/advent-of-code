import fs from "fs";

import "@/utils/array";

type Expression = {
  values: number[];
  operation: Operations;
};

enum Operations {
  ADD = "+",
  MULTIPLY = "*",
}

function parseInput() {
  return fs
    .readFileSync("src/inputs/2025/06/day.06.input.txt")
    .toString()
    .trim()
    .split("\n");
}

export function part1() {
  return getGrandTotal(normalMath);
}

export function part2() {
  return getGrandTotal(cephalopodMath);
}

function getGrandTotal(parseExpressions: (lines: string[]) => Expression[]) {
  const lines = parseInput();
  const expressions = parseExpressions(lines);

  return expressions
    .map((expression) => {
      switch (expression.operation) {
        case Operations.ADD: {
          return expression.values.sum();
        }

        case Operations.MULTIPLY: {
          return expression.values.product();
        }
      }
    })
    .sum();
}

function normalMath(lines: string[]) {
  const items = lines.map((x) => x.trim().split(/\s+/));

  const expressions: Expression[] = [];

  for (let j = 0; j < items[0].length; j++) {
    const expression: Expression = {
      values: [],
      operation: items[items.length - 1][j] as Operations,
    };

    for (let i = 0; i < items.length - 1; i++) {
      expression.values.push(Number(items[i][j]));
    }

    expressions.push(expression);
  }

  return expressions;
}

function cephalopodMath(lines: string[]) {
  const expressions: Expression[] = [];

  let values: number[] = [];

  for (let j = lines[0].length - 1; j >= 0; j--) {
    let value: number | null = null;

    for (let i = 0; i < lines.length; i++) {
      if (i === lines.length - 1 && value !== null) {
        values.push(value);
      }

      switch (lines[i][j]) {
        case " ": {
          break;
        }

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          value = 10 * (value || 0) + Number(lines[i][j]);
          break;
        }

        case Operations.ADD:
        case Operations.MULTIPLY: {
          const expression: Expression = {
            values,
            operation: lines[i][j] as Operations,
          };

          expressions.push(expression);

          values = [];

          break;
        }
      }
    }
  }

  return expressions;
}
