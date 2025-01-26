from itertools import permutations
from timeit import default_timer as timer


def parse_input():
    with open("src/inputs/2015/09/day.09.input.txt", "r") as file:
        distances = [line.split(" ") for line in file.readlines()]

        distance_lookup = {}

        for (start, _, finish, _, distance) in distances:
            if not distance_lookup.get(start):
                distance_lookup[start] = {}

            if not distance_lookup.get(finish):
                distance_lookup[finish] = {}

            distance_lookup[start][finish] = int(distance)
            distance_lookup[finish][start] = int(distance)

        return distance_lookup


def part1():
    distance_lookup = parse_input()
    cities = distance_lookup.keys()

    min_distance = None

    for route in permutations(cities):
        distance = 0

        for i in range(1, len(cities)):
            distance += distance_lookup[route[i - 1]][route[i]]

        if min_distance is None or distance < min_distance:
            min_distance = distance

    return min_distance


def part2():
    distance_lookup = parse_input()
    cities = distance_lookup.keys()

    max_distance = None

    for route in permutations(cities):
        distance = 0

        for i in range(1, len(cities)):
            distance += distance_lookup[route[i - 1]][route[i]]

        if max_distance is None or distance > max_distance:
            max_distance = distance

    return max_distance


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
