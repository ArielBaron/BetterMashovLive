const mashov = require('mashov-api');
const fs = require('fs');

const fetchTimetable = async (credentials) => {
    const { SEMEL, YEAR, ID, PASSWORD } = credentials;
    try {
        const loginInfo = await mashov.loginToMashov(SEMEL, YEAR, ID, PASSWORD);
        const timetable = await mashov.get(loginInfo, 'timetable');
        return timetable;
    } catch (error) {
        console.error('Error fetching timetable data:', error);
        throw error;
    }
};

module.exports = fetchTimetable;
