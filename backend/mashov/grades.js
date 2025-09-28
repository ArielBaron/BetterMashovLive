const mashov = require('mashov-api');

const fetchGrades = async (credentials) => {
    const { SEMEL, YEAR, username, PASSWORD } = credentials;
    try {
        const loginArray = await mashov.loginToMashov(SEMEL, YEAR, username, PASSWORD);
        const loginInfo = loginArray[0];
        const grades = await mashov.get(loginInfo, 'grades');
        return grades;
    } catch (error) {
        console.error('Error fetching grades data:', error);
        throw error;
    }
};

module.exports = fetchGrades;
