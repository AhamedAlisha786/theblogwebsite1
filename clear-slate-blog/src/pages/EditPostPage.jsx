import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../data/mockData';
import { getData } from '../api/postServices';      // ✅ added
import axiosInstance from '../api/axiosInstances';  // ✅ added
import Spinner from '../components/Spinner';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);           // ✅ local state instead of context
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);      // ✅ added for submit feedback

  // ✅ Fetch post from API instead of context
  useEffect(() => {
    getData()
      .then((data) => {
        const found = data.find((p) => String(p.id) === String(id));
        if (found) {
          setPost(found);
          setTitle(found.title);
          setCategory(found.category);
          setCoverImage(found.coverImage);
          setContent(found.content);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!post) return <div className="container empty-state"><h2>Post not found</h2></div>;

  // ✅ Call PUT /api/posts/update/{id} instead of context updatePost
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.put(`/api/posts/update/${id}`, {
        title: title.trim(),
        excerpt: content.trim().slice(0, 120) + '...',
        content: content.trim(),
        coverImage: coverImage.trim() || post.coverImage,
        category,
      });
      navigate('/my-posts');
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update post. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="form-page form-page--wide">
      <h1>Edit Post</h1>
      <p>Update your post</p>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Cover Image URL</label>
          <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <button type="submit" className="form-submit">Save Changes</button>
      </form>
    </div>
  );
}
