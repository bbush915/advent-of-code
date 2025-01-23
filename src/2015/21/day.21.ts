import fs from "fs";

import "@/utils/array";
import { clone } from "@/utils/common";

type Equipment = {
  type: EquipmentTypes;
  name: string;
  cost: number;
  damage: number;
  armor: number;
};

type Statistics = {
  hitPoints: number;
  damage: number;
  armor: number;
};

enum EquipmentTypes {
  WEAPON,
  ARMOR,
  RING,
}

const EQUIPMENT: Equipment[] = [
  {
    type: EquipmentTypes.WEAPON,
    name: "Dagger",
    cost: 8,
    damage: 4,
    armor: 0,
  },
  {
    type: EquipmentTypes.WEAPON,
    name: "Shortsword",
    cost: 10,
    damage: 5,
    armor: 0,
  },
  {
    type: EquipmentTypes.WEAPON,
    name: "Warhammer",
    cost: 25,
    damage: 6,
    armor: 0,
  },
  {
    type: EquipmentTypes.WEAPON,
    name: "Longsword",
    cost: 40,
    damage: 7,
    armor: 0,
  },
  {
    type: EquipmentTypes.WEAPON,
    name: "Greataxe",
    cost: 74,
    damage: 8,
    armor: 0,
  },
  {
    type: EquipmentTypes.ARMOR,
    name: "Leather",
    cost: 13,
    damage: 0,
    armor: 1,
  },
  {
    type: EquipmentTypes.ARMOR,
    name: "Chainmail",
    cost: 31,
    damage: 0,
    armor: 2,
  },
  {
    type: EquipmentTypes.ARMOR,
    name: "Splintmail",
    cost: 53,
    damage: 0,
    armor: 3,
  },
  {
    type: EquipmentTypes.ARMOR,
    name: "Bandedmail",
    cost: 75,
    damage: 0,
    armor: 4,
  },
  {
    type: EquipmentTypes.ARMOR,
    name: "Platemail",
    cost: 102,
    damage: 0,
    armor: 5,
  },
  {
    type: EquipmentTypes.RING,
    name: "Damage +1",
    cost: 25,
    damage: 1,
    armor: 0,
  },
  {
    type: EquipmentTypes.RING,
    name: "Damage +2",
    cost: 50,
    damage: 2,
    armor: 0,
  },
  {
    type: EquipmentTypes.RING,
    name: "Damage +3",
    cost: 100,
    damage: 3,
    armor: 0,
  },
  {
    type: EquipmentTypes.RING,
    name: "Defense +1",
    cost: 20,
    damage: 0,
    armor: 1,
  },
  {
    type: EquipmentTypes.RING,
    name: "Defense +2",
    cost: 40,
    damage: 0,
    armor: 2,
  },
  {
    type: EquipmentTypes.RING,
    name: "Defense +3",
    cost: 80,
    damage: 0,
    armor: 3,
  },
];

function parseInput(): Statistics {
  const statistics = fs
    .readFileSync("src/inputs/2015/21/day.21.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => Number(x.split(": ")[1]));

  return {
    hitPoints: statistics[0],
    damage: statistics[1],
    armor: statistics[2],
  };
}

export function part1() {
  const boss = parseInput();

  return getPossibleStatistics()
    .filter((player) => simulate([player, clone(boss)]))
    .map((x) => x.cost)
    .min();
}

export function part2() {
  const boss = parseInput();

  return getPossibleStatistics()
    .filter((player) => !simulate([player, clone(boss)]))
    .map((x) => x.cost)
    .max();
}

function getPossibleStatistics() {
  const equipmentPossibilities: Equipment[][] = [];

  // NOTE - Weapon

  for (const weapon of EQUIPMENT.filter(
    (x) => x.type === EquipmentTypes.WEAPON
  )) {
    equipmentPossibilities.push([weapon]);
  }

  // NOTE - Armor

  for (const possibility of clone(equipmentPossibilities)) {
    for (const armor of EQUIPMENT.filter(
      (x) => x.type === EquipmentTypes.ARMOR
    )) {
      equipmentPossibilities.push([...possibility, armor]);
    }
  }

  // NOTE - Rings

  for (const possibility of clone(equipmentPossibilities)) {
    const rings = EQUIPMENT.filter((x) => x.type === EquipmentTypes.RING);

    for (let i = 0; i < rings.length; i++) {
      equipmentPossibilities.push([...possibility, rings[i]]);

      for (let j = i + 1; j < rings.length; j++) {
        equipmentPossibilities.push([...possibility, rings[i], rings[j]]);
      }
    }
  }

  return equipmentPossibilities.map((equipmentPossibility) =>
    equipmentPossibility.reduce<Statistics & { cost: number }>(
      (player, equipment) => {
        player.damage += equipment.damage;
        player.armor += equipment.armor;
        player.cost += equipment.cost;

        return player;
      },
      {
        hitPoints: 100,
        damage: 0,
        armor: 0,
        cost: 0,
      }
    )
  );
}

function simulate(characters: [Statistics, Statistics]) {
  let turn = 0;

  while (1) {
    const attacker = characters[turn];
    const defender = characters[1 - turn];

    defender.hitPoints -= Math.max(attacker.damage - defender.armor, 1);

    if (defender.hitPoints <= 0) {
      return turn === 0;
    }

    turn = 1 - turn;
  }
}
