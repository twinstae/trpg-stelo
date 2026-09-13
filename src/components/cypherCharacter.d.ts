export interface Character {
  name: string,
  statement: {
    descriptor: string
    type: string
    focus: string
  }
  stats: {
    tier: number
    effort: number
    xp: number
    might: Stat
    speed: Stat
    intellect: Stat
    armor: {
      cost: number,
      value: number,
    }
    recoveryBonus: number
    recoveryRolls: {
      "oneAction": boolean,
      "tenMintues": boolean,
      "oneHour": boolean,
      "tenHour": boolean,
    }
    // Cypher System 2E wound track (light/medium/severe boxes). Optional so
    // 1E sheets (which track damage as pool loss instead) are unaffected.
    wounds?: {
      light: number
      medium: number
      severe: number
    }
  }
  advancements: {
    increaseCapabilities: boolean,
    extraEffort: boolean,
    moveTowardPerfection: boolean,
    skillTraining: boolean,
    other: boolean
  }
  attacks: Attack[]
  skills: Skill[]
  specialAbilities: SpecialAbility[]
  cypherLimit: number
  cyphers: Cypher[]
  equipments: Equipment[]
  shins: number
  // Display label for the shins count (e.g. "쉰", "은화"). Defaults to "쉰".
  currencyLabel?: string
  artifacts: Artifact[]
  oddities: Equipment[]
  background: string
  notes: string
  image: string
}

export interface Stat {
  current: number
  pool: number
  edge: number
}
export interface Skill {
  title: string
  level: "trained" | "specialized" | "inability" | string
}

export interface Attack {
  title: string
  description: string
  damage: number
  modifier: number
}

export interface SpecialAbility {
  title: string
  description: string
}

export interface Cypher {
  title: string
  description: string
  level: number
  used: boolean
}

export interface Equipment {
  title: string
  description: string
}

export interface Artifact {
  title: string
  description: string
  level: number
  depleted: boolean
}
