import { useState } from 'react';
import { usePosts } from '../context/PostsContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const { user, getAllUsers, blockUser, unblockUser } = useAuth();
  const { posts, comments, deletePost, deleteComment } = usePosts();
  const [activeTab, setActiveTab] = useState('dashboard');

  const users = getAllUsers();
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);

  const stats = [
    { label: 'Total Posts', value: posts.length, icon: '📝' },
    { label: 'Total Users', value: users.length, icon: '👥' },
    { label: 'Total Comments', value: comments.length, icon: '💬' },
    { label: 'Total Likes', value: totalLikes, icon: '❤️' },
  ];

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <span className="admin-badge">Admin</span>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <span className="admin-stat-icon">{s.icon}</span>
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['dashboard', 'posts', 'users', 'comments'].map((tab) => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="admin-section">
          <h2>Recent Activity</h2>
          <div className="admin-activity">
            {posts.slice(0, 5).map((p) => (
              <div key={p.id} className="admin-activity-item">
                <span className="admin-activity-icon">📝</span>
                <div className="admin-activity-info">
                  <strong>{p.authorName}</strong> published "<Link to={`/post/${p.id}`}>{p.title}</Link>"
                  <div className="admin-activity-date">{p.date}</div>
                </div>
              </div>
            ))}
            {comments.slice(-5).reverse().map((c) => (
              <div key={c.id} className="admin-activity-item">
                <span className="admin-activity-icon">💬</span>
                <div className="admin-activity-info">
                  <strong>{c.authorName}</strong> commented: "{c.text.substring(0, 60)}..."
                  <div className="admin-activity-date">{c.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="admin-section">
          <h2>All Posts ({posts.length})</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Likes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td><Link to={`/post/${p.id}`}>{p.title}</Link></td>
                    <td>{p.authorName}</td>
                    <td><span className={`badge badge--${p.category.toLowerCase()}`}>{p.category}</span></td>
                    <td>{p.date}</td>
                    <td>{p.likes}</td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/edit/${p.id}`}><button className="btn-edit">Edit</button></Link>
                        <button className="btn-delete" onClick={() => deletePost(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>All Users ({users.length})</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Posts</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const userPosts = posts.filter((p) => p.authorId === u.id).length;
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar">{u.name.split(' ').map(n => n[0]).join('')}</div>
                          {u.name}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{userPosts}</td>
                      <td><span className={`admin-role-badge ${u.role === 'admin' ? 'admin-role-badge--admin' : ''}`}>{u.role || 'user'}</span></td>
                      <td>
                        <span className={`admin-status ${u.blocked ? 'admin-status--blocked' : 'admin-status--active'}`}>
                          {u.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td>
                        {u.id !== user.id && (
                          u.blocked
                            ? <button className="btn-edit" onClick={() => unblockUser(u.id)}>Unblock</button>
                            : <button className="btn-delete" onClick={() => blockUser(u.id)}>Block</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === 'comments' && (
        <div className="admin-section">
          <h2>All Comments ({comments.length})</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Comment</th>
                  <th>Post</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((c) => {
                  const post = posts.find((p) => p.id === c.postId);
                  return (
                    <tr key={c.id}>
                      <td>{c.authorName}</td>
                      <td className="admin-comment-text">{c.text.substring(0, 80)}{c.text.length > 80 ? '...' : ''}</td>
                      <td>{post ? <Link to={`/post/${post.id}`}>{post.title.substring(0, 30)}...</Link> : 'Deleted'}</td>
                      <td>{c.date}</td>
                      <td>
                        <button className="btn-delete" onClick={() => deleteComment(c.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
