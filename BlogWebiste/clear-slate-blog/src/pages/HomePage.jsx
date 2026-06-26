import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import { categories } from '../data/mockData';
import { getData } from '../api/postServices';

const POSTS_PER_PAGE = 6;

function PostCard({ post }) {
  const categoryClass = `badge badge--${post.category.toLowerCase()}`;

  return (
    <Link to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
      <div className="post-card">
        <img src={post.coverImage} alt={post.title} className="post-card__image" />
        <div className="post-card__body">
          <div className="post-card__meta">
            <span className={categoryClass}>{post.category}</span>
          </div>
          <h2 className="post-card__title">{post.title}</h2>
          <p className="post-card__excerpt">{post.excerpt}</p>
          <div className="post-card__footer">
            <div className="post-card__author">
              <div>
                <div className="post-card__date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
            <div className="post-card__likes">♥ {post.likes}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCards() {
  return (
    <div className="posts-grid">
      {[1, 2, 3, 4].map((i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton skeleton-card__img" />
          <div className="skeleton-card__body">
            <div className="skeleton skeleton-card__line skeleton-card__line--short" />
            <div className="skeleton skeleton-card__line skeleton-card__line--title" />
            <div className="skeleton skeleton-card__line" />
            <div className="skeleton skeleton-card__line skeleton-card__line--short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  // const { posts } = usePosts();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]); // ✅ add this

  useEffect(() => {
  const fetchPosts = async () => {
    try {
      const data = await getData(); // ✅ calling API layer
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, []);

  const filtered = category === 'All' ? posts : posts.filter((p) => p.category === category);
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paged = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  useEffect(() => { setPage(1); }, [category]);

  return (
    <div className="container">
      <div className="home-header">
        <h1>Latest Posts</h1>
        <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <SkeletonCards />
      ) : paged.length === 0 ? (
        <div className="empty-state">
          <h2>No posts found</h2>
          <p>Try a different category or write the first post!</p>
        </div>
      ) : (
        <>
          <div className="posts-grid">
            {paged.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
