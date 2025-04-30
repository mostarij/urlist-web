/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface List {
    id: string;
    title: string;
    description?: string;
    items: ListItem[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface ListItem {
    id: string;
    content: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    lists: List[];
  }
}
