const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Project management
  createProject: (projectData) => ipcRenderer.invoke('create-project', projectData),
  getProjects: () => ipcRenderer.invoke('get-projects'),
  deleteProject: (projectId) => ipcRenderer.invoke('delete-project', projectId),
  
  // Test case management
  createTestCase: (testCaseData) => ipcRenderer.invoke('create-test-case', testCaseData),
  getTestCases: (projectId) => ipcRenderer.invoke('get-test-cases', projectId),
  updateTestCase: (testCaseData) => ipcRenderer.invoke('update-test-case', testCaseData),
  deleteTestCase: (testCaseId) => ipcRenderer.invoke('delete-test-case', testCaseId),
  
  // Test execution
  executeTest: (testCaseId) => ipcRenderer.invoke('execute-test', testCaseId),
  executeSuite: (suiteId) => ipcRenderer.invoke('execute-suite', suiteId),
  
  // Results
  getTestResults: (executionId) => ipcRenderer.invoke('get-test-results', executionId),
  getExecutionHistory: (projectId) => ipcRenderer.invoke('get-execution-history', projectId),
  
  // Real-time updates
  onTestProgress: (callback) => {
    ipcRenderer.on('test-progress', callback);
    return () => ipcRenderer.removeListener('test-progress', callback);
  },
  
  onTestComplete: (callback) => {
    ipcRenderer.on('test-complete', callback);
    return () => ipcRenderer.removeListener('test-complete', callback);
  }
});
