import fs from "fs";

import { clone, toKey } from "@/utils/common";
import {
  type Effect,
  EffectFields,
  EffectTypes,
  type Spell,
  SpellFields,
  SpellTypes,
  type State,
  StateFields,
} from "./day.22.types";

const SPELLS: Spell[] = [
  [SpellTypes.MAGIC_MISSILE, 53, 4, 0, EffectTypes.NONE],
  [SpellTypes.DRAIN, 73, 2, 2, EffectTypes.NONE],
  [SpellTypes.SHIELD, 113, 0, 0, EffectTypes.ARMOR_BONUS],
  [SpellTypes.POISON, 173, 0, 0, EffectTypes.DAMAGE_BONUS],
  [SpellTypes.RECHARGE, 229, 0, 0, EffectTypes.MANA_BONUS],
];

const EFFECTS: Effect[] = [
  [EffectTypes.ARMOR_BONUS, 6, 7],
  [EffectTypes.DAMAGE_BONUS, 6, 3],
  [EffectTypes.MANA_BONUS, 5, 101],
];

function parseInput() {
  return fs
    .readFileSync("src/inputs/2015/22/day.22.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => Number(x.split(": ")[1]));
}

export function part1() {
  const boss = parseInput();

  return getMinimalWinningMana(
    [50, 500, 0, ...boss, 0, 0, 0],
    new Map<string, number>(),
    false
  );
}

export function part2() {
  const boss = parseInput();

  return getMinimalWinningMana(
    [50, 500, 0, ...boss, 0, 0, 0],
    new Map<string, number>(),
    true
  );
}

function getMinimalWinningMana(
  state: State,
  cache: Map<string, number>,
  hardMode: boolean
) {
  const key = toKey(state);

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  if (hardMode) {
    state[StateFields.PLAYER_HIT_POINTS]--;

    if (state[StateFields.PLAYER_HIT_POINTS] <= 0) {
      return Number.POSITIVE_INFINITY;
    }
  }

  // NOTE - Player Turn - Effects

  if (state[StateFields.EFFECT_1_TIMER]) {
    state[StateFields.EFFECT_1_TIMER]--;
  }

  if (state[StateFields.EFFECT_2_TIMER]) {
    state[StateFields.BOSS_HIT_POINTS] -=
      EFFECTS[EffectTypes.DAMAGE_BONUS][EffectFields.VALUE];

    state[StateFields.EFFECT_2_TIMER]--;
  }

  if (state[StateFields.EFFECT_3_TIMER]) {
    state[StateFields.PLAYER_MANA_AVAILABLE] +=
      EFFECTS[EffectTypes.MANA_BONUS][EffectFields.VALUE];

    state[StateFields.EFFECT_3_TIMER]--;
  }

  if (state[StateFields.BOSS_HIT_POINTS] <= 0) {
    cache.set(key, state[StateFields.PLAYER_MANA_SPENT]);
    return state[StateFields.PLAYER_MANA_SPENT];
  }

  let minimum = Number.POSITIVE_INFINITY;

  for (const spell of SPELLS) {
    const state_ = clone(state);

    if (state_[StateFields.PLAYER_MANA_AVAILABLE] < spell[SpellFields.COST]) {
      continue;
    }

    if (
      spell[SpellFields.EFFECT] !== EffectTypes.NONE &&
      state_[5 + spell[SpellFields.EFFECT]]
    ) {
      continue;
    }

    // NOTE - Player Turn - Action

    state_[StateFields.PLAYER_MANA_AVAILABLE] -= spell[SpellFields.COST];
    state_[StateFields.PLAYER_MANA_SPENT] += spell[SpellFields.COST];

    state_[StateFields.BOSS_HIT_POINTS] -= spell[SpellFields.DAMAGE];

    state_[StateFields.PLAYER_HIT_POINTS] += spell[SpellFields.HEALING];

    if (spell[SpellFields.EFFECT] !== EffectTypes.NONE) {
      state_[5 + spell[SpellFields.EFFECT]] =
        EFFECTS[spell[SpellFields.EFFECT]][EffectFields.LENGTH];
    }

    if (state_[StateFields.BOSS_HIT_POINTS] <= 0) {
      minimum = Math.min(state_[StateFields.PLAYER_MANA_SPENT], minimum);
      continue;
    }

    // NOTE - Boss Turn - Effects

    let armor = 0;

    if (state_[StateFields.EFFECT_1_TIMER]) {
      armor = EFFECTS[EffectTypes.ARMOR_BONUS][EffectFields.VALUE];

      state_[StateFields.EFFECT_1_TIMER]--;
    }

    if (state_[StateFields.EFFECT_2_TIMER]) {
      state_[StateFields.BOSS_HIT_POINTS] -=
        EFFECTS[EffectTypes.DAMAGE_BONUS][EffectFields.VALUE];

      state_[StateFields.EFFECT_2_TIMER]--;
    }

    if (state_[StateFields.EFFECT_3_TIMER]) {
      state_[StateFields.PLAYER_MANA_AVAILABLE] +=
        EFFECTS[EffectTypes.MANA_BONUS][EffectFields.VALUE];

      state_[StateFields.EFFECT_3_TIMER]--;
    }

    if (state_[StateFields.BOSS_HIT_POINTS] <= 0) {
      minimum = Math.min(state_[StateFields.PLAYER_MANA_SPENT], minimum);
      continue;
    }

    // NOTE - Boss Turn - Action

    const damage = Math.max(state[StateFields.BOSS_DAMAGE] - armor, 1);

    state_[StateFields.PLAYER_HIT_POINTS] -= damage;

    if (state_[StateFields.PLAYER_HIT_POINTS] <= 0) {
      continue;
    }

    minimum = Math.min(getMinimalWinningMana(state_, cache, hardMode), minimum);
  }

  cache.set(key, minimum);

  return minimum;
}
