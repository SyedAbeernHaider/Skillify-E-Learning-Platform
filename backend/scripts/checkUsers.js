require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const fs = require('fs');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkUsers = async () => {
    let output = '';

    try {
        await connectDB();

        // Find all users and include password field
        const users = await User.find({}).select('+password');

        output += `\nTotal users: ${users.length}\n\n`;

        let usersWithoutPassword = 0;
        let usersWithPassword = 0;

        users.forEach((user) => {
            if (!user.password) {
                usersWithoutPassword++;
                output += `❌ User WITHOUT password:\n`;
                output += `   Email: ${user.email}\n`;
                output += `   Name: ${user.firstName} ${user.lastName}\n`;
                output += `   Role: ${user.role}\n`;
                output += `   Created: ${user.createdAt}\n\n`;
            } else {
                usersWithPassword++;
            }
        });

        output += `\n📊 Summary:\n`;
        output += `   Users with password: ${usersWithPassword}\n`;
        output += `   Users without password: ${usersWithoutPassword}\n`;

        if (usersWithoutPassword > 0) {
            output += `\n⚠️  Found ${usersWithoutPassword} user(s) without password!\n`;
            output += `   These users cannot log in using email/password.\n`;
            output += `   You may need to delete these users or set a password for them.\n`;
        } else {
            output += `\n✅ All users have passwords set.\n`;
        }

        // Write to file
        fs.writeFileSync('user-check-report.txt', output);
        console.log(output);
        console.log('\n📄 Report saved to user-check-report.txt');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
