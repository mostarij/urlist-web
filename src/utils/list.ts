export interface List {
  id: string;
  title: string;
  description?: string;
  items: ListItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ListItem {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creates a new list with the given title and description
 */
export function createList(title: string, description?: string): List {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Adds a new item to the list
 */
export function addListItem(list: List, content: string): List {
  const newItem: ListItem = {
    id: crypto.randomUUID(),
    content,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    ...list,
    items: [...list.items, newItem],
    updatedAt: new Date(),
  };
}

/**
 * Toggles the completed status of a list item
 */
export function toggleListItem(list: List, itemId: string): List {
  return {
    ...list,
    items: list.items.map((item) =>
      item.id === itemId
        ? { ...item, completed: !item.completed, updatedAt: new Date() }
        : item
    ),
    updatedAt: new Date(),
  };
}
