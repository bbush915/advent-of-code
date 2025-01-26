from itertools import permutations
from timeit import default_timer as timer


def parse_input():
    with open("src/inputs/2015/13/day.13.input.txt", "r") as file:
        happiness = [line[:-2].split(" ") for line in file.readlines()]

        happiness_lookup = {}

        for (x, _, direction, amount, _, _, _, _, _, _, y) in happiness:
            if not happiness_lookup.get(x):
                happiness_lookup[x] = {}

            happiness_lookup[x][y] = (
                1 if direction == "gain" else -1) * int(amount)

        return happiness_lookup


def part1():
    happiness_lookup = parse_input()
    people = happiness_lookup.keys()

    max_happiness = None

    for arrangement in permutations(people):
        happiness = 0

        for i in range(len(people)):
            happiness += happiness_lookup[arrangement[i]
                                          ][arrangement[(i + 1) % len(arrangement)]] + happiness_lookup[arrangement[i]
                                                                                                        ][arrangement[(i - 1 + len(arrangement)) % len(arrangement)]]

        if max_happiness is None or happiness > max_happiness:
            max_happiness = happiness

    return max_happiness


def part2():
    happiness_lookup = parse_input()
    
    people = list(happiness_lookup.keys())
    people.append('Me')

    max_happiness = None

    for arrangement in permutations(people):
        happiness = 0

        for i in range(len(people)):
            x = arrangement[(i - 1 + len(arrangement)) % len(arrangement)]
            y = arrangement[i]
            z = arrangement[(i + 1) % len(arrangement)]

            happiness += get_happiness(happiness_lookup,y, x) + get_happiness(happiness_lookup, y, z)

        if max_happiness is None or happiness > max_happiness:
            max_happiness = happiness

    return max_happiness

def get_happiness(lookup: dict, x: str, y: str) -> int:
    if x == "Me" or y == "Me":
        return 0

    return lookup[x][y]


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
