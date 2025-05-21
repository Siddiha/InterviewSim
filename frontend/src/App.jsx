import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AIAssistantProvider } from './context/AIAssistantContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AIAssistantProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/questions" element={
                    <ProtectedRoute>
                      <Questions />
                    </ProtectedRoute>
                  } />
                  <Route path="/questions/:id" element={
                    <ProtectedRoute>
                      <QuestionDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AIAssistantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
