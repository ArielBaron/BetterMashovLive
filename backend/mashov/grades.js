const mashov = require('mashov-api');

const fetchGrades = async (credentials) => {
    const { SEMEL, YEAR, userId, PASSWORD } = credentials;
    try {
        const loginInfo = await mashov.loginToMashov(SEMEL, YEAR, userId, PASSWORD);
        const grades = await mashov.get(loginInfo, 'grades');
        return grades;
    } catch (error) {
        console.error('Error fetching grades data:', error);
        throw error;
    }
};

module.exports = fetchGrades;
