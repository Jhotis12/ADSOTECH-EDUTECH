
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import FAQ from './pages/FAQ';
import Procedures from './pages/Procedures';
import Analysis from './pages/Analysis';
import Resources from './pages/Resources';
import './index.css'
import './App.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="tramites" element={<Procedures />} />
          <Route path="analisis" element={<Analysis />} />
          <Route path="recursos" element={<Resources />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
