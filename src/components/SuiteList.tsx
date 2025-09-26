import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addSuite, deleteSuite, setCurrentSuite } from '../store/slices/projectSlice';

// Simple icon components using Unicode symbols
const TagIcon = () => <span style={{ fontSize: '20px' }}>🏷️</span>;
const ChevronDownIcon = () => <span style={{ fontSize: '16px' }}>▼</span>;
const ChevronRightIcon = () => <span style={{ fontSize: '16px' }}>▶</span>;
const TestTubeIcon = () => <span style={{ fontSize: '16px' }}>🧪</span>;
const CalendarIcon = () => <span style={{ fontSize: '16px' }}>📅</span>;
const CheckIcon = () => <span style={{ fontSize: '16px', color: '#16a34a' }}>✓</span>;
const XIcon = () => <span style={{ fontSize: '16px', color: '#dc2626' }}>✗</span>;
const ClockIcon = () => <span style={{ fontSize: '16px', color: '#d97706' }}>⏱️</span>;

// Badge component
const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'info' }> = ({ 
  children, 
  variant = 'info' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
      case 'warning':
        return { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
      case 'danger':
        return { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
      case 'info':
      default:
        return { backgroundColor: '#e0f2fe', color: '#0c4a6e', border: '1px solid #bae6fd' };
    }
  };

  return (
    <span
      style={{
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        ...getVariantStyles(),
      }}
    >
      {children}
    </span>
  );
};

// Card component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div
    style={{
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    }}
    className={className}
  >
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <div
    style={{
      padding: '16px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background-color 0.2s',
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.backgroundColor = '#f9fafb';
      }
    }}
    onMouseLeave={(e) => {
      if (onClick) {
        e.currentTarget.style.backgroundColor = 'white';
      }
    }}
  >
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '0 16px 16px 16px' }}>
    {children}
  </div>
);

const SuiteList: React.FC = () => {
  // Get data from Redux store
  const { suites, currentSuite, currentProject, loading, error } = useAppSelector((state) => state.projects);
  
  // Get dispatch function to send actions
  const dispatch = useAppDispatch();

  // Function to create a new suite
  const handleCreateSuite = () => {
    if (!currentProject) return;
    
    const newSuite = {
      id: Date.now().toString(),
      projectId: currentProject.id,
      name: `Suite ${suites.filter(s => s.projectId === currentProject.id).length + 1}`,
      description: 'A new test suite',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch(addSuite(newSuite));
  };

  // Function to select a suite
  const handleSelectSuite = (suite: any) => {
    dispatch(setCurrentSuite(suite));
  };

  // Function to delete a suite
  const handleDeleteSuite = (suiteId: string) => {
    if (window.confirm('Are you sure you want to delete this suite?')) {
      dispatch(deleteSuite(suiteId));
    }
  };

  // Clear current suite when project changes (but keep all suites in store)
  React.useEffect(() => {
    dispatch(setCurrentSuite(null));
  }, [currentProject?.id, dispatch]);

  // Filter suites for current project
  const projectSuites = suites.filter(suite => suite.projectId === currentProject?.id);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (!currentProject) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Test Suites</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Select a project to view its test suites</p>
        </div>
        
        <Card>
          <CardContent>
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <TagIcon />
              <p style={{ marginTop: '8px', fontSize: '16px' }}>No project selected</p>
              <p style={{ fontSize: '14px' }}>Choose a project from the left to view its suites</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Test Suites</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          <strong>Project:</strong> {currentProject.name}
        </p>
      </div>
      
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
          Loading...
        </div>
      )}
      
      {error && (
        <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleCreateSuite}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
          }}
        >
          + Create New Suite
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {projectSuites.length === 0 ? (
          <Card>
            <CardContent>
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                <TagIcon />
                <p style={{ marginTop: '8px', fontSize: '16px' }}>No suites yet</p>
                <p style={{ fontSize: '14px' }}>Create your first test suite for this project</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          projectSuites.map((suite) => (
            <Card key={suite.id}>
              <CardHeader onClick={() => handleSelectSuite(suite)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <TagIcon />
                    <div>
                      <h2 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        margin: '0 0 4px 0',
                        color: currentSuite?.id === suite.id ? '#10b981' : '#111827'
                      }}>
                        {suite.name}
                      </h2>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        margin: '0',
                        lineHeight: '1.4'
                      }}>
                        {suite.description}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <CheckIcon />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#16a34a' }}>0</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <XIcon />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#dc2626' }}>0</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <ClockIcon />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#d97706' }}>0</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
                      <CalendarIcon />
                      <span>{formatDate(suite.createdAt)}</span>
                    </div>
                    
                    <Badge variant="info">
                      0% Pass Rate
                    </Badge>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSuite(suite.id);
                      }}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ef4444';
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
      
      {currentSuite && (
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          backgroundColor: '#f0fdf4', 
          borderRadius: '8px',
          border: '1px solid #bbf7d0'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#166534' }}>
            Selected Suite
          </h3>
          <p style={{ fontSize: '14px', margin: '0', color: '#166534' }}>
            <strong>{currentSuite.name}</strong> - {currentSuite.description}
          </p>
          <p style={{ fontSize: '12px', margin: '4px 0 0 0', color: '#6b7280' }}>
            Created: {formatDate(currentSuite.createdAt)} | Updated: {formatDate(currentSuite.updatedAt)}
          </p>
        </div>
      )}
    </div>
  );
};

export default SuiteList;