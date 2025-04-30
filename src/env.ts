interface Env {
  DATABASE_URL: string;
  APP_URL: string;
  SESSION_SECRET: string;
}

function validateEnv(): Env {
  const required = ['DATABASE_URL', 'APP_URL', 'SESSION_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    APP_URL: process.env.APP_URL!,
    SESSION_SECRET: process.env.SESSION_SECRET!,
  };
}

const env = validateEnv();
export default env;
