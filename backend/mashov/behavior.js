const mashov = require('mashov-api');

const fetchBehavior = async (credentials) => {
    const { SEMEL, YEAR, userId, PASSWORD } = credentials;
    try {
        const loginInfo = await mashov.loginToMashov(SEMEL, YEAR, userId, PASSWORD);
        const behavior = await mashov.get(loginInfo, 'behave');
        return behavior;
    } catch (error) {
        console.error('Error fetching behavior data:', error);
        throw error;
    }
};

module.exports = fetchBehavior;
