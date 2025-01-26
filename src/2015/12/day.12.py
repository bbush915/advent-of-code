from json import dumps, loads
from timeit import default_timer as timer
from typing import Any

sum = 0


def parse_input():
    pass


def part1():
    global sum

    sum = 0

    with open("src/inputs/2015/12/day.12.input.txt", "r") as file:
        loads(file.read(), parse_int=sum_parse_int)

    return sum


def part2():
    global sum

    sum = 0

    with open("src/inputs/2015/12/day.12.input.txt", "r") as file:
        loads(dumps(loads(
            file.read(), object_hook=ignore_red_object_hook)), parse_int=sum_parse_int)

    return sum


def sum_parse_int(value: str) -> int:
    global sum

    sum += int(value)
    return int(value)


def ignore_red_object_hook(object: dict) -> Any:
    if "red" in object.values():
        return dict()

    return object


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
