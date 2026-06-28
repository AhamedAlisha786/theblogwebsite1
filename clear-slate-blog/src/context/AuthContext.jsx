import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("currentUser_id");
    const name = localStorage.getItem("currentName");

    if (id && name) {
      setUser({ id, name });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("currentUser_id", userData.id);
    localStorage.setItem("currentName", userData.name);
    localStorage.setItem("currentUser","user");

    setUser({ id: userData.id, name: userData.name });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const isAdmin = user?.role === "ADMIN"; // optional

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);