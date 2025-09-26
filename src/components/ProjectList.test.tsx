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
      expect(screen.getByText('No projects yet. Create one!')).toBeInTheDocument();
      
      // Click create button
      await user.click(screen.getByText('Create New Project'));
      
      // Should now have 1 project
      expect(screen.getByText('Projects (1)')).toBeInTheDocument();
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });

    it('should select a project when clicked', async () => {
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
      
      // Initially no current project selected
      expect(screen.queryByText('Current Project')).not.toBeInTheDocument();
      
      // Click on project button (more specific selector)
      const projectButtons = screen.getAllByRole('button');
      const projectButton = projectButtons.find(button => 
        button.textContent?.includes('Test Project') && 
        button.textContent?.includes('A test project')
      );
      
      await user.click(projectButton!);
      
      // Should now show current project details
      expect(screen.getByText('Current Project')).toBeInTheDocument();
      expect(screen.getByText(/Name:/)).toBeInTheDocument();
      // Check that the current project section contains the project name
      const currentProjectSection = screen.getByText('Current Project').closest('div');
      expect(currentProjectSection).toHaveTextContent('Test Project');
    });

    it('should create multiple projects with correct numbering', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      
      renderWithStore(<ProjectList />, store);
      
      // Create first project
      await user.click(screen.getByText('Create New Project'));
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      
      // Create second project
      await user.click(screen.getByText('Create New Project'));
      expect(screen.getByText('Project 2')).toBeInTheDocument();
      
      // Should show count of 2
      expect(screen.getByText('Projects (2)')).toBeInTheDocument();
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
      
      expect(screen.getByText('No projects yet. Create one!')).toBeInTheDocument();
      expect(screen.getByText('Projects (0)')).toBeInTheDocument();
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
      
      expect(screen.getByText('Projects (1)')).toBeInTheDocument();
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.queryByText('No projects yet. Create one!')).not.toBeInTheDocument();
    });
  });

  describe('Visual State Management', () => {
    it('should highlight selected project', () => {
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
        currentProject: {
          id: '1',
          name: 'Test Project',
          description: 'A test project',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      });
      
      renderWithStore(<ProjectList />, store);
      
      // Use getAllByText to get all buttons with "Test Project" and pick the first one (the project button)
      const projectButtons = screen.getAllByRole('button');
      const projectButton = projectButtons.find(button => 
        button.textContent?.includes('Test Project') && 
        button.textContent?.includes('A test project')
      );
      
      expect(projectButton).toHaveStyle('background-color: rgb(173, 216, 230)');
    });

    it('should not highlight unselected projects', () => {
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
        currentProject: null,
      });
      
      renderWithStore(<ProjectList />, store);
      
      const projectButtons = screen.getAllByRole('button');
      const projectButton = projectButtons.find(button => 
        button.textContent?.includes('Test Project') && 
        button.textContent?.includes('A test project')
      );
      
      expect(projectButton).toHaveStyle('background-color: rgb(255, 255, 255)');
    });
  });
});
