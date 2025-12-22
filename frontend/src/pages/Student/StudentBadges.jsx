import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaSpinner, FaMedal, FaStar, FaAward } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/DashboardLayout';
import { getBadges } from '../../services/api/studentService';

function StudentBadges() {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, recent, course

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            setLoading(true);
            const response = await getBadges();
            setBadges(response.data || []);
        } catch (error) {
            toast.error('Failed to load badges');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getBadgeIcon = (type) => {
        switch (type) {
            case 'gold':
                return <FaTrophy className="text-yellow-500" />;
            case 'silver':
                return <FaMedal className="text-gray-400" />;
            case 'bronze':
                return <FaAward className="text-orange-600" />;
            default:
                return <FaStar className="text-purple-600" />;
        }
    };

    const filteredBadges = badges.filter(badge => {
        if (filter === 'all') return true;
        if (filter === 'recent') {
            const badgeDate = new Date(badge.earnedAt);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return badgeDate >= thirtyDaysAgo;
        }
        return badge.type === filter;
    });

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading your badges...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            My Badges 🏆
                        </h1>
                        <p className="text-gray-600">
                            You've earned {badges.length} badge{badges.length !== 1 ? 's' : ''} so far!
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaTrophy className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{badges.filter(b => b.type === 'gold').length}</p>
                            <p className="text-sm opacity-90">Gold Badges</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaMedal className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{badges.filter(b => b.type === 'silver').length}</p>
                            <p className="text-sm opacity-90">Silver Badges</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaAward className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{badges.filter(b => b.type === 'bronze').length}</p>
                            <p className="text-sm opacity-90">Bronze Badges</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaStar className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{badges.length}</p>
                            <p className="text-sm opacity-90">Total Badges</p>
                        </motion.div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-purple-50'
                                }`}
                        >
                            All Badges
                        </button>
                        <button
                            onClick={() => setFilter('recent')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'recent'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-purple-50'
                                }`}
                        >
                            Recent
                        </button>
                        <button
                            onClick={() => setFilter('gold')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'gold'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-purple-50'
                                }`}
                        >
                            Gold
                        </button>
                        <button
                            onClick={() => setFilter('silver')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'silver'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-purple-50'
                                }`}
                        >
                            Silver
                        </button>
                        <button
                            onClick={() => setFilter('bronze')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'bronze'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-purple-50'
                                }`}
                        >
                            Bronze
                        </button>
                    </div>

                    {/* Badges Grid */}
                    {filteredBadges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBadges.map((badge, index) => (
                                <motion.div
                                    key={badge._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-5xl">
                                            {getBadgeIcon(badge.type)}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.type === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                                            badge.type === 'silver' ? 'bg-gray-100 text-gray-800' :
                                                badge.type === 'bronze' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-purple-100 text-purple-800'
                                            }`}>
                                            {badge.type?.toUpperCase() || 'BADGE'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {badge.title || 'Achievement Badge'}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-3">
                                        {badge.description || 'Earned for outstanding achievement'}
                                    </p>

                                    {badge.course && (
                                        <p className="text-purple-600 text-sm font-medium mb-2">
                                            📚 {badge.course.title}
                                        </p>
                                    )}

                                    <p className="text-gray-500 text-xs">
                                        Earned on {new Date(badge.earnedAt || badge.createdAt).toLocaleDateString()}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                            <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Badges Yet</h3>
                            <p className="text-gray-600 mb-6">
                                {filter === 'all'
                                    ? 'Complete courses and assignments to earn badges!'
                                    : `No ${filter} badges found. Try a different filter.`
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default StudentBadges;
