import { query } from '../utils/db';
import { randomUUID } from 'crypto';

export interface CreateUserInput {
  name: string;
  email: string;
}

export async function createUser(input: CreateUserInput) {
  const id = randomUUID();
  const result = await query(
    `INSERT INTO users (id, name, email)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [id, input.name, input.email]
  );
  return result.rows[0];
}

export async function getOrCreateDemoUser() {
  const email = 'demo@urlist.dev';
  
  // Try to get existing demo user
  const existingUser = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows[0]) {
    return existingUser.rows[0];
  }

  // Create new demo user
  return createUser({
    name: 'Demo User',
    email: email
  });
}
