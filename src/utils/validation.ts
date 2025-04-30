export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    throw new ValidationError('Please enter a valid URL');
  }
}

export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-zA-Z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    throw new ValidationError('Custom URL can only contain letters, numbers, and hyphens');
  }
  if (slug.length < 3 || slug.length > 50) {
    throw new ValidationError('Custom URL must be between 3 and 50 characters');
  }
  return true;
}

export function sanitizeInput(input: string): string {
  return input.trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove control characters
}
