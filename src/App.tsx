import ProjectList from './components/ProjectList';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ 
            textAlign: 'center', 
            fontSize: '28px', 
            fontWeight: 'bold',
            margin: '0',
            color: '#111827'
          }}>
            KB UI Test GUI
          </h1>
          <p style={{ 
            textAlign: 'center', 
            fontSize: '16px', 
            color: '#6b7280',
            margin: '8px 0 0 0'
          }}>
            Visual interface for UI testing and automation
          </p>
        </div>
      </div>
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        <ProjectList />
      </div>
    </div>
  );
}

export default App;
