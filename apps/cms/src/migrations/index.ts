import * as migration_20260318_151218 from './20260318_151218';

export const migrations = [
  {
    up: migration_20260318_151218.up,
    down: migration_20260318_151218.down,
    name: '20260318_151218'
  },
];
