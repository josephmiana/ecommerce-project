import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar"; // Import the Sidebar

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch users from the /users/list route
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Function to toggle user admin status
  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/${userId}/setAsAdmin`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAdmin: !currentStatus, // Toggle the admin status
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user admin status");
      }

      // Refresh the user list after status update
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, isAdmin: !currentStatus } : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user admin status:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Admin - User Management</h1>

        {/* Table structure */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">User Name</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Admin Status</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}
                  >
                    <td className="py-2 px-4 text-sm text-gray-800">{user.name}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{user.email}</td>
                    <td className="py-2 px-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs ${
                          user.isAdmin ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm">
                      <button
                        onClick={() => toggleAdminStatus(user._id, user.isAdmin)}
                        className={`py-2 px-4 rounded-md text-white font-semibold ${
                          user.isAdmin ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {user.isAdmin ? "Demote" : "Promote"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-600">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
