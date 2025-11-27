
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import FAQ from './pages/FAQ';
import Procedures from './pages/Procedures';
import Analysis from './pages/Analysis';
import Resources from './pages/Resources';
import StudentDashboard from './pages/StudentDashboard';
import './index.css'
import './App.css'

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="landing" element={<Landing />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="tramites" element={<Procedures />} />
            <Route path="analisis" element={<Analysis />} />
            <Route path="recursos" element={<Resources />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
