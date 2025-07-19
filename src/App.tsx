import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Curriculum } from './pages/Curriculum/Curriculum';
import { LessonView } from './pages/Curriculum/LessonView';
import { Challenges } from './pages/Challenges/Challenges';
import { ChallengeDetail } from './pages/Challenges/ChallengeDetail';
import { Projects } from './pages/Projects/Projects';
import { ProjectDetail } from './pages/Projects/ProjectDetail';
import { StudyPlanner } from './pages/StudyPlanner/StudyPlanner';
import { Analytics } from './pages/Analytics/Analytics';
import { Resources } from './pages/Resources/Resources';
import { Notes } from './pages/Notes/Notes';
import { Profile } from './pages/Profile/Profile';
import { NotFound } from './pages/NotFound/NotFound';
import { Toaster } from './components/UI/Toaster';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="curriculum" element={<Curriculum />} />
                  <Route path="curriculum/:phase/:day/:hour" element={<LessonView />} />
                  <Route path="challenges" element={<Challenges />} />
                  <Route path="challenges/:id" element={<ChallengeDetail />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:id" element={<ProjectDetail />} />
                  <Route path="planner" element={<StudyPlanner />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="resources" element={<Resources />} />
                  <Route path="notes" element={<Notes />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;