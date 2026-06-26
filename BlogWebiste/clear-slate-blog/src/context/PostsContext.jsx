import { createContext, useContext, useState } from 'react';
import { initialPosts, initialComments } from '../data/mockData';
import { addPost as addPostAPI } from '../api/postServices'; // ← ADD THIS

const PostsContext = createContext(null);

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(initialPosts);
  const [comments, setComments] = useState(initialComments);
  const [likedMap, setLikedMap] = useState({});

  const addPost = async (post) => {          // ← CHANGED: now async
    const newPost = await addPostAPI(post);  // ← Step 1: send to backend
    setPosts((prev) => [newPost, ...prev]);  // ← Step 2: update context state
  };


  const updatePost = (id, data) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleLike = (postId, userId) => {
    setLikedMap((prev) => {
      const set = new Set(prev[postId] || []);
      if (set.has(userId)) set.delete(userId);
      else set.add(userId);
      return { ...prev, [postId]: set };
    });
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const set = likedMap[postId] || new Set();
        const liked = set.has(userId);
        return { ...p, likes: liked ? p.likes - 1 : p.likes + 1 };
      })
    );
  };

  const isLiked = (postId, userId) => {
    return likedMap[postId]?.has(userId) || false;
  };

  const addComment = (comment) => {
    setComments((prev) => [...prev, { ...comment, id: 'c-' + Date.now() }]);
  };

  const deleteComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <PostsContext.Provider value={{ posts, comments, addPost, updatePost, deletePost, toggleLike, isLiked, addComment, deleteComment }}>
      {children}
    </PostsContext.Provider>
  );
}
