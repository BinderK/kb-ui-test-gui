import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import projectReducer from '../store/slices/projectSlice';
import ProjectList from './ProjectList';

// Integration test: Test Redux + React working together
describe('Redux + React Integration Tests', () => {
  // Create a REAL Redux store (not mocked)
  const createRealStore = () => {
    return configureStore({
      reducer: {
        projects: projectReducer,
      },
    });
  };

  const renderWithRealStore = (component: React.ReactElement, store = createRealStore()) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  describe('Project Creation Flow', () => {
    it('should create project and update real Redux store', async () => {
      const user = userEvent.setup();
      const realStore = createRealStore();
      
      // Initial state
      expect(realStore.getState().projects.projects).toHaveLength(0);
      
      renderWithRealStore(<ProjectList />, realStore);
      
      // User creates a project
      await user.click(screen.getByText('Create New Project'));
      
      // Verify UI updated
      expect(screen.getByText('Projects (1)')).toBeInTheDocument();
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      
      // Verify REAL Redux store updated
      const state = realStore.getState();
      expect(state.projects.projects).toHaveLength(1);
      expect(state.projects.projects[0].name).toBe('Project 1');
      expect(state.projects.projects[0].description).toBe('A new test project');
    });

    it('should create multiple projects and maintain state', async () => {
      const user = userEvent.setup();
      const realStore = createRealStore();
      
      renderWithRealStore(<ProjectList />, realStore);
      
      // Create first project
      await user.click(screen.getByText('Create New Project'));
      
      // Create second project
      await user.click(screen.getByText('Create New Project'));
      
      // Verify UI
      expect(screen.getByText('Projects (2)')).toBeInTheDocument();
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
      
      // Verify REAL store state
      const state = realStore.getState();
      expect(state.projects.projects).toHaveLength(2);
      expect(state.projects.projects[0].name).toBe('Project 1');
      expect(state.projects.projects[1].name).toBe('Project 2');
    });
  });

  describe('Project Selection Flow', () => {
    it('should select project and update current project in store', async () => {
      const user = userEvent.setup();
      
      // Pre-populate store with a project
      const initialState = {
        projects: [
          {
            id: '1',
            name: 'Test Project',
            description: 'A test project',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        currentProject: null,
        loading: false,
        error: null,
      };
      
      const storeWithProject = configureStore({
        reducer: { projects: projectReducer },
        preloadedState: { projects: initialState },
      });
      
      renderWithRealStore(<ProjectList />, storeWithProject);
      
      // Initially no current project
      expect(storeWithProject.getState().projects.currentProject).toBeNull();
      expect(screen.queryByText('Current Project')).not.toBeInTheDocument();
      
      // User selects project
      const projectButtons = screen.getAllByRole('button');
      const projectButton = projectButtons.find(button => 
        button.textContent?.includes('Test Project') && 
        button.textContent?.includes('A test project')
      );
      
      await user.click(projectButton!);
      
      // Verify UI updated
      expect(screen.getByText('Current Project')).toBeInTheDocument();
      
      // Verify REAL store updated
      const state = storeWithProject.getState();
      expect(state.projects.currentProject).not.toBeNull();
      expect(state.projects.currentProject?.name).toBe('Test Project');
    });
  });

  describe('State Persistence', () => {
    it('should maintain state across multiple user actions', async () => {
      const user = userEvent.setup();
      const realStore = createRealStore();
      
      renderWithRealStore(<ProjectList />, realStore);
      
      // Action 1: Create project
      await user.click(screen.getByText('Create New Project'));
      
      // Action 2: Create another project
      await user.click(screen.getByText('Create New Project'));
      
      // Action 3: Select first project
      const projectButtons = screen.getAllByRole('button');
      const firstProjectButton = projectButtons.find(button => 
        button.textContent?.includes('Project 1')
      );
      await user.click(firstProjectButton!);
      
      // Verify all state is maintained
      const finalState = realStore.getState();
      expect(finalState.projects.projects).toHaveLength(2);
      expect(finalState.projects.currentProject?.name).toBe('Project 1');
      
      // Verify UI reflects all changes
      expect(screen.getByText('Projects (2)')).toBeInTheDocument();
      expect(screen.getByText('Current Project')).toBeInTheDocument();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle errors and update both UI and store', async () => {
      const realStore = createRealStore();
      
      // Manually dispatch an error action to test error handling
      realStore.dispatch({
        type: 'projects/setError',
        payload: 'Failed to create project',
      });
      
      renderWithRealStore(<ProjectList />, realStore);
      
      // Verify error appears in UI
      expect(screen.getByText('Error: Failed to create project')).toBeInTheDocument();
      
      // Verify error is in store
      const state = realStore.getState();
      expect(state.projects.error).toBe('Failed to create project');
    });
  });
});
