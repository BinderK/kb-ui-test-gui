import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of a project
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Define the shape of our state
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

// Create the slice
export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error message
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Add a new project
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    
    // Set all projects (for loading from storage)
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    
    // Set current project
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    
    // Update a project
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    
    // Delete a project
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
    },
  },
});

// Export the actions
export const {
  setLoading,
  setError,
  addProject,
  setProjects,
  setCurrentProject,
  updateProject,
  deleteProject,
} = projectSlice.actions;

// Export the reducer
export default projectSlice.reducer;
