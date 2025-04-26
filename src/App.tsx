import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AddProjectPage from './pages/AddProjectPage';
import AddCertificatesPage from './pages/AddCertificatesPage';
import AddItemSelection from './pages/AddItemSelection';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/add-project" element={<AddProjectPage />} />
          <Route path="/add-certificates" element={<AddCertificatesPage/>}/>
          <Route path="/add-item-selection" element={<AddItemSelection />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
