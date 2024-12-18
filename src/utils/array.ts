declare global {
  interface Array<T> {
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

    /**
     * Generates a lookup from the given array using the given key selector.
     *
     * @template K The key type.
     * @template V The value type.
     * @param {V[]} this The array.
     * @param {(value: V) => K} keySelector The key selector.
     * @returns {Map<K, T>} The lookup generated from the given array using the given key selector.
     * @throws Throws if the selected key for a value is not unique.
     */
    toLookup<K, V>(this: V[], keySelector: (value: V) => K): Map<K, V>;
  }
}

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

Object.defineProperty(Array.prototype, "toLookup", {
  value: function toLookup<K, V>(this: V[], keySelector: (value: V) => K) {
    return this.reduce((lookup, value) => {
      const key = keySelector(value);

      if (lookup.has(key)) {
        throw new Error(`Key [${key}] is not unique.`);
      }

      lookup.set(key, value);

      return lookup;
    }, new Map<K, V>());
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
