import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { usePosts } from '../context/PostsContext';
import { usePosts } from '../context/PostsContext';  // ← uncomment                // ← uncomment
import { categories } from '../data/mockData';



export default function WritePostPage() {
  // const { user } = useAuth();
  const { addPost } = usePosts();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const autherId = localStorage.getItem("currentUser_id");
  const autherName = localStorage.getItem("currentName");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    addPost({
      title: title.trim(),
      excerpt: content.trim().slice(0, 120) + '...',
      content: content.trim(),
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
      category,
      authorId: autherId ,
      // authorName: autherName,
      date: new Date().toISOString().split('T')[0],
  });
    navigate('/');
  };

  return (
    <div className="form-page form-page--wide">
      <h1>Write a Post</h1>
      <p>Share your thoughts with the world</p>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your post title" />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Cover Image URL</label>
          <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your story..." />
        </div>
        <button type="submit" className="form-submit">Publish Post</button>
      </form>
    </div>
  );
}
