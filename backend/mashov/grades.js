const mashov = require('mashov-api');
const fs = require('fs');

const fetchGrades = async (credentials) => {
    const { SEMEL, YEAR, ID, PASSWORD } = credentials;
    try {
        const loginInfo = await mashov.loginToMashov(SEMEL, YEAR, ID, PASSWORD);
        const grades = await mashov.get(loginInfo, 'grades');
        console.log(grades);
        return grades;
    } catch (error) {
        console.error('Error fetching grades data:', error);
        throw error;
    }
};

module.exports = fetchGrades;
