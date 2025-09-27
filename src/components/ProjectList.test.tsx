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
      
      // Type in the input first to enable the button
      const input = screen.getByPlaceholderText('New project name');
      await user.type(input, 'Test Project');
      
      // Click create button
      await user.click(screen.getByText('Create New Project'));
      
      // Should now have 1 project
      expect(screen.getByText('Test Project')).toBeInTheDocument();
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
      
      // Initially project should be collapsed (projects start collapsed by default)
      // The text should be in DOM but the Collapse component should be collapsed
      const suitesText = screen.getByText('Test Suites (0)');
      expect(suitesText).toBeInTheDocument();
      
      // Check that the Collapse wrapper has collapsed styling
      const collapseWrapper = suitesText.closest('.MuiCollapse-root');
      expect(collapseWrapper).toHaveClass('MuiCollapse-hidden');
      
      // Click on project header to expand
      const projectHeader = screen.getByText("Test Project");
      await user.click(projectHeader);
      
      // Should now be expanded (suites section visible)
      // Check that the Collapse wrapper no longer has collapsed styling
      expect(collapseWrapper).not.toHaveClass('MuiCollapse-hidden');
    });

    it('should create multiple projects with correct numbering', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      
      renderWithStore(<ProjectList />, store);
      
      // Create first project
      const input1 = screen.getByPlaceholderText('New project name');
      await user.type(input1, 'Test Project 1');
      await user.click(screen.getByText('Create New Project'));
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      
      // Create second project
      const input2 = screen.getByPlaceholderText('New project name');
      await user.type(input2, 'Test Project 2');
      await user.click(screen.getByText('Create New Project'));
      expect(screen.getByText('Test Project 2')).toBeInTheDocument();
      
      // Should have both projects visible
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should show loading state when loading is true', () => {
      const store = createMockStore({ loading: true });
      
      renderWithStore(<ProjectList />, store);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show error message when error exists', () => {
      const store = createMockStore({ error: 'Failed to load projects' });
      
      renderWithStore(<ProjectList />, store);
      
      expect(screen.getByText('Failed to load projects')).toBeInTheDocument();
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
      
      // Type in the suite input first to enable the button
      const suiteInput = screen.getByPlaceholderText('New suite name');
      await user.type(suiteInput, 'Test Suite');
      
      // Click add suite button
      await user.click(screen.getByText('Add Suite'));
      
      // Should now show 1 suite
      expect(screen.getByText('Test Suites (1)')).toBeInTheDocument();
      expect(screen.getByText('Test Suite')).toBeInTheDocument();
    });
  });
});
