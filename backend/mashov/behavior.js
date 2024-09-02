const mashov = require('mashov-api');
const fs = require('fs');

const fetchBehavior = async (credentials) => {
    const { SEMEL, YEAR, ID, PASSWORD } = credentials;
    try {
        const loginInfo = await mashov.loginToMashov(SEMEL, YEAR, ID, PASSWORD);
        const behavior = await mashov.get(loginInfo, 'behave');
        return behavior;
    } catch (error) {
        console.error('Error fetching behavior data:', error);
        throw error;
    }
};

module.exports = fetchBehavior;
