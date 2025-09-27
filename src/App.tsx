import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import ProjectList from './components/ProjectList';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="static" elevation={1} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Container maxWidth="xl">
            <Box textAlign="center" py={2}>
              <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                KB UI Test GUI
              </Typography>
              <Typography variant="body1" color="text.secondary" mt={1}>
                Visual interface for UI testing and automation
              </Typography>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <ProjectList />
      </Container>
    </Box>
  );
}

export default App;
