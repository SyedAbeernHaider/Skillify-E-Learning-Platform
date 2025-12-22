require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const fixUsers = async () => {
    try {
        await connectDB();

        // Find users without passwords
        const users = await User.find({}).select('+password');
        const usersWithoutPassword = users.filter(user => !user.password);

        if (usersWithoutPassword.length === 0) {
            console.log('✅ No users without passwords found.');
            process.exit(0);
        }

        console.log(`\n⚠️  Found ${usersWithoutPassword.length} user(s) without password:\n`);

        usersWithoutPassword.forEach((user, index) => {
            console.log(`${index + 1}. Email: ${user.email}`);
            console.log(`   Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Created: ${user.createdAt}\n`);
        });

        console.log('Options:');
        console.log('1. Delete all users without passwords');
        console.log('2. Exit without making changes');

        rl.question('\nEnter your choice (1 or 2): ', async (answer) => {
            if (answer === '1') {
                try {
                    const userIds = usersWithoutPassword.map(u => u._id);
                    const result = await User.deleteMany({ _id: { $in: userIds } });
                    console.log(`\n✅ Deleted ${result.deletedCount} user(s) without passwords.`);
                } catch (error) {
                    console.error('Error deleting users:', error);
                }
            } else {
                console.log('\n❌ No changes made.');
            }

            rl.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('Error:', error);
        rl.close();
        process.exit(1);
    }
};

fixUsers();
