from dataclasses import dataclass
from enum import Enum, auto
from graphlib import TopologicalSorter
from timeit import default_timer as timer


class GateType(Enum):
    NOOP = auto()
    AND = auto()
    OR = auto()
    LSHIFT = auto()
    RSHIFT = auto()
    NOT = auto()


@dataclass
class Instruction:
    wire: str
    gate_type: GateType
    arguments: list[str | int]


def parse_input():
    with open("src/inputs/2015/07/day.07.input.txt", "r") as file:
        instructions = [parse_line(line) for line in file.readlines()]
        instruction_lookup = {
            instruction.wire: instruction for instruction in instructions}

        topological_sorter = TopologicalSorter()

        for instruction in instructions:
            topological_sorter.add(
                instruction.wire, *[argument for argument in instruction.arguments if not argument.isnumeric()])

        return [instruction_lookup[wire] for wire in topological_sorter.static_order()]


def parse_line(line: str) -> Instruction:
    [lhs, wire] = line[:-1].split(" -> ")
    lhs_parts = lhs.split(" ")

    match len(lhs_parts):
        case 1:
            return Instruction(wire, GateType.NOOP, [lhs_parts[0]])
        case 2:
            return Instruction(wire, GateType.NOT, [lhs_parts[1]])
        case 3:
            match lhs_parts[1]:
                case "AND":
                    return Instruction(wire, GateType.AND, [lhs_parts[0], lhs_parts[2]])
                case "OR":
                    return Instruction(wire, GateType.OR, [lhs_parts[0], lhs_parts[2]])
                case "LSHIFT":
                    return Instruction(wire, GateType.LSHIFT, [lhs_parts[0], lhs_parts[2]])
                case "RSHIFT":
                    return Instruction(wire, GateType.RSHIFT, [lhs_parts[0], lhs_parts[2]])


def part1():
    instructions = parse_input()

    signals = {}

    for instruction in instructions:
        signals[instruction.wire] = evaluate_instruction(signals, instruction)

    return signals["a"]


def part2():
    instructions = parse_input()

    signals = {"b": 16076}

    for instruction in instructions:
        if instruction.wire == "b":
            continue

        signals[instruction.wire] = evaluate_instruction(signals, instruction)

    return signals["a"]


def evaluate_instruction(signals: dict[str, int], instruction: Instruction) -> int:
    match instruction.gate_type:
        case GateType.NOOP:
            return get_signal(signals, instruction.arguments[0])
        case GateType.AND:
            return get_signal(signals, instruction.arguments[0]) & get_signal(signals, instruction.arguments[1])
        case GateType.OR:
            return get_signal(signals, instruction.arguments[0]) | get_signal(signals, instruction.arguments[1])
        case GateType.LSHIFT:
            return get_signal(signals, instruction.arguments[0]) << int(instruction.arguments[1])
        case GateType.RSHIFT:
            return get_signal(signals, instruction.arguments[0]) >> int(instruction.arguments[1])
        case GateType.NOT:
            return (1 << 16) + ~get_signal(signals, instruction.arguments[0])


def get_signal(signals: dict[str, int], argument: str | int) -> int:
    return int(argument) if argument.isnumeric() else signals[argument]


def timed(fn):
    start = timer()
    result = fn()

    return (timer() - start, result)


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} ({p1_elapsed:.3f}s)")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} ({p2_elapsed:.3f}s)")
