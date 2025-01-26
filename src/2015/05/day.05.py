from re import search
from timeit import default_timer as timer


def parse_input():
    with open("src/inputs/2015/05/day.05.input.txt", "r") as file:
        return file.readlines()


def part1():
    strings = parse_input()
    return len([x for x in strings if is_nice_v1(x)])


def part2():
    strings = parse_input()
    return len([x for x in strings if is_nice_v2(x)])


def is_nice_v1(value: str) -> bool:
    # It does not contain the strings ab, cd, pq, or xy.
    for substring in ["ab", "cd", "pq", "xy"]:
        if value.find(substring) >= 0:
            return False

    # It contains at least three vowels.
    property_1 = len([x for x in value if x in "aeiou"]) >= 3

    # It contains at least one letter that appears twice in a row.
    property_2 = search(r"([a-z])\1{1,}", value) is not None

    return property_1 and property_2


def is_nice_v2(value: str) -> bool:
    # It contains a pair of any two letters that appears at least twice in the
    # string without overlapping.
    property_1 = search(r"([a-z]{2}).*\1", value) is not None

    # It contains at least one letter which repeats with exactly one letter
    # between them.
    property_2 = search(r"([a-z]).\1", value) is not None

    return property_1 and property_2


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
