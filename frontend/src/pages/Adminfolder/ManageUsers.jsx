import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// --- Backend Friendly ---
// Yeh mock data hai. Asal mein yeh API se aaye ga.
const mockUsers = [
  { id: 1, name: "Emily Watson", email: "emily@example.com", role: "user", joined: "2024-10-01" },
  { id: 2, name: "David Johnson", email: "david@example.com", role: "user", joined: "2024-09-15" },
  { id: 3, name: "Tahira Ali", email: "tahira@example.com", role: "user", joined: "2024-08-22" },
  { id: 4, name: "Mohammad Iqbal", email: "iqbal@example.com", role: "user", joined: "2024-07-30" },
  { id: 5, name: "Admin User", email: "admin@skillify.com", role: "admin", joined: "2024-01-01" },
];

// Backend call ko simulate karein
const fetchUsers = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 1000); // 1 second delay
  });
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []); // Sirf ek baar load hoga

  const handleEdit = (userId) => {
    alert(`User ID ${userId} ko edit karein`);
  };

  const handleDelete = (userId) => {
    if (window.confirm(`Kya aap waqai User ID ${userId} ko delete karna chahte hain?`)) {
      setUsers(users.filter(user => user.id !== userId)); // Frontend se remove karein (simulation)
      alert(`User ID ${userId} delete ho gaya`);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        // --- Users Table ---
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{user.joined}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(user.id)} className="text-purple-600 hover:text-purple-900 mr-4 transition-colors">
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 transition-colors">
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;