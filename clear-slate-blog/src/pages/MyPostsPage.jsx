import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserData } from '../api/postServices';
import axiosInstance from '../api/axiosInstances';

export default function MyPostsPage() {
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getUserData();
        setMyPosts(data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // ✅ Delete — calls DELETE /api/posts/delete/{postId}
  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axiosInstance.delete(`/api/posts/delete/${postId}`);
      setMyPosts((prev) => prev.filter((p) => p.id !== postId)); // ✅ remove from UI instantly
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="my-posts-header">
        <h1>My Posts</h1>
        <Link to="/write">
          <button className="navbar-btn navbar-btn--primary">+ New Post</button>
        </Link>
      </div>

      {myPosts.length === 0 ? (
        <div className="empty-state">
          <h2>No posts yet</h2>
          <p>Start writing your first blog post!</p>
        </div>
      ) : (
        myPosts.map((post) => (
          <div className="my-post-card" key={post.id}>
            <img src={post.coverImage} alt={post.title} className="my-post-card__image" />
            <div className="my-post-card__info">
              <div className="my-post-card__title">{post.title}</div>
              <div className="my-post-card__meta">
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })} · {post.category} · ♥ {post.likes}
              </div>
            </div>
            <div className="my-post-card__actions">
              {/* ✅ Edit — navigates to edit page with post id */}
              <button
                className="btn-edit"
                onClick={() => navigate(`/edit/${post.id}`)}
              >
                Edit
              </button>

              {/* ✅ Delete — calls backend then removes from UI */}
              <button
                className="btn-delete"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}