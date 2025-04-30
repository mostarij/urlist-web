import { query } from '../utils/db';
import type { UrlList, UrlItem, CreateUrlListInput, CreateUrlItemInput, UpdateUrlListInput, UpdateUrlItemInput } from '../types/url-list';
import { generateSlug } from '../utils/slug';
import { randomUUID } from 'crypto';

export async function createUrlList(userId: string, input: CreateUrlListInput): Promise<UrlList> {
  let customSlug = input.customSlug;
  let generatedSlug = await generateSlug(input.title);
  
  // If custom slug is provided, validate its uniqueness
  if (customSlug) {
    const exists = await isSlugTaken(customSlug);
    if (exists) {
      // Append random suffix if slug is taken
      customSlug = `${customSlug}-${Math.random().toString(36).substring(2, 7)}`;
    }
  }
  
  const result = await query<UrlList>(
    `INSERT INTO url_lists (user_id, title, custom_slug, generated_slug)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, input.title, customSlug, generatedSlug]
  );
  
  return result.rows[0];
}

async function isSlugTaken(slug: string): Promise<boolean> {
  const result = await query(
    'SELECT EXISTS(SELECT 1 FROM url_lists WHERE custom_slug = $1)',
    [slug]
  );
  return result.rows[0].exists;
}

export async function getUrlList(slugOrId: string): Promise<UrlList | null> {
  const result = await query<UrlList>(
    `SELECT l.*, array_agg(i.*) as items
     FROM url_lists l
     LEFT JOIN url_items i ON i.list_id = l.id
     WHERE l.id::text = $1 OR l.custom_slug = $1 OR l.generated_slug = $1
     GROUP BY l.id`,
    [slugOrId]
  );
  
  return result.rows[0] || null;
}

export async function getUserUrlLists(userId: string): Promise<UrlList[]> {
  const result = await query<UrlList>(
    `SELECT l.*, array_agg(i.*) as items
     FROM url_lists l
     LEFT JOIN url_items i ON i.list_id = l.id
     WHERE l.user_id = $1
     GROUP BY l.id
     ORDER BY l.created_at DESC`,
    [userId]
  );
  
  return result.rows;
}

export async function updateUrlList(id: string, input: UpdateUrlListInput): Promise<UrlList | null> {
  const result = await query<UrlList>(
    `UPDATE url_lists
     SET title = COALESCE($2, title),
         custom_slug = COALESCE($3, custom_slug),
         is_published = COALESCE($4, is_published)
     WHERE id = $1
     RETURNING *`,
    [id, input.title, input.customSlug, input.isPublished]
  );
  
  return result.rows[0] || null;
}

export async function deleteUrlList(id: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM url_lists WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rowCount > 0;
}

export async function addUrlItem(listId: string, input: CreateUrlItemInput): Promise<UrlItem> {
  const result = await query<UrlItem>(
    `INSERT INTO url_items (list_id, url, title, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [listId, input.url, input.title || null, input.description || null]
  );
  
  return result.rows[0];
}

export async function updateUrlItem(id: string, input: UpdateUrlItemInput): Promise<UrlItem | null> {
  const result = await query<UrlItem>(
    `UPDATE url_items
     SET url = COALESCE($2, url),
         title = COALESCE($3, title),
         description = COALESCE($4, description)
     WHERE id = $1
     RETURNING *`,
    [id, input.url, input.title, input.description]
  );
  
  return result.rows[0] || null;
}

export async function deleteUrlItem(id: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM url_items WHERE id = $1 RETURNING id',
    [id]
  );
  
  return result.rowCount > 0;
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  const result = await query(
    'SELECT EXISTS(SELECT 1 FROM url_lists WHERE custom_slug = $1 OR generated_slug = $1)',
    [slug]
  );
  return !result.rows[0].exists;
}
