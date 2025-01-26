from timeit import default_timer as timer


def parse_input():
    with open("src/inputs/2015/02/day.02.input.txt", "r") as file:
        return [[int(x) for x in line[:-1].split("x")] for line in file]


def part1():
    dimensions = parse_input()
    return sum(map(required_wrapping_paper, dimensions))


def part2():
    dimensions = parse_input()
    return sum(map(required_ribbon, dimensions))


def required_wrapping_paper(lwh: list[int]):
    [l, w, h] = lwh
    return 2*l*w + 2*w*h + 2*h*l + min(l*w, w*h, h*l)


def required_ribbon(lwh: list[int]):
    [l, w, h] = lwh
    return min(2*(l+w), 2*(w+h), 2*(h+l)) + l*w*h


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
