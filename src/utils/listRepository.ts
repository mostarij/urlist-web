import { query, transaction } from './db';
import type { List, ListItem } from './list';

export async function createList(
  userId: string,
  title: string,
  description?: string
): Promise<List> {
  const result = await query<List>(
    `INSERT INTO lists (user_id, title, description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, title, description]
  );
  return result.rows[0];
}

export async function getList(id: string): Promise<List | null> {
  const result = await query<List>(
    `SELECT l.*, array_agg(li.*) as items
     FROM lists l
     LEFT JOIN list_items li ON li.list_id = l.id
     WHERE l.id = $1
     GROUP BY l.id`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updateList(
  id: string,
  { title, description }: Partial<List>
): Promise<List | null> {
  const result = await query<List>(
    `UPDATE lists
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id, title, description]
  );
  return result.rows[0] || null;
}

export async function deleteList(id: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM lists WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rowCount > 0;
}

export async function addListItem(
  listId: string,
  content: string
): Promise<ListItem> {
  const result = await query<ListItem>(
    `INSERT INTO list_items (list_id, content)
     VALUES ($1, $2)
     RETURNING *`,
    [listId, content]
  );
  return result.rows[0];
}

export async function updateListItem(
  id: string,
  { content, completed }: Partial<ListItem>
): Promise<ListItem | null> {
  const result = await query<ListItem>(
    `UPDATE list_items
     SET content = COALESCE($2, content),
         completed = COALESCE($3, completed),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id, content, completed]
  );
  return result.rows[0] || null;
}

export async function deleteListItem(id: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM list_items WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rowCount > 0;
}

export async function getUserLists(userId: string): Promise<List[]> {
  const result = await query<List>(
    `SELECT l.*, array_agg(li.*) as items
     FROM lists l
     LEFT JOIN list_items li ON li.list_id = l.id
     WHERE l.user_id = $1
     GROUP BY l.id
     ORDER BY l.created_at DESC`,
    [userId]
  );
  return result.rows;
}
