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
      const input = screen.getByPlaceholderText('New project name');
      await user.type(input, 'Test Project');
      await user.click(screen.getByText('Create New Project'));
      
      // Verify UI updated
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      
      // Verify REAL Redux store updated
      const state = realStore.getState();
      expect(state.projects.projects).toHaveLength(1);
      expect(state.projects.projects[0].name).toBe('Test Project');
      expect(state.projects.projects[0].description).toBe('A new test project for Test Project');
    });

    it('should create multiple projects and maintain state', async () => {
      const user = userEvent.setup();
      const realStore = createRealStore();
      
      renderWithRealStore(<ProjectList />, realStore);
      
      // Create first project
      const input1 = screen.getByPlaceholderText('New project name');
      await user.type(input1, 'Test Project 1');
      await user.click(screen.getByText('Create New Project'));
      
      // Create second project
      const input2 = screen.getByPlaceholderText('New project name');
      await user.type(input2, 'Test Project 2');
      await user.click(screen.getByText('Create New Project'));
      
      // Verify UI
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      expect(screen.getByText('Test Project 2')).toBeInTheDocument();
      
      // Verify REAL store state
      const state = realStore.getState();
      expect(state.projects.projects).toHaveLength(2);
      expect(state.projects.projects[0].name).toBe('Test Project 1');
      expect(state.projects.projects[1].name).toBe('Test Project 2');
    });
  });

  describe('Suite Management Flow', () => {
    it('should add suite and update store', async () => {
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
        suites: [],
        currentSuite: null,
        loading: false,
        error: null,
      };
      
      const storeWithProject = configureStore({
        reducer: { projects: projectReducer },
        preloadedState: { projects: initialState },
      });
      
      renderWithRealStore(<ProjectList />, storeWithProject);
      
      // Initially no suites
      expect(storeWithProject.getState().projects.suites).toHaveLength(0);
      expect(screen.getByText('Test Suites (0)')).toBeInTheDocument();
      
      // User adds suite
      const suiteInput = screen.getByPlaceholderText('New suite name');
      await user.type(suiteInput, 'Test Suite');
      await user.click(screen.getByText('Add Suite'));
      
      // Verify UI updated
      expect(screen.getByText('Test Suites (1)')).toBeInTheDocument();
      expect(screen.getByText('Test Suite')).toBeInTheDocument();
      
      // Verify REAL store updated
      const state = storeWithProject.getState();
      expect(state.projects.suites).toHaveLength(1);
      expect(state.projects.suites[0].name).toBe('Test Suite');
      expect(state.projects.suites[0].projectId).toBe('1');
    });
  });

  describe('State Persistence', () => {
    it('should maintain state across multiple user actions', async () => {
      const user = userEvent.setup();
      const realStore = createRealStore();
      
      renderWithRealStore(<ProjectList />, realStore);
      
      // Action 1: Create project
      const input1 = screen.getByPlaceholderText('New project name');
      await user.type(input1, 'Test Project 1');
      await user.click(screen.getByText('Create New Project'));
      
      // Action 2: Create another project
      const input2 = screen.getByPlaceholderText('New project name');
      await user.type(input2, 'Test Project 2');
      await user.click(screen.getByText('Create New Project'));
      
      // Action 3: Add suite to first project
      const suiteInputs = screen.getAllByPlaceholderText('New suite name');
      await user.type(suiteInputs[0], 'Test Suite');
      const addSuiteButtons = screen.getAllByText('Add Suite');
      await user.click(addSuiteButtons[0]);
      
      // Verify all state is maintained
      const finalState = realStore.getState();
      expect(finalState.projects.projects).toHaveLength(2);
      expect(finalState.projects.suites).toHaveLength(1);
      expect(finalState.projects.suites[0].name).toBe('Test Suite');
      
      // Verify UI reflects all changes
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      expect(screen.getByText('Test Project 2')).toBeInTheDocument();
      expect(screen.getByText('Test Suite')).toBeInTheDocument();
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
      expect(screen.getByText('Failed to create project')).toBeInTheDocument();
      
      // Verify error is in store
      const state = realStore.getState();
      expect(state.projects.error).toBe('Failed to create project');
    });
  });
});
