import type { BlogPost } from "../types/blog";

type FrontmatterValue = string | string[] | number;

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parseFrontmatter(raw: string): {
  data: Record<string, FrontmatterValue>;
  content: string;
} {
  const match = raw.match(FRONTMATTER_PATTERN);
  if (!match) {
    throw new Error("Post is missing a frontmatter block");
  }

  const [, frontmatter, content] = match;
  const data: Record<string, FrontmatterValue> = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      data[key] = rawValue
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (/^\d+$/.test(rawValue)) {
      data[key] = Number(rawValue);
    } else {
      data[key] = rawValue.replace(/^"(.*)"$/, "$1");
    }
  }

  return { data, content: content.trim() };
}

const postModules = import.meta.glob<string>("../content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default"
});

export const posts: BlogPost[] = Object.values(postModules).map((raw) => {
  const { data, content } = parseFrontmatter(raw);

  return {
    slug: String(data.slug),
    title: String(data.title),
    date: String(data.date),
    category: String(data.category),
    tags: Array.isArray(data.tags) ? data.tags : [],
    summary: String(data.summary ?? ""),
    content,
    bookTitle: typeof data.bookTitle === "string" ? data.bookTitle : undefined,
    bookAuthor:
      typeof data.bookAuthor === "string" ? data.bookAuthor : undefined,
    rating: typeof data.rating === "number" ? data.rating : undefined
  };
});
