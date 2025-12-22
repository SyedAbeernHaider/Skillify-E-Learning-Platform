require('dotenv').config();

const fileKitConfig = {
    apiKey: process.env.FILEKIT_API_KEY,
    apiSecret: process.env.FILEKIT_API_SECRET,
    baseURL: 'https://api.filekit.io/v1',
};

module.exports = fileKitConfig;
