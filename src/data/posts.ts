import reactTypeScriptBlog from "../content/posts/react-typescript-blog.md?raw";
import type { BlogPost } from "../types/blog";

export const posts: BlogPost[] = [
  {
    slug: "react-typescript-blog",
    title: "블로그를 React와 TypeScript로 바꾸며",
    date: "2026-06-13",
    category: "blog",
    tags: ["react", "typescript", "vite", "github-pages"],
    summary:
      "GitHub Pages 블로그를 Jekyll에서 React + TypeScript + Vite 구조로 전환한 첫 기록입니다.",
    content: reactTypeScriptBlog
  }
];
