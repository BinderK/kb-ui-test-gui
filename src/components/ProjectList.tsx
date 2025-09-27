import {
  Add,
  CalendarToday,
  Cancel,
  CheckCircle,
  Delete,
  ExpandLess,
  ExpandMore,
  FolderOpen,
  Label,
  Schedule,
  Science,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addProject, addSuite, deleteSuite, setCurrentSuite } from '../store/slices/projectSlice';

// Material-UI styled components

const ProjectList: React.FC = () => {
  const { projects, suites, currentSuite, loading, error } = useAppSelector((state) => state.projects);
  const dispatch = useAppDispatch();
  const [newProjectName, setNewProjectName] = useState('');
  const [newSuiteName, setNewSuiteName] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        description: `A new test project for ${newProjectName.trim()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalTests: Math.floor(Math.random() * 100),
        lastRun: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30),
        passRate: parseFloat((Math.random() * 100).toFixed(1)),
      };
      dispatch(addProject(newProject));
      setNewProjectName('');
    }
  };

  const handleToggleProject = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleAddSuite = (projectId: string) => {
    if (newSuiteName.trim() && projectId) {
      const newSuite = {
        id: Date.now().toString(),
        projectId: projectId,
        name: newSuiteName.trim(),
        description: `Suite for ${newSuiteName.trim()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        passed: Math.floor(Math.random() * 20),
        failed: Math.floor(Math.random() * 5),
        pending: Math.floor(Math.random() * 3),
        passRate: parseFloat((Math.random() * 100).toFixed(1)),
      };
      dispatch(addSuite(newSuite));
      setNewSuiteName('');
    }
  };

  const handleSelectSuite = (suite: any) => {
    dispatch(setCurrentSuite(suite));
  };

  const handleDeleteSuite = (suiteId: string) => {
    if (window.confirm('Are you sure you want to delete this suite?')) {
      dispatch(deleteSuite(suiteId));
    }
  };

  const formatLastRun = (date?: Date) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPassRateColor = (passRate?: number) => {
    if (passRate === undefined) return { bg: '#f3f4f6', text: '#374151' };
    if (passRate >= 90) return { bg: '#dcfce7', text: '#166534' };
    if (passRate >= 70) return { bg: '#fef3c7', text: '#92400e' };
    return { bg: '#fee2e2', text: '#991b1b' };
  };

  return (
    <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Project Management
      </Typography>

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="New project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateProject}
            disabled={!newProjectName.trim()}
          >
            Create New Project
          </Button>
        </Stack>
      </Paper>

      {loading && (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        {projects.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No projects yet
            </Typography>
          </Paper>
        ) : (
          projects.map((project) => {
            const isExpanded = expandedProjects.includes(project.id);
            const projectSuites = suites.filter(s => s.projectId === project.id);
            const passRateColor = getPassRateColor(project.passRate);
            
            return (
              <Card key={project.id} elevation={2} sx={{ '&:hover': { elevation: 4 } }}>
                <CardHeader
                  onClick={() => handleToggleProject(project.id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' },
                    '& .MuiCardHeader-content': { minWidth: 0 }
                  }}
                  avatar={<FolderOpen color="primary" />}
                  action={
                    <Box display="flex" alignItems="center" gap={1}>
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  }
                  title={
                    <Box>
                      <Typography variant="h6" component="div" noWrap>
                        {project.name}
                      </Typography>
                      {project.description && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {project.description}
                        </Typography>
                      )}
                    </Box>
                  }
                  subheader={
                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Science fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {project.totalTests || 0} tests
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatLastRun(project.lastRun)}
                        </Typography>
                      </Box>
                      <Chip
                        label={project.passRate !== undefined ? `${project.passRate.toFixed(1)}% Pass Rate` : 'N/A'}
                        size="small"
                        sx={{
                          backgroundColor: passRateColor.bg,
                          color: passRateColor.text,
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  }
                />

                <Collapse in={isExpanded}>
                  <Divider />
                  <CardContent sx={{ backgroundColor: 'grey.50' }}>
                    <Typography variant="h6" gutterBottom>
                      Test Suites ({projectSuites.length})
                    </Typography>
                    
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="New suite name"
                        value={newSuiteName}
                        onChange={(e) => setNewSuiteName(e.target.value)}
                        size="small"
                      />
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleAddSuite(project.id)}
                        disabled={!newSuiteName.trim()}
                        color="success"
                      >
                        Add Suite
                      </Button>
                    </Stack>

                    {projectSuites.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                        No suites yet
                      </Typography>
                    ) : (
                      <List dense>
                        {projectSuites.map((suite) => {
                          const isSelected = currentSuite?.id === suite.id;
                          
                          return (
                            <ListItem
                              key={suite.id}
                              onClick={() => handleSelectSuite(suite)}
                              sx={{
                                cursor: 'pointer',
                                backgroundColor: isSelected ? 'success.light' : 'background.paper',
                                border: isSelected ? '1px solid' : '1px solid',
                                borderColor: isSelected ? 'success.main' : 'divider',
                                borderRadius: 1,
                                mb: 1,
                                '&:hover': {
                                  backgroundColor: isSelected ? 'success.light' : 'action.hover'
                                }
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Label color="success" fontSize="small" />
                                    <Typography variant="body2" fontWeight="medium">
                                      {suite.name}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  suite.description && (
                                    <Typography variant="caption" color="text.secondary">
                                      {suite.description}
                                    </Typography>
                                  )
                                }
                              />
                              <ListItemSecondaryAction>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    <CheckCircle fontSize="small" color="success" />
                                    <Typography variant="caption">{suite.passed || 0}</Typography>
                                  </Box>
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    <Cancel fontSize="small" color="error" />
                                    <Typography variant="caption">{suite.failed || 0}</Typography>
                                  </Box>
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    <Schedule fontSize="small" color="action" />
                                    <Typography variant="caption">{suite.pending || 0}</Typography>
                                  </Box>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteSuite(suite.id); }}
                                    color="error"
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </ListItemSecondaryAction>
                            </ListItem>
                          );
                        })}
                      </List>
                    )}
                  </CardContent>
                </Collapse>
              </Card>
            );
          })
        )}
      </Stack>
    </Box>
  );
};

export default ProjectList;