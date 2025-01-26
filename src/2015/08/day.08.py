
from codecs import decode
from json import dumps
from timeit import default_timer as timer


def parse_input():
    with open("src/inputs/2015/08/day.08.input.txt", "r") as file:
        return [line[:-1] for line in file.readlines()]


def part1():
    list = parse_input()
    return sum(map(get_storage_difference_v1, list))


def part2():
    list = parse_input()
    return sum(map(get_storage_difference_v2, list))


def get_storage_difference_v1(value: str) -> int:
    return len(value) - (len(decode(value, "unicode_escape")) - 2)


def get_storage_difference_v2(value: str) -> int:
    return len(dumps(value)) - len(value)


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
