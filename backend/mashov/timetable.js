const mashov = require('mashov-api');

const fetchTimetable = async (credentials) => {
    const { SEMEL, YEAR, username, PASSWORD } = credentials;
    try {
        const loginArray = await mashov.loginToMashov(SEMEL, YEAR, username, PASSWORD);
        const loginInfo = loginArray[0];
        const timetable = await mashov.get(loginInfo, 'timetable');
        return timetable;
    } catch (error) {
        console.error('Error fetching timetable data:', error);
        throw error;
    }
};

module.exports = fetchTimetable;
