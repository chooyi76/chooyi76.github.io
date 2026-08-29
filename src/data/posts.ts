import reactTypeScriptBlog from "../content/posts/react-typescript-blog.md?raw";
import cleanCodeReview from "../content/posts/clean-code-review.md?raw";
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
  },
  {
    slug: "clean-code-review",
    title: "『클린 코드』를 읽고",
    date: "2026-08-29",
    category: "book-review",
    tags: ["book", "clean-code", "review"],
    summary: "가독성 좋은 코드를 쓰는 습관에 대해 다시 생각하게 해준 책.",
    content: cleanCodeReview,
    bookTitle: "클린 코드",
    bookAuthor: "로버트 C. 마틴",
    rating: 4
  }
];
