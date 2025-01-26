from timeit import default_timer as timer


def parse_input():
    with open("src/inputs/2015/03/day.03.input.txt", "r") as file:
        return file.readline()


def part1():
    directions = parse_input()

    (x, y) = (0, 0)

    homes = {(0, 0): 1}

    for direction in directions:
        match direction:
            case "v":
                y -= 1
            case ">":
                x += 1
            case "<":
                x -= 1
            case "^":
                y += 1

        if homes.get((x, y)):
            homes[(x, y)] += 1
        else:
            homes[(x, y)] = 1

    return len(homes)


def part2():
    directions = parse_input()

    positions = [[0, 0], [0, 0]]
    turn = 0

    homes = {(0, 0): 2}

    for direction in directions:
        match direction:
            case "v":
                positions[turn][1] -= 1
            case ">":
                positions[turn][0] += 1
            case "<":
                positions[turn][0] -= 1
            case "^":
                positions[turn][1] += 1

        key = (positions[turn][0], positions[turn][1])

        if homes.get(key):
            homes[key] += 1
        else:
            homes[key] = 1

        turn = 1 - turn

    return len(homes)


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
