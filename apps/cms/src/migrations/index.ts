import * as migration_20260327_135847 from './20260327_135847';
import * as migration_20260328_111033 from './20260328_111033';
import * as migration_20260329_191634 from './20260329_191634';

export const migrations = [
  {
    up: migration_20260327_135847.up,
    down: migration_20260327_135847.down,
    name: '20260327_135847',
  },
  {
    up: migration_20260328_111033.up,
    down: migration_20260328_111033.down,
    name: '20260328_111033',
  },
  {
    up: migration_20260329_191634.up,
    down: migration_20260329_191634.down,
    name: '20260329_191634'
  },
];
