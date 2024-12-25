import React from 'react';
import Sidebar from './SideBar';

const AdminPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Admin page content */}
        <h1 className="text-3xl font-semibold">Welcome to the Admin Panel</h1>
        {/* The content will depend on the route */}
      </div>
    </div>
  );
};

export default AdminPage;
