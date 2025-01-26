declare global {
  interface Array<T> {
    /**
     * Calculates the minimum value in an array of numbers.
     *
     * @param {number[]} this The array of values.
     * @return {number} The minimum value, or Number.POSITIVE_INFINITY if the array is empty.
     */
    min(this: number[]): number;

    /**
     * Calculates the maximum value in an array of numbers.
     *
     * @param {number[]} this The array of values.
     * @return {number} The maximum value, or Number.NEGATIVE_INFINITY if the array is empty.
     */
    max(this: number[]): number;

    /**
     * Calculates the sum of an array of numbers.
     *
     * @param {number[]} this The array of values.
     * @return {number} The sum, or 0 if the array is empty.
     */
    sum(this: number[]): number;

    /**
     * Calculates the product of an array of numbers.
     *
     * @param {number[]} this The array of values.
     * @return {number} The product, or 1 if the array is empty.
     */
    product(this: number[]): number;
  }
}

Object.defineProperty(Array.prototype, "min", {
  value: function min(this: number[]) {
    return this.reduce(
      (min, value) => (value < min ? value : min),
      Number.POSITIVE_INFINITY
    );
  },
});

Object.defineProperty(Array.prototype, "max", {
  value: function max(this: number[]) {
    return this.reduce(
      (max, value) => (value > max ? value : max),
      Number.NEGATIVE_INFINITY
    );
  },
});

Object.defineProperty(Array.prototype, "sum", {
  value: function sum(this: number[]) {
    return this.reduce((sum, value) => (sum += value), 0);
  },
});

Object.defineProperty(Array.prototype, "product", {
  value: function product(this: number[]) {
    return this.reduce((product, value) => (product *= value), 1);
  },
});

/**
 * Determines whether the given value is an array.
 *
 * @param {*} value The value.
 * @return {boolean} A value indicating whether the value is an array.
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Generates a range of value from [start, end).
 *
 * @param start The first value of the range.
 * @param finish The last value of the range (not inclusive).
 * @returns  The range of values.
 */
export function range(
  start: number,
  finish: number,
  step: number = 1
): number[] {
  return Array.from(
    { length: Math.ceil((finish - start) / step) },
    (_, i) => i * step + start
  );
}

/**
 * Returns the cartesian product of the given arrays.
 *
 * @template T
 * @param {T[][]} arrays The arrays.
 * @return {T[][]} The cartesian product of the given arrays.
 */
export function cartesian<T>(...arrays: T[][]): T[][] {
  return arrays.reduce(
    (productArrays, array) =>
      productArrays.flatMap((productArray) =>
        array.map((value) => [...productArray, value])
      ),
    [[]] as T[][]
  );
}

/**
 * Gets the index of of the last element which satisfies the given predicate.
 *
 * @param array The array.
 * @param predicate The predicate.
 * @returns The index of the last element which satisfies the predicate.
 */
export function lowerBound<T>(
  array: T[],
  predicate: (x: T, i: number) => boolean
) {
  let lo = 0;
  let hi = array.length - 1;

  while (lo <= hi) {
    const midpoint = lo + Math.floor((hi - lo) / 2);

    if (predicate(array[midpoint], midpoint)) {
      lo = midpoint + 1;
    } else {
      hi = midpoint - 1;
    }
  }

  return hi ?? -1;
}

/**
 * Gets the index of of the first element which does not satisfy the given predicate.
 *
 * @param array The array.
 * @param predicate The predicate.
 * @returns The index of the first element which does not satisfy the predicate.
 */
export function upperBound<T>(
  array: T[],
  predicate: (x: T, i: number) => boolean
) {
  let lo = 0;
  let hi = array.length - 1;

  while (lo <= hi) {
    const midpoint = lo + Math.floor((hi - lo) / 2);

    if (predicate(array[midpoint], midpoint)) {
      lo = midpoint + 1;
    } else {
      hi = midpoint - 1;
    }
  }

  return lo ?? -1;
}

/**
 * Gets the permutations of the given array.
 *
 * @param array  The array.
 * @returns The permutations of the array.
 */
export function getPermutations<T>(array: T[]) {
  if (array.length <= 1) {
    return [array];
  }

  const permutations: T[][] = [];

  for (const permutation of getPermutations(array.slice(1))) {
    for (let i = 0; i < array.length; i++) {
      permutations.push([
        ...permutation.slice(0, i),
        array[0],
        ...permutation.slice(i),
      ]);
    }
  }

  return permutations;
}
