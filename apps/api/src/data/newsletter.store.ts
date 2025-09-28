import { randomUUID } from "node:crypto";
import { promises as fs, existsSync } from "node:fs";
import path from "node:path";

export interface NewsletterSignup {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  interests: string[];
  source?: string;
  consent: boolean;
  createdAt: string;
  updatedAt: string;
}

const storePath = path.resolve(__dirname, "../../data/newsletter-signups.json");
let cache: NewsletterSignup[] | null = null;

const loadStore = async (): Promise<NewsletterSignup[]> => {
  if (cache) {
    return cache;
  }

  if (existsSync(storePath)) {
    try {
      const raw = await fs.readFile(storePath, "utf8");
      cache = JSON.parse(raw) as NewsletterSignup[];
      return cache;
    } catch (error) {
      cache = [];
      return cache;
    }
  }

  cache = [];
  return cache;
};

const persistStore = async (entries: NewsletterSignup[]) => {
  cache = entries;
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(entries, null, 2), "utf8");
};

const normaliseInterests = (values: string[] = []) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

export interface NewsletterInput {
  email: string;
  firstName?: string;
  lastName?: string;
  interests?: string[];
  source?: string;
  consent?: boolean;
}

export const recordNewsletterSignup = async (
  input: NewsletterInput,
): Promise<NewsletterSignup> => {
  const entries = await loadStore();
  const normalizedEmail = input.email.trim().toLowerCase();
  const nowIso = new Date().toISOString();
  const interests = normaliseInterests(input.interests);
  const consent = input.consent ?? true;

  const existingIndex = entries.findIndex(
    (entry) => entry.email === normalizedEmail,
  );

  if (existingIndex >= 0) {
    const existing = entries[existingIndex];
    const updated: NewsletterSignup = {
      ...existing,
      firstName: input.firstName?.trim() || existing.firstName,
      lastName: input.lastName?.trim() || existing.lastName,
      interests: normaliseInterests([...existing.interests, ...interests]),
      source: input.source ?? existing.source,
      consent,
      updatedAt: nowIso,
    };

    entries[existingIndex] = updated;
    await persistStore(entries);
    return updated;
  }

  const record: NewsletterSignup = {
    id: randomUUID(),
    email: normalizedEmail,
    firstName: input.firstName?.trim() || undefined,
    lastName: input.lastName?.trim() || undefined,
    interests,
    source: input.source?.trim() || undefined,
    consent,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  entries.push(record);
  await persistStore(entries);
  return record;
};

