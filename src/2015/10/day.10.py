from timeit import default_timer as timer
from typing import Tuple


def parse_input():
    with open("src/inputs/2015/10/day.10.input.txt", "r") as file:
        return file.readline()


def part1():
    sequence = parse_input()

    for _ in range(40):
        sequence = look_and_say(sequence)

    return len(sequence)


def part2():
    sequence = parse_input()

    for _ in range(50):
        sequence = look_and_say(sequence)

    return len(sequence)


def get_runs(value: str) -> list[Tuple[str, int]]:
    value = value + "~"

    sequence = []

    run_character = value[0]
    run_count = 0

    for character in value:
        if character != run_character:
            sequence.append((run_character, run_count))
            run_count = 0

        run_character = character
        run_count += 1

    return sequence


def look_and_say(sequence: str) -> str:
    runs = get_runs(sequence)

    new_sequence = ""

    for run in runs:
        new_sequence += str(run[1]) + run[0]

    return new_sequence


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
