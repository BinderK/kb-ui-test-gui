import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addProject, setCurrentProject } from '../store/slices/projectSlice';

const ProjectList: React.FC = () => {
  // Get data from Redux store
  const { projects, currentProject, loading, error } = useAppSelector((state) => state.projects);
  
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

  // Function to select a project
  const handleSelectProject = (project: any) => {
    dispatch(setCurrentProject(project));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Project Management</h2>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <button onClick={handleCreateProject}>
        Create New Project
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Projects ({projects.length})</h3>
        {projects.length === 0 ? (
          <p>No projects yet. Create one!</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => handleSelectProject(project)}
                  style={{
                    backgroundColor: currentProject?.id === project.id ? 'lightblue' : 'white',
                    border: '1px solid #ccc',
                    padding: '10px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <strong>{project.name}</strong>
                  <br />
                  <small>{project.description}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {currentProject && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <h3>Current Project</h3>
          <p><strong>Name:</strong> {currentProject.name}</p>
          <p><strong>Description:</strong> {currentProject.description}</p>
          <p><strong>Created:</strong> {new Date(currentProject.createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
