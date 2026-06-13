# chooyi76 Blog

개발 기록을 남기는 GitHub Pages 블로그입니다.

- 블로그 주소: <https://chooyi76.github.io>
- 저장소: <https://github.com/chooyi76/chooyi76.github.io>

## 로컬에서 실행하기

Ruby와 Bundler가 설치되어 있다면 아래 명령으로 로컬에서 확인할 수 있습니다.

```bash
bundle install
bundle exec jekyll serve
```

실행 후 <http://localhost:4000>에서 확인합니다.

## 새 글 작성하기

`_posts/YYYY-MM-DD-title.md` 형식으로 Markdown 파일을 만들고 아래처럼 front matter를 추가합니다.

```markdown
---
layout: post
title: "글 제목"
date: 2026-06-13 00:00:00 +0900
categories: blog
tags: [tag]
---
```
