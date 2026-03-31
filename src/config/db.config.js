import { Client } from 'pg';

import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  password: process.env.PASSWORD,
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  port: process.env.PORT,
});

console.log({
  password: process.env.PASSWORD,
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  port: process.env.PORT,
});

export default client;
