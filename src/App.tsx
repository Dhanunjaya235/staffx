import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout/Layout';
import RoleAssignment from './pages/RoleAssignment';
import Clients from './pages/Clients';
import Jobs from './pages/Jobs';
import Resources from './pages/Resources';
import ResourceDetails from './pages/ResourceDetails';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/clients" replace />} />
            <Route path="/role-assignment" element={<RoleAssignment />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:id" element={<ResourceDetails />} />
            <Route path="/users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1><p className="text-gray-600 mt-2">User management features coming soon.</p></div>} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;