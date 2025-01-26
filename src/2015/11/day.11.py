from timeit import default_timer as timer


def parse_input():
    with open("src/inputs/2015/11/day.11.input.txt", "r") as file:
        return [ord(character) - ord("a") for character in file.readline()[:-1]]


def part1():
    password = parse_input()

    while not is_valid(password):
        increment(password)

    return "".join([chr(character + ord("a")) for character in password])


def part2():
    password = increment([ord(character) - ord("a")
                         for character in "cqjxxyzz"])

    while not is_valid(password):
        increment(password)

    return "".join([chr(character + ord("a")) for character in password])


def increment(password: list[int]) -> str:
    password[-1] += 1

    if password[-1] > 25:
        for i in range(len(password)):
            password[-1 - i] = 0
            password[-1 - (i + 1)] += 1

            if password[-1 - (i + 1)] <= 25:
                break

    return password


def is_valid(password: list[int]) -> bool:
    # Passwords may not contain the letters i, o, or l.

    if len([character for character in password if character in [8, 14, 11]]) > 0:
        return False

    # Passwords must include one increasing straight of at least three letters.

    has_straight = False

    for i in range(len(password) - 3):
        if password[i] == password[i + 1] - 1 and password[i + 1] == password[i + 2] - 1:
            has_straight = True

    if not has_straight:
        return False

    # Passwords must contain at least two different, non-overlapping pairs of letters.

    has_pairs = False
    pair_one = None

    for i in range(len(password) - 1):
        if password[i] == password[i + 1]:
            pair_one = password[i]

    for i in range(len(password) - 1):
        if password[i] == password[i + 1] and password[i] != pair_one:
            has_pairs = True

    if not has_pairs:
        return False

    return True


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
