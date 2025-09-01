import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout/Layout';
import RoleAssignment from './pages/RoleAssignment';
import Clients from './pages/Clients';
import Vendors from './pages/Vendors';
import Jobs from './pages/Jobs';
import Resources from './pages/Resources';
import ResourceDetails from './pages/ResourceDetails';
import GlobalLoader from './components/UI/GlobalLoader/GlobalLoader';

function App() {
  return (
    <Provider store={store}>
      <GlobalLoader />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/clients" replace />} />
            <Route path="/role-assignment" element={<RoleAssignment />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:id" element={<ResourceDetails />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;