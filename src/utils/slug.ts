import { customAlphabet } from 'nanoid';
import slugify from 'slugify';
import { isSlugAvailable } from '../db/url-list-repository';

// Add type checking and default options for slugify
const slugifyOptions = {
  lower: true,
  strict: true,
  trim: true,
  locale: 'en'
} as const;

// Create a custom nanoid generator with a URL-safe alphabet
const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

/**
 * Generates a URL-safe slug from a title
 */
export function createSlugFromTitle(title: string): string {
  try {
    return slugify(title, slugifyOptions);
  } catch (error) {
    console.error('Error creating slug:', error);
    return generateId();
  }
}

/**
 * Generates a unique slug, either from a title or randomly
 */
export async function generateSlug(title?: string): Promise<string> {
  let slug = title ? createSlugFromTitle(title) : generateId();
  let attempts = 0;
  const maxAttempts = 10;

  // Keep trying until we find an available slug
  while (attempts < maxAttempts) {
    const suffixedSlug = attempts === 0 ? slug : `${slug}-${generateId(4)}`;
    if (await isSlugAvailable(suffixedSlug)) {
      return suffixedSlug;
    }
    attempts++;
  }

  // If all attempts fail, generate a completely random slug
  return generateId();
}
