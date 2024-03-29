import 'dotenv/config';

export const HOST = process.env.HOST!;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const SECRET_KEY = process.env.SECRET_KEY!;
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
