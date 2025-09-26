import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of a project
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Define the shape of a suite
export interface Suite {
  id: string;
  projectId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Define the shape of our state
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  suites: Suite[];
  currentSuite: Suite | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  suites: [],
  currentSuite: null,
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
      // Also clear suites when project is deleted
      state.suites = state.suites.filter(s => s.projectId !== action.payload);
      if (state.currentSuite?.projectId === action.payload) {
        state.currentSuite = null;
      }
    },

    // Suite management actions
    // Add a new suite
    addSuite: (state, action: PayloadAction<Suite>) => {
      state.suites.push(action.payload);
    },
    
    // Set all suites (for loading from storage)
    setSuites: (state, action: PayloadAction<Suite[]>) => {
      state.suites = action.payload;
    },
    
    // Set current suite
    setCurrentSuite: (state, action: PayloadAction<Suite | null>) => {
      state.currentSuite = action.payload;
    },
    
    // Update a suite
    updateSuite: (state, action: PayloadAction<Suite>) => {
      const index = state.suites.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.suites[index] = action.payload;
      }
    },
    
    // Delete a suite
    deleteSuite: (state, action: PayloadAction<string>) => {
      state.suites = state.suites.filter(s => s.id !== action.payload);
      if (state.currentSuite?.id === action.payload) {
        state.currentSuite = null;
      }
    },
    
    // Clear suites when project changes
    clearSuites: (state) => {
      state.suites = [];
      state.currentSuite = null;
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
  addSuite,
  setSuites,
  setCurrentSuite,
  updateSuite,
  deleteSuite,
  clearSuites,
} = projectSlice.actions;

// Export the reducer
export default projectSlice.reducer;
