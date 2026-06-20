import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      
      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="page-body">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
