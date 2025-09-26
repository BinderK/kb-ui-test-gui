import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import projectReducer from '../store/slices/projectSlice';
import ProjectList from './ProjectList';

// Helper function to create a mock store with specific state
const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      projects: projectReducer,
    },
    preloadedState: {
      projects: {
        projects: [],
        currentProject: null,
        suites: [],
        currentSuite: null,
        loading: false,
        error: null,
        ...preloadedState,
      },
    },
  });
};

// Helper function to render component with Redux store
const renderWithStore = (component: React.ReactElement, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('ProjectList Component', () => {
  describe('User Interactions', () => {
    it('should create a new project when "Create New Project" button is clicked', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      
      renderWithStore(<ProjectList />, store);
      
      // Initially no projects
      expect(screen.getByText('No projects yet')).toBeInTheDocument();
      
      // Click create button
      await user.click(screen.getByText('+ Create New Project'));
      
      // Should now have 1 project
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });

    it('should expand project when clicked', async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        projects: [
          {
            id: '1',
            name: 'Test Project',
            description: 'A test project',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      });
      
      renderWithStore(<ProjectList />, store);
      
      // Initially project should be expanded (we set isExpanded to true by default)
      expect(screen.getByText('Test Suites (0)')).toBeInTheDocument();
      
      // Click on project header to collapse
      const projectHeader = screen.getByText('Test Project').closest('div')?.parentElement;
      if (projectHeader) {
        await user.click(projectHeader);
      }
      
      // Should now be collapsed (suites section hidden)
      expect(screen.queryByText('Test Suites (0)')).not.toBeInTheDocument();
    });

    it('should create multiple projects with correct numbering', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      
      renderWithStore(<ProjectList />, store);
      
      // Create first project
      await user.click(screen.getByText('+ Create New Project'));
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      
      // Create second project
      await user.click(screen.getByText('+ Create New Project'));
      expect(screen.getByText('Project 2')).toBeInTheDocument();
      
      // Should have both projects visible
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should show loading state when loading is true', () => {
      const store = createMockStore({ loading: true });
      
      renderWithStore(<ProjectList />, store);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show error message when error exists', () => {
      const store = createMockStore({ error: 'Failed to load projects' });
      
      renderWithStore(<ProjectList />, store);
      
      expect(screen.getByText('Error: Failed to load projects')).toBeInTheDocument();
    });

    it('should show empty state when no projects exist', () => {
      const store = createMockStore();
      
      renderWithStore(<ProjectList />, store);
      
      expect(screen.getByText('No projects yet')).toBeInTheDocument();
    });

    it('should show project list when projects exist', () => {
      const store = createMockStore({
        projects: [
          {
            id: '1',
            name: 'Test Project',
            description: 'A test project',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      });
      
      renderWithStore(<ProjectList />, store);
      
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.queryByText('No projects yet')).not.toBeInTheDocument();
    });
  });

  describe('Suite Management', () => {
    it('should show suite section when project is expanded', () => {
      const store = createMockStore({
        projects: [
          {
            id: '1',
            name: 'Test Project',
            description: 'A test project',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      });
      
      renderWithStore(<ProjectList />, store);
      
      // Should show suite section (projects start expanded)
      expect(screen.getByText('Test Suites (0)')).toBeInTheDocument();
    });

    it('should add suite to project', async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        projects: [
          {
            id: '1',
            name: 'Test Project',
            description: 'A test project',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      });
      
      renderWithStore(<ProjectList />, store);
      
      // Click add suite button
      await user.click(screen.getByText('+ Add Suite'));
      
      // Should now show 1 suite
      expect(screen.getByText('Test Suites (1)')).toBeInTheDocument();
      expect(screen.getByText('Suite 1')).toBeInTheDocument();
    });
  });
});
