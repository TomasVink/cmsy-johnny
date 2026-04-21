import * as migration_20260327_135847 from './20260327_135847';
import * as migration_20260328_111033 from './20260328_111033';
import * as migration_20260329_191634 from './20260329_191634';
import * as migration_20260420_125646_map from './20260420_125646_map';
import * as migration_20260421_085311_toolkit from './20260421_085311_toolkit';
import * as migration_20260421_120647_more_localization from './20260421_120647_more_localization';

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
    name: '20260329_191634',
  },
  {
    up: migration_20260420_125646_map.up,
    down: migration_20260420_125646_map.down,
    name: '20260420_125646_map',
  },
  {
    up: migration_20260421_085311_toolkit.up,
    down: migration_20260421_085311_toolkit.down,
    name: '20260421_085311_toolkit',
  },
  {
    up: migration_20260421_120647_more_localization.up,
    down: migration_20260421_120647_more_localization.down,
    name: '20260421_120647_more_localization'
  },
];
