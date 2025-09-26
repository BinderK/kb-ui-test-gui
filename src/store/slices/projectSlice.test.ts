import { describe, expect, it } from 'vitest';
import projectReducer, {
    addProject,
    deleteProject,
    setCurrentProject,
    setError,
    setLoading,
    updateProject,
    type Project
} from './projectSlice';

describe('projectSlice', () => {
  // Sample project data for testing
  const sampleProject: Project = {
    id: '1',
    name: 'Test Project',
    description: 'A test project',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const initialState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  };

  describe('addProject', () => {
    it('should add a project to empty list', () => {
      const result = projectReducer(initialState, addProject(sampleProject));
      
      expect(result.projects).toHaveLength(1);
      expect(result.projects[0]).toEqual(sampleProject);
    });

    it('should add a project to existing list', () => {
      const existingProject = { ...sampleProject, id: '2', name: 'Existing Project' };
      const stateWithProject = {
        ...initialState,
        projects: [existingProject],
      };

      const result = projectReducer(stateWithProject, addProject(sampleProject));
      
      expect(result.projects).toHaveLength(2);
      expect(result.projects[0]).toEqual(existingProject);
      expect(result.projects[1]).toEqual(sampleProject);
    });
  });

  describe('setCurrentProject', () => {
    it('should set current project', () => {
      const result = projectReducer(initialState, setCurrentProject(sampleProject));
      
      expect(result.currentProject).toEqual(sampleProject);
    });

    it('should clear current project when set to null', () => {
      const stateWithCurrentProject = {
        ...initialState,
        currentProject: sampleProject,
      };

      const result = projectReducer(stateWithCurrentProject, setCurrentProject(null));
      
      expect(result.currentProject).toBeNull();
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', () => {
      const stateWithProject = {
        ...initialState,
        projects: [sampleProject],
      };

      const updatedProject = { ...sampleProject, name: 'Updated Project' };
      const result = projectReducer(stateWithProject, updateProject(updatedProject));
      
      expect(result.projects[0]).toEqual(updatedProject);
    });

    it('should not modify projects if project not found', () => {
      const stateWithProject = {
        ...initialState,
        projects: [sampleProject],
      };

      const nonExistentProject = { ...sampleProject, id: '999', name: 'Non-existent' };
      const result = projectReducer(stateWithProject, updateProject(nonExistentProject));
      
      expect(result.projects).toEqual(stateWithProject.projects);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', () => {
      const stateWithProject = {
        ...initialState,
        projects: [sampleProject],
      };

      const result = projectReducer(stateWithProject, deleteProject('1'));
      
      expect(result.projects).toHaveLength(0);
    });

    it('should clear current project if it is deleted', () => {
      const stateWithProject = {
        ...initialState,
        projects: [sampleProject],
        currentProject: sampleProject,
      };

      const result = projectReducer(stateWithProject, deleteProject('1'));
      
      expect(result.projects).toHaveLength(0);
      expect(result.currentProject).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const result = projectReducer(initialState, setLoading(true));
      
      expect(result.loading).toBe(true);
    });

    it('should clear loading state', () => {
      const stateWithLoading = {
        ...initialState,
        loading: true,
      };

      const result = projectReducer(stateWithLoading, setLoading(false));
      
      expect(result.loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Something went wrong';
      const result = projectReducer(initialState, setError(errorMessage));
      
      expect(result.error).toBe(errorMessage);
    });

    it('should clear error message', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error',
      };

      const result = projectReducer(stateWithError, setError(null));
      
      expect(result.error).toBeNull();
    });
  });
});
