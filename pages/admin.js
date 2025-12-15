import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  
  // Simple password check
  const handleLogin = () => {
    if (password === 'admin123') { // Temporary password
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
    } else {
      alert('Wrong password!');
    }
  };

  useEffect(() => {
    // Check if already logged in
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
          <a href="/editor" style={styles.linkButton}>
            Go to Editor
          </a>
          <a href="/api/faqs" style={styles.linkButton}>
            View FAQs API
          </a>
        </div>
        
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
}

// Simple styling
const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    marginTop: '20px',
    cursor: 'pointer',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: '30px',
    borderRadius: '10px',
    marginTop: '20px',
  },
  links: {
    marginTop: '20px',
  },
  linkButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textDecoration: 'none',
    marginRight: '10px',
    borderRadius: '5px',
  },
  note: {
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
  }
};
