import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getData } from '../api/postServices';
import Spinner from '../components/Spinner';
import axiosInstance from '../api/axiosInstances';

export default function SinglePostPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost]               = useState(null);
  const [comments, setComments]       = useState([]);
  const [liked, setLiked]             = useState(false);
  const [likeCount, setLikeCount]     = useState(0);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);

  // 1. Fetch post
  useEffect(() => {
    setLoading(true);
    getData()
      .then((data) => {
        const found = data.find((p) => String(p.id) === String(id));
        setPost(found ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // 2. Fetch comments
  useEffect(() => {
    if (!id) return;
    axiosInstance
      .get(`/api/comments/post/${id}`)
      .then((res) => setComments(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  }, [id]);

  // 3. Fetch like status
  useEffect(() => {
    if (!id || !user) return;
    axiosInstance
      .get(`/api/likes/status`, { params: { postId: id, userId: user.id } })
      .then((res) => {
        setLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      })
      .catch(console.error);
  }, [id, user]);

  // 4. Toggle like
  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.post(`/api/likes/toggle`, null, {
        params: { postId: id, userId: user.id },
      });
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  // 5. Add comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/api/comments/post`, null, {
        params: {
          text: commentText.trim(),
          postId: id,
          userId: user.id,
        },
      });
      setComments((prev) => [...prev, res.data]);
      setCommentText('');
    } catch (err) {
      console.error('Comment failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  if (!post) return (
    <div className="container empty-state">
      <h2>Post not found</h2>
      <p><Link to="/">Go back home</Link></p>
    </div>
  );

  // const initials      = post.authorName.split(' ').map((w) => w[0]).join('').slice(0, 2);
  const categoryClass = `badge badge--${post.category.toLowerCase()}`;

  return (
    <div className="single-post">
      <img src={post.coverImage} alt={post.title} className="single-post__cover" />
      <h1 className="single-post__title">{post.title}</h1>

      <div className="single-post__meta">
        {/* <div className="single-post__author">
          <div className="avatar">{initials}</div>
          <span className="single-post__author-name">{post.authorName}</span>
        </div> */}
        <span className="single-post__date">
          {new Date(post.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <span className={categoryClass}>{post.category}</span>
      </div>

      <div className="single-post__content">
        {post.content
          .split('\n')
          .filter(Boolean)
          .map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {/* Like button */}
      <button
        className={`like-btn ${liked ? 'like-btn--liked' : ''}`}
        onClick={handleLike}
        disabled={!user}
        title={!user ? 'Log in to like' : ''}
      >
        <span className="like-btn__heart">{liked ? '♥' : '♡'}</span>
        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
      </button>

      {/* Comments section */}
      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>

        {comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first!</p>
        )}

        {comments.map((c) => {
          // adjust these field names to match your CommentEntity response
          const authorName = c.user?.name ?? c.authorName ?? 'Anonymous';
          const commentInitials = authorName
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2);
          const date = c.createdAt ?? c.date;

          return (
            <div className="comment" key={c.id}>
              <div className="comment__header">
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                  {commentInitials}
                </div>
                <span className="comment__name">{authorName}</span>
                <span className="comment__date">
                  {date
                    ? new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''}
                </span>
              </div>
              <p className="comment__text">{c.comment}</p>
            </div>
          );
        })}

        {user ? (
          <form className="comment-form" onSubmit={handleComment}>
            <textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p className="comment-login-msg">
            <Link to="/login">Log in</Link> to leave a comment.
          </p>
        )}
      </div>
    </div>
  );
}