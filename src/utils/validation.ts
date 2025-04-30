export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateUrl(url: string): boolean {
  if (!url) throw new ValidationError('URL is required');
  
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new ValidationError('URL must start with http:// or https://');
    }
    return true;
  } catch (e) {
    if (e instanceof ValidationError) throw e;
    throw new ValidationError('Please enter a valid URL');
  }
}

export function validateSlug(slug: string): boolean {
  if (!slug) return true;
  
  const slugRegex = /^[a-zA-Z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    throw new ValidationError('Custom URL can only contain letters, numbers, and hyphens');
  }
  if (slug.length < 3) {
    throw new ValidationError('Custom URL must be at least 3 characters long');
  }
  if (slug.length > 50) {
    throw new ValidationError('Custom URL cannot exceed 50 characters');
  }
  if (slug.startsWith('-') || slug.endsWith('-')) {
    throw new ValidationError('Custom URL cannot start or end with a hyphen');
  }
  return true;
}

export function sanitizeInput(input: string): string {
  return input.trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove control characters
}
