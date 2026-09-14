#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function loadEnvLocal(path = ".env.local") {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] === undefined) {
      process.env[key] = rawValue.replace(/^["'](.*)["']$/, "$1");
    }
  }
}

loadEnvLocal();

const query = process.argv.slice(2).join(" ").trim();
const apiKey = process.env.KAKAO_REST_API_KEY;

if (!query) {
  console.error("사용법: npm run new-book -- <ISBN 또는 책 제목>");
  process.exit(1);
}

if (!apiKey) {
  console.error(
    "KAKAO_REST_API_KEY가 설정되어 있지 않습니다.\n" +
      "카카오 디벨로퍼스(https://developers.kakao.com)에서 앱을 만들고 발급받은\n" +
      "REST API 키를 프로젝트 루트의 .env.local 파일에 아래처럼 추가한 뒤 다시 실행하세요.\n\n" +
      "  KAKAO_REST_API_KEY=발급받은키\n"
  );
  process.exit(1);
}

const isIsbn = /^[\d-]{10,17}$/.test(query);
const searchParams = new URLSearchParams({
  query: query.replace(/-/g, ""),
  size: "1",
  ...(isIsbn ? { target: "isbn" } : {})
});

const response = await fetch(
  `https://dapi.kakao.com/v3/search/book?${searchParams}`,
  { headers: { Authorization: `KakaoAK ${apiKey}` } }
);

if (!response.ok) {
  const body = await response.text();
  console.error(`카카오 책 검색 API 호출 실패 (HTTP ${response.status})`);
  console.error(body);
  process.exit(1);
}

const result = await response.json();
const item = result.documents?.[0];

if (!item) {
  console.error(`"${query}"에 대한 검색 결과가 없습니다.`);
  process.exit(1);
}

const isbnCandidates = (item.isbn ?? "").split(" ").filter(Boolean);
const isbn13 = isbnCandidates.find((value) => value.length === 13);
const isbn = isbn13 ?? isbnCandidates[0] ?? "";
const title = item.title ?? query;
const authors = (item.authors ?? []).join(", ");
const cover = (item.thumbnail ?? "").replace(/^http:/, "https:");

const slug = `book-${isbn || Date.now()}`;
const filePath = join("src", "content", "posts", `${slug}.md`);

if (existsSync(filePath)) {
  console.error(`이미 존재하는 파일입니다: ${filePath}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const frontmatterLines = [
  "---",
  `slug: ${slug}`,
  `title: 『${title}』을 읽고`,
  `date: ${today}`,
  "category: book-review",
  "tags: [book]",
  "summary: ",
  `bookTitle: ${title}`,
  `bookAuthor: ${authors}`,
  "rating: ",
  ...(cover ? [`cover: "${cover}"`] : []),
  ...(isbn ? [`isbn: "${isbn}"`] : []),
  "---",
  "",
  ""
];

writeFileSync(filePath, frontmatterLines.join("\n"));

console.log(`생성됨: ${filePath}`);
console.log(`제목: ${title}`);
console.log(`저자: ${authors || "(정보 없음)"}`);
console.log(`표지: ${cover || "(정보 없음)"}`);
console.log("");
console.log("summary / rating / 본문을 채운 뒤 커밋하세요.");
