from hashlib import md5
from timeit import default_timer as timer


def parse_input():
    with open("src/inputs/2015/04/day.04.input.txt", "r") as file:
        return file.readline()


def part1():
    secret_key = parse_input()
    return mine(secret_key, 5)


def part2():
    secret_key = parse_input()
    return mine(secret_key, 6)


def mine(secret_key: str, leading_zeroes: int):
    value = 1

    while True:
        hash = md5((secret_key + str(value)).encode()).hexdigest()

        if hash[:leading_zeroes] == "0" * leading_zeroes:
            return value

        value += 1


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
