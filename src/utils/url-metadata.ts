import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export type UrlMetadata = {
  title?: string;
  description?: string;
};

export async function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const metadata: UrlMetadata = {};

    // Get title from og:title, twitter:title, or regular title tag
    metadata.title = 
      document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
      document.querySelector('title')?.textContent ||
      undefined;

    // Get description from og:description, twitter:description, or meta description
    metadata.description =
      document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
      document.querySelector('meta[name="description"]')?.getAttribute('content') ||
      undefined;

    return metadata;
  } catch (error) {
    console.error(`Error fetching metadata for ${url}:`, error);
    return {};
  }
}
