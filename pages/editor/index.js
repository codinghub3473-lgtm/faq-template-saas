export default function EditorHome() {
  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1>FAQ Editor Dashboard</h1>
      <p>Select a project to edit or create new.</p>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Sample Projects:</h3>
        <ul>
          <li>
            <a href="/editor/1" style={{ color: 'blue' }}>
              Project 1
            </a>
          </li>
          <li>
            <a href="/editor/2" style={{ color: 'blue' }}>
              Project 2
            </a>
          </li>
          <li>
            <a href="/editor/faq-template" style={{ color: 'blue' }}>
              FAQ Template
            </a>
          </li>
        </ul>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h3>Create New:</h3>
        <input 
          placeholder="Enter project name" 
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none' }}>
          Create
        </button>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <a href="/admin" style={{ color: '#666', textDecoration: 'underline' }}>
          ← Back to Admin
        </a>
      </div>
    </div>
  );
}
