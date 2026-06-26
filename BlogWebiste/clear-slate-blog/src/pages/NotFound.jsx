import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="container empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 style={{ fontSize: '48px', marginBottom: '8px' }}>404</h2>
      <p>Oops! Page not found</p>
      <p><a href="/" style={{ fontWeight: 500 }}>Return to Home</a></p>
    </div>
  );
};

export default NotFound;
