import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts } from "./data/posts";
import type { BlogPost } from "./types/blog";

const getSlugFromHash = () => {
  const match = window.location.hash.match(/^#\/posts\/([^/]+)/);
  return match?.[1] ?? posts[0]?.slug ?? "";
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));

function App() {
  const [selectedSlug, setSelectedSlug] = useState(getSlugFromHash);
  const [activeTag, setActiveTag] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const syncRoute = () => setSelectedSlug(getSlugFromHash());
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    []
  );

  const tags = useMemo(
    () => Array.from(new Set(sortedPosts.flatMap((post) => post.tags))).sort(),
    [sortedPosts]
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortedPosts.filter((post) => {
      const matchesTag = activeTag === "all" || post.tags.includes(activeTag);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [post.title, post.summary, post.category, ...post.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesTag && matchesQuery;
    });
  }, [activeTag, query, sortedPosts]);

  const selectedPost =
    sortedPosts.find((post) => post.slug === selectedSlug) ?? sortedPosts[0];

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#/">
          <span className="brand-mark">C</span>
          <span>
            <strong>chooyi76 Blog</strong>
            <small>React + TypeScript 기록장</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#posts">Posts</a>
          <a href="#about">About</a>
          <a href="https://github.com/chooyi76" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <main className="page-shell">
        <aside className="profile-panel" id="about">
          <img
            className="avatar"
            src="https://github.com/chooyi76.png"
            alt="chooyi76 GitHub avatar"
          />
          <p className="eyebrow">Developer Blog</p>
          <h1>배운 것과 해결 과정을 남기는 공간</h1>
          <p>
            Vue로 쌓은 경험 위에 React와 TypeScript 구조를 익히며, 프로젝트와
            학습 로그를 꾸준히 정리합니다.
          </p>

          <dl className="profile-meta">
            <div>
              <dt>Stack</dt>
              <dd>React, TypeScript, Vite</dd>
            </div>
            <div>
              <dt>Writing</dt>
              <dd>Markdown posts</dd>
            </div>
          </dl>
        </aside>

        <section className="content-column" aria-label="Blog content">
          <article className="post-view">
            <div className="post-kicker">
              <span>{selectedPost.category}</span>
              <time dateTime={selectedPost.date}>
                {formatDate(selectedPost.date)}
              </time>
            </div>
            <h2>{selectedPost.title}</h2>
            <p className="post-summary">{selectedPost.summary}</p>
            <div className="tag-row" aria-label="Selected post tags">
              {selectedPost.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedPost.content}
              </ReactMarkdown>
            </div>
          </article>

          <section className="post-index" id="posts" aria-label="Post list">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Archive</p>
                <h2>글 목록</h2>
              </div>
              <label className="search-field">
                <span>검색</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="제목, 태그, 요약 검색"
                  type="search"
                />
              </label>
            </div>

            <div className="filter-row" aria-label="Tag filters">
              <button
                className={activeTag === "all" ? "active" : ""}
                onClick={() => setActiveTag("all")}
                type="button"
              >
                전체
              </button>
              {tags.map((tag) => (
                <button
                  className={activeTag === tag ? "active" : ""}
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="post-grid">
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <a className="post-card" href={`#/posts/${post.slug}`}>
      <span className="post-card-date">{formatDate(post.date)}</span>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <span className="post-card-link">읽기</span>
    </a>
  );
}

export default App;
