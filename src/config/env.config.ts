import * as env from 'env-var';
import { config } from 'dotenv';

config();

export const NODE_ENV = env.get('NODE_ENV').asString();
export const PORT = env.get('PORT').required().asInt();
export const DATABASE_URL = env.get('DATABASE_URL').required().asString();
