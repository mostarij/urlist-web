export interface UrlList {
  id: string;
  userId: string;
  title: string;
  customSlug?: string;
  generatedSlug: string;
  isPublished: boolean;
  items?: UrlItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UrlItem {
  id: string;
  listId: string;
  url: string;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUrlListInput = {
  title: string;
  customSlug?: string;
};

export type CreateUrlItemInput = {
  url: string;
  title?: string;
  description?: string;
};

export type UpdateUrlListInput = Partial<{
  title: string;
  customSlug: string;
  isPublished: boolean;
}>;

export type UpdateUrlItemInput = Partial<{
  url: string;
  title: string;
  description: string;
}>;
