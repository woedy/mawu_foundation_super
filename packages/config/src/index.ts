import fs from 'node:fs';
import path from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().optional(),
    API_PORT: z.coerce.number().int().positive().default(3001),
    STRIPE_SECRET_KEY: z
      .string()
      .min(1, 'STRIPE_SECRET_KEY is required to process payments.')
      .optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    CLIENT_URL: z.string().url().optional()
  })
  .transform((value) => ({
    ...value,
    API_PORT: value.PORT ?? value.API_PORT
  }));

export type AppEnv = z.infer<typeof envSchema>;

export interface LoadEnvOptions {
  /** Optional working directory used as the starting point for locating the .env file. */
  cwd?: string;
  /** Optional mode suffix (e.g. "development" loads `.env.development`). */
  mode?: string;
}

const findEnvFile = (cwd: string, mode?: string): string | undefined => {
  const filenames = mode ? [`.env.${mode}`, '.env'] : ['.env'];
  const visited = new Set<string>();
  let current = path.resolve(cwd);

  while (!visited.has(current)) {
    visited.add(current);
    for (const filename of filenames) {
      const candidate = path.join(current, filename);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return undefined;
};

/** Loads environment variables using dotenv and validates them with zod. */
export const loadEnvConfig = (options: LoadEnvOptions = {}): AppEnv => {
  const cwd = options.cwd ?? process.cwd();
  const envFile = findEnvFile(cwd, options.mode);

  if (envFile) {
    loadDotenv({ path: envFile, override: true });
  } else {
    loadDotenv();
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${formatted}`);
  }

  const data = parsed.data;

  if (!data.STRIPE_SECRET_KEY) {
    const message =
      data.NODE_ENV === 'production'
        ? 'STRIPE_SECRET_KEY must be configured before running in production.'
        : 'STRIPE_SECRET_KEY is not set. Stripe features will be disabled until a key is provided.';

    if (data.NODE_ENV === 'production') {
      throw new Error(`Invalid environment configuration:\nSTRIPE_SECRET_KEY: ${message}`);
    }

    console.warn(message);
  }

  return data;
};
