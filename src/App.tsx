import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts } from "./data/posts";
import type { BlogPost } from "./types/blog";

// `#/posts/<slug>`면 글 화면, 그 외(`#/`, `#about` 등)는 목록 화면
const getSlugFromHash = () => {
  const match = window.location.hash.match(/^#\/posts\/([^/]+)/);
  return match?.[1] ?? null;
};

const CATEGORY_LABELS: Record<string, string> = {
  blog: "블로그",
  "book-review": "독후감"
};

const categoryLabel = (category: string) =>
  CATEGORY_LABELS[category] ?? category;

const RatingStars = ({ rating }: { rating: number }) => {
  const fillPercent = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <span className="rating-stars" aria-label={`평점 ${rating}/5`}>
      <span className="rating-stars-track" aria-hidden="true">
        ☆☆☆☆☆
        <span
          className="rating-stars-fill"
          style={{ width: `${fillPercent}%` }}
        >
          ★★★★★
        </span>
      </span>
    </span>
  );
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));

function App() {
  const [selectedSlug, setSelectedSlug] = useState(getSlugFromHash);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState("all");
  const [query, setQuery] = useState("");
  const previousSlug = useRef(selectedSlug);

  useEffect(() => {
    const syncRoute = () => setSelectedSlug(getSlugFromHash());
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  // 화면(목록 ↔ 글, 글 ↔ 글)이 바뀐 직후 항상 맨 위에서 시작.
  // 렌더링 뒤에 즉시 이동하므로 스크롤 애니메이션이 레이아웃 변경에 끊기지 않음.
  useLayoutEffect(() => {
    if (previousSlug.current !== selectedSlug) {
      window.scrollTo(0, 0);
      previousSlug.current = selectedSlug;
    }
  }, [selectedSlug]);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    []
  );

  const categories = useMemo(
    () => Array.from(new Set(sortedPosts.map((post) => post.category))).sort(),
    [sortedPosts]
  );

  const tags = useMemo(
    () => Array.from(new Set(sortedPosts.flatMap((post) => post.tags))).sort(),
    [sortedPosts]
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortedPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "all" || post.category === activeCategory;
      const matchesTag = activeTag === "all" || post.tags.includes(activeTag);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [post.title, post.summary, post.category, ...post.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesTag && matchesQuery;
    });
  }, [activeCategory, activeTag, query, sortedPosts]);

  const selectedPost =
    selectedSlug === null
      ? undefined
      : sortedPosts.find((post) => post.slug === selectedSlug);

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
          <a href="#/">Posts</a>
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
          {selectedSlug === null ? (
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

              <div className="filter-row" aria-label="Category filters">
                <button
                  className={activeCategory === "all" ? "active" : ""}
                  onClick={() => setActiveCategory("all")}
                  type="button"
                >
                  전체
                </button>
                {categories.map((category) => (
                  <button
                    className={activeCategory === category ? "active" : ""}
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    type="button"
                  >
                    {categoryLabel(category)}
                  </button>
                ))}
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
          ) : selectedPost ? (
            <PostView post={selectedPost} />
          ) : (
            <section className="post-view">
              <a className="back-link" href="#/">
                ← 목록으로
              </a>
              <h2>글을 찾을 수 없어요</h2>
              <p className="post-summary">
                주소가 잘못되었거나 삭제된 글이에요.
              </p>
            </section>
          )}
        </section>
      </main>
    </>
  );
}

function PostView({ post }: { post: BlogPost }) {
  return (
    <article className="post-view">
      <a className="back-link" href="#/">
        ← 목록으로
      </a>
      <div className="post-kicker">
        <span>{categoryLabel(post.category)}</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
      <h2>{post.title}</h2>
      <p className="post-summary">{post.summary}</p>
      {post.category === "book-review" && (
        <div className="book-info">
          {post.cover && (
            <img
              className="book-cover"
              src={post.cover}
              alt={`${post.bookTitle ?? post.title} 표지`}
            />
          )}
          <div className="book-info-text">
            {post.bookTitle && (
              <span className="book-info-title">{post.bookTitle}</span>
            )}
            {post.bookAuthor && (
              <span className="book-info-author">{post.bookAuthor}</span>
            )}
            {post.rating != null && <RatingStars rating={post.rating} />}
          </div>
        </div>
      )}
      <div className="tag-row" aria-label="Selected post tags">
        {post.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <a className="post-card" href={`#/posts/${post.slug}`}>
      <span className="post-card-date">
        {categoryLabel(post.category)} · {formatDate(post.date)}
      </span>
      <h3>{post.title}</h3>
      {post.category === "book-review" && post.bookTitle && (
        <div className="post-card-book-row">
          {post.cover && (
            <img className="post-card-cover" src={post.cover} alt="" />
          )}
          <p className="post-card-book">
            {post.bookTitle}
            {post.bookAuthor ? ` · ${post.bookAuthor}` : ""}
          </p>
        </div>
      )}
      <p>{post.summary}</p>
      <span className="post-card-link">읽기</span>
    </a>
  );
}

export default App;
