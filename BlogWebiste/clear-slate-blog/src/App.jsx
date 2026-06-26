import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import SinglePostPage from './pages/SinglePostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePostPage from './pages/WritePostPage';
import MyPostsPage from './pages/MyPostsPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <PostsProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<SinglePostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/write" element={<WritePostPage />} />
          <Route path="/my-posts" element={<ProtectedRoute><MyPostsPage /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PostsProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
