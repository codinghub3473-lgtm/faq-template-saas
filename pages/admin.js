import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  
  const handleLogin = () => {
    if (password === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
    } else {
      alert('Wrong password!');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <h1>Admin Login</h1>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
        <p style={styles.note}>
          Default password: <strong>admin123</strong>
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      <div style={styles.card}>
        <h2>Welcome to Admin Panel</h2>
        <p>Here you can manage your FAQ content.</p>
        
        <div style={styles.links}>
          {/* Editor Link - This should work */}
          <a href="/editor" style={styles.linkButton}>
            Go to Editor
          </a>
          
          {/* Check API Routes */}
          <a href="/api" style={styles.linkButton}>
            Check API Routes
          </a>
          
          {/* Direct links to test */}
          <a 
            href="https://faq-template-saas-ghkz.vercel.app/editor" 
            target="_blank" 
            style={styles.linkButton}
          >
            Open Editor (New Tab)
          </a>
        </div>
        
        <div style={styles.infoBox}>
          <h3>Available Pages:</h3>
          <ul>
            <li><strong>/</strong> - Home Page</li>
            <li><strong>/admin</strong> - This Page</li>
            <li><strong>/editor</strong> - Editor Page</li>
            <li><strong>/api/*</strong> - API Routes</li>
          </ul>
        </div>
        
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
}

// Styling
const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '10px',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    marginTop: '20px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '10px',
    marginTop: '20px',
    border: '1px solid #eee',
  },
  links: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  linkButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '5px',
    marginTop: '20px',
    borderLeft: '4px solid #0070f3',
  },
  note: {
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
  }
};
