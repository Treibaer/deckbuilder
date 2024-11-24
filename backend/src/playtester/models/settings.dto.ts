export class SettingsDto {
  life: number;
  counters: {
    energy: number;
    poison: number;
    commanderDamage: number;
  };

  constructor(params: {
    life: number;
    counters: { energy: number; poison: number; commanderDamage: number };
  }) {
    this.life = params.life;
    this.counters = params.counters;
  }
}
