import 'dotenv/config';

export const DATABASE_URL = process.env.DATABASE_URL!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
