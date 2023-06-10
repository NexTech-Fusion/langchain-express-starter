import { env } from '../utils/env';

export const fileSystemsConfig = {
  defaultDisk: env('FILESYSTEM_DEFAULT_DISK', 'local'),

  disks: {
    local: {
      root: 'public',
    },
  },
};
