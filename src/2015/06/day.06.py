from dataclasses import dataclass
from re import match
from timeit import default_timer as timer
from typing import Tuple


@dataclass
class Instruction:
    action: str
    top_left: Tuple[int, int]
    bottom_right: Tuple[int, int]


def to_instruction(groups: Tuple[str]):
    return Instruction(groups[0], (int(groups[1]), int(groups[2])), (int(groups[3]), int(groups[4])))


def parse_input():
    with open("src/inputs/2015/06/day.06.input.txt", "r") as file:
        return [to_instruction(match(r"(?:turn )?(on|off|toggle) (\d+),(\d+) through (\d+),(\d+)", line).groups()) for line in file.readlines()]


def part1():
    instructions = parse_input()

    count = 0

    for x in range(0, 1000):
        for y in range(0, 1000):
            state = 0

            for instruction in instructions:
                if in_rectange((x, y), instruction.top_left, instruction.bottom_right):
                    match instruction.action:
                        case "on":
                            state = 1
                        case "off":
                            state = 0
                        case "toggle":
                            state = 1 - state

            count += state

    return count


def part2():
    instructions = parse_input()

    total_brightness = 0

    for x in range(0, 1000):
        for y in range(0, 1000):
            brightness = 0

            for instruction in instructions:
                if in_rectange((x, y), instruction.top_left, instruction.bottom_right):
                    match instruction.action:
                        case "on":
                            brightness += 1
                        case "off":
                            brightness = max(0, brightness - 1)
                        case "toggle":
                            brightness += 2

            total_brightness += brightness

    return total_brightness


def in_rectange(point: Tuple[int, int], top_left: Tuple[int, int], bottom_right: Tuple[int, int]) -> bool:
    return point[0] >= top_left[0] and point[0] <= bottom_right[0] and point[1] >= top_left[1] and point[1] <= bottom_right[1]


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
