import { MinPriorityQueue } from "./data-structure";

export type DistanceFunction = (x: string, y: string) => number;

export const DefaultGetDistance: DistanceFunction = (_x, _y) => 1;

export type HeuristicFunction = (key: string, target?: string) => number;

export const DefaultGetHeuristic: HeuristicFunction = (_key, _target) => 0;

export function search(
  getNeighbors: (key: string) => string[],
  source: string,
  target?: string,
  getDistance: DistanceFunction = DefaultGetDistance,
  getHeuristic: HeuristicFunction = DefaultGetHeuristic
) {
  const distanceLookup = new Map<string, number>();
  distanceLookup.set(source, 0);

  const predecessorLookup = new Map<string, Set<string>>();
  predecessorLookup.set(source, new Set<string>());

  const priorityQueue = new MinPriorityQueue();
  priorityQueue.insert(source, getHeuristic(source, target));

  while (priorityQueue.size > 0) {
    const { key } = priorityQueue.pop()!;

    for (const neighborKey of getNeighbors(key)) {
      const distance = distanceLookup.get(key)! + getDistance(key, neighborKey);
      const neighborDistance =
        distanceLookup.get(neighborKey) ?? Number.POSITIVE_INFINITY;

      if (distance <= neighborDistance) {
        distanceLookup.set(neighborKey, distance);

        if (
          distance < neighborDistance ||
          !predecessorLookup.has(neighborKey)
        ) {
          predecessorLookup.set(neighborKey, new Set<string>());
        }

        predecessorLookup.get(neighborKey)!.add(key);

        const heuristic = distance + getHeuristic(neighborKey, target);

        if (priorityQueue.includes(neighborKey)) {
          priorityQueue.update(neighborKey, heuristic);
        } else {
          priorityQueue.insert(neighborKey, heuristic);
        }
      }
    }

    if (key === target) {
      break;
    }
  }

  return { distanceLookup, predecessorLookup };
}

enum MarkType {
  TEMPORARY,
  PERMANENT,
}

export function topologicalSort(
  neighborLookup: Map<string, string[]>
): string[] {
  const markLookup = new Map<string, MarkType>();
  const results: string[] = [];

  for (const key of neighborLookup.keys()) {
    switch (markLookup.get(key)) {
      case MarkType.TEMPORARY:
      case MarkType.PERMANENT: {
        continue;
      }
    }

    topologicalSortVisit(key, neighborLookup, markLookup, results);
  }

  return results;
}

function topologicalSortVisit(
  key: string,
  neighborLookup: Map<string, string[]>,
  markLookup: Map<string, MarkType>,
  results: string[]
) {
  switch (markLookup.get(key)) {
    case MarkType.PERMANENT: {
      return;
    }

    case MarkType.TEMPORARY: {
      throw new Error("Cycle detected.");
    }
  }

  markLookup.set(key, MarkType.TEMPORARY);

  for (const neighborKey of neighborLookup.get(key) ?? []) {
    topologicalSortVisit(neighborKey, neighborLookup, markLookup, results);
  }

  markLookup.set(key, MarkType.PERMANENT);

  results.push(key);
}
