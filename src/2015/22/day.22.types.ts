export type Spell = [SpellTypes, number, number, number, EffectTypes];

export enum SpellTypes {
  MAGIC_MISSILE,
  DRAIN,
  SHIELD,
  POISON,
  RECHARGE,
}

export enum SpellFields {
  TYPE,
  COST,
  DAMAGE,
  HEALING,
  EFFECT,
}

export type Effect = [EffectTypes, number, number];

export enum EffectTypes {
  NONE = -1,
  ARMOR_BONUS,
  DAMAGE_BONUS,
  MANA_BONUS,
}

export enum EffectFields {
  TYPE,
  LENGTH,
  VALUE,
}

export type State = number[];

export enum StateFields {
  PLAYER_HIT_POINTS,
  PLAYER_MANA_AVAILABLE,
  PLAYER_MANA_SPENT,
  BOSS_HIT_POINTS,
  BOSS_DAMAGE,
  EFFECT_1_TIMER,
  EFFECT_2_TIMER,
  EFFECT_3_TIMER,
}
