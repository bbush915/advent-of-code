from timeit import default_timer as timer


def parse_input():
    with open("src/inputs/2015/01/day.01.input.txt", "r") as file:
        return file.readline()


def part1():
    instructions = parse_input()

    current_floor = 0

    for character in instructions:
        match character:
            case '(':
                current_floor += 1
            case ')':
                current_floor -= 1

    return current_floor


def part2():
    instructions = parse_input()

    current_floor = 0

    for (index, character) in enumerate(instructions):
        match character:
            case '(':
                current_floor += 1
            case ')':
                if current_floor == 0:
                    return index + 1

                current_floor -= 1

    return -1


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
