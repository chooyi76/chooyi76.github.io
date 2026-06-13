# chooyi76 Blog

React, TypeScript, Vite로 관리하는 GitHub Pages 블로그입니다.

- 블로그 주소: <https://chooyi76.github.io>
- 저장소: <https://github.com/chooyi76/chooyi76.github.io>

## 기술 스택

- React
- TypeScript
- Vite
- React Markdown
- GitHub Actions + GitHub Pages

## 로컬에서 실행하기

```bash
npm install
npm run dev
```

실행 후 터미널에 표시되는 로컬 주소에서 확인합니다.

## 배포 빌드 확인

```bash
npm run build
npm run preview
```

`main` 브랜치에 push하면 GitHub Actions가 `npm run build`를 실행하고 `dist` 결과물을 GitHub Pages에 배포합니다.

## 새 글 작성하기

1. `src/content/posts/new-post.md` 파일을 만듭니다.
2. `src/data/posts.ts`에서 Markdown 파일을 import합니다.
3. `posts` 배열에 글 메타데이터를 추가합니다.

```ts
import newPost from "../content/posts/new-post.md?raw";

{
  slug: "new-post",
  title: "새 글 제목",
  date: "2026-06-13",
  category: "blog",
  tags: ["react", "typescript"],
  summary: "글 목록에 표시될 짧은 설명",
  content: newPost
}
```
