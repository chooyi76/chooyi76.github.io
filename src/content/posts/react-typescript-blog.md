# 블로그를 React와 TypeScript로 바꾸며

GitHub Pages 블로그를 Jekyll에서 React와 TypeScript 기반 구조로 바꿨습니다.

이번 구조의 목표는 단순합니다.

- React 컴포넌트가 어떻게 화면을 나누는지 익히기
- TypeScript 타입으로 글 데이터를 안전하게 관리하기
- Markdown으로 글을 작성하고 React에서 렌더링하기
- Vite 빌드 결과물을 GitHub Pages에 자동 배포하기

## 글을 추가하는 흐름

새 글을 작성할 때는 `src/content/posts` 폴더에 Markdown 파일을 만들고,
`src/data/posts.ts`에 메타데이터를 추가합니다.

```ts
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

처음에는 이 방식이 조금 수동적으로 보일 수 있지만, React와 TypeScript의 데이터 흐름을
확인하기 쉽다는 장점이 있습니다. 나중에 글이 많아지면 자동 인덱싱 구조로 확장할 수 있습니다.

## 앞으로 기록할 내용

React의 컴포넌트 분리, 상태 관리, 라우팅, 배포 자동화처럼 실제 블로그를 관리하면서 마주치는
내용을 하나씩 정리할 예정입니다.
