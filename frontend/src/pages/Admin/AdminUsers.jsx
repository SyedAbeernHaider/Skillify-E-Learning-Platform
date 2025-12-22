import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaSpinner, FaSearch, FaToggleOn, FaToggleOff, FaUserShield, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/DashboardLayout';
import { getAllUsers, toggleUserStatus } from '../../services/api/adminService';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toggling, setToggling] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            setUsers(response.data || []);
        } catch (error) {
            toast.error('Failed to load users');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            setToggling(userId);
            await toggleUserStatus(userId);
            toast.success('User status updated');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user status');
        } finally {
            setToggling(null);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && user.isActive) ||
            (statusFilter === 'inactive' && !user.isActive);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <FaUserShield className="text-red-600" />;
            case 'instructor': return <FaChalkboardTeacher className="text-blue-600" />;
            case 'student': return <FaUserGraduate className="text-green-600" />;
            default: return <FaUsers />;
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="admin">
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading users...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const stats = [
        { title: 'Total Users', value: users.length, color: 'from-purple-500 to-purple-600' },
        { title: 'Students', value: users.filter(u => u.role === 'student').length, color: 'from-green-500 to-green-600' },
        { title: 'Instructors', value: users.filter(u => u.role === 'instructor').length, color: 'from-blue-500 to-blue-600' },
        { title: 'Active Users', value: users.filter(u => u.isActive).length, color: 'from-yellow-500 to-yellow-600' },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            User Management 👥
                        </h1>
                        <p className="text-gray-600">Manage all platform users</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}
                            >
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <p className="text-sm opacity-90">{stat.title}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="student">Students</option>
                                <option value="instructor">Instructors</option>
                                <option value="admin">Admins</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {filteredUsers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredUsers.map((user, index) => (
                                            <motion.tr
                                                key={user._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.02 }}
                                                className="hover:bg-purple-50 transition"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                                            {user.firstName?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {getRoleIcon(user.role)}
                                                        <span className="capitalize font-medium">{user.role}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleToggleStatus(user._id)}
                                                        disabled={toggling === user._id}
                                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                                                    >
                                                        {toggling === user._id ? (
                                                            <FaSpinner className="animate-spin" />
                                                        ) : user.isActive ? (
                                                            <><FaToggleOff /> Deactivate</>
                                                        ) : (
                                                            <><FaToggleOn /> Activate</>
                                                        )}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Users Found</h3>
                                <p className="text-gray-600">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default AdminUsers;
