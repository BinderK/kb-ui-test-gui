import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addProject, addSuite, deleteSuite, setCurrentSuite } from '../store/slices/projectSlice';

// Simple icon components using Unicode symbols
const FolderIcon = () => <span style={{ fontSize: '20px' }}>📁</span>;
const FolderOpenIcon = () => <span style={{ fontSize: '20px' }}>📂</span>;
const ChevronDownIcon = () => <span style={{ fontSize: '16px' }}>▼</span>;
const ChevronRightIcon = () => <span style={{ fontSize: '16px' }}>▶</span>;
const TagIcon = () => <span style={{ fontSize: '16px' }}>🏷️</span>;
const TestTubeIcon = () => <span style={{ fontSize: '16px' }}>🧪</span>;
const CalendarIcon = () => <span style={{ fontSize: '16px' }}>📅</span>;
const CheckIcon = () => <span style={{ fontSize: '14px', color: '#16a34a' }}>✓</span>;
const XIcon = () => <span style={{ fontSize: '14px', color: '#dc2626' }}>✗</span>;
const ClockIcon = () => <span style={{ fontSize: '14px', color: '#d97706' }}>⏱️</span>;

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

// Project Item Component
const ProjectItem: React.FC<{ project: any; suites: any[]; currentSuite: any; onSelectSuite: (suite: any) => void; onDeleteSuite: (suiteId: string) => void; onAddSuite: (projectId: string) => void }> = ({ 
  project, 
  suites, 
  currentSuite, 
  onSelectSuite, 
  onDeleteSuite, 
  onAddSuite 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const projectSuites = suites.filter(suite => suite.projectId === project.id);
  
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <Card>
      <CardHeader onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
            <div>
              <h2 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                margin: '0 0 4px 0',
                color: '#111827'
              }}>
                {project.name}
              </h2>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: '0',
                lineHeight: '1.4'
              }}>
                {project.description}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
              <TestTubeIcon />
              <span>{projectSuites.length} suites</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
              <CalendarIcon />
              <span>{formatDate(project.createdAt)}</span>
            </div>
            
            <Badge variant="warning">
              0% Pass Rate
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0', color: '#374151' }}>
              Test Suites ({projectSuites.length})
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddSuite(project.id);
              }}
              style={{
                backgroundColor: '#10b981',
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
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              + Add Suite
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {projectSuites.length === 0 ? (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: '#6b7280',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                border: '1px dashed #d1d5db'
              }}>
                <TagIcon />
                <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>No suites yet</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Add your first test suite</p>
              </div>
            ) : (
              projectSuites.map((suite) => (
                <div
                  key={suite.id}
                  style={{
                    padding: '12px',
                    backgroundColor: currentSuite?.id === suite.id ? '#f0fdf4' : '#f9fafb',
                    border: `1px solid ${currentSuite?.id === suite.id ? '#bbf7d0' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => onSelectSuite(suite)}
                  onMouseEnter={(e) => {
                    if (currentSuite?.id !== suite.id) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentSuite?.id !== suite.id) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TagIcon />
                      <div>
                        <h4 style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          margin: '0 0 2px 0',
                          color: currentSuite?.id === suite.id ? '#166534' : '#111827'
                        }}>
                          {suite.name}
                        </h4>
                        <p style={{ 
                          fontSize: '12px', 
                          color: '#6b7280', 
                          margin: '0',
                          lineHeight: '1.3'
                        }}>
                          {suite.description}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <CheckIcon />
                          <span style={{ fontSize: '12px', fontWeight: '500', color: '#16a34a' }}>0</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <XIcon />
                          <span style={{ fontSize: '12px', fontWeight: '500', color: '#dc2626' }}>0</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <ClockIcon />
                          <span style={{ fontSize: '12px', fontWeight: '500', color: '#d97706' }}>0</span>
                        </div>
                      </div>
                      
                      <Badge variant="info">
                        0% Pass
                      </Badge>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSuite(suite.id);
                        }}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
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
                </div>
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const ProjectList: React.FC = () => {
  // Get data from Redux store
  const { projects, suites, currentSuite, loading, error } = useAppSelector((state) => state.projects);
  
  // Get dispatch function to send actions
  const dispatch = useAppDispatch();

  // Function to create a new project
  const handleCreateProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: `Project ${projects.length + 1}`,
      description: 'A new test project',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch(addProject(newProject));
  };

  // Function to add a suite to a project
  const handleAddSuite = (projectId: string) => {
    const projectSuites = suites.filter(s => s.projectId === projectId);
    const newSuite = {
      id: Date.now().toString(),
      projectId: projectId,
      name: `Suite ${projectSuites.length + 1}`,
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Projects</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage your test projects and suites</p>
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
          onClick={handleCreateProject}
          style={{
            backgroundColor: '#3b82f6',
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
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          + Create New Project
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {projects.length === 0 ? (
          <Card>
            <CardContent>
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                <FolderIcon />
                <p style={{ marginTop: '8px', fontSize: '16px' }}>No projects yet</p>
                <p style={{ fontSize: '14px' }}>Create your first project to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              suites={suites}
              currentSuite={currentSuite}
              onSelectSuite={handleSelectSuite}
              onDeleteSuite={handleDeleteSuite}
              onAddSuite={handleAddSuite}
            />
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
        </div>
      )}
    </div>
  );
};

export default ProjectList;