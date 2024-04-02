import pino from 'pino';
import pretty from 'pino-pretty';

import { LOG_LEVEL } from '~/config/env.server';

export const stream = pretty({ colorize: true });

export const logger = pino(
  {
    level: LOG_LEVEL,
  },
  stream
);
