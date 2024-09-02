const express = require('express');
const path = require('path'); 
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use(express.static(path.join(__dirname, '../frontend')));

let loginInfo = null;



// Handle form submission
app.post('/submit', (req, res) => {
  // Directly use req.body without parsing
  const credentials = req.body;

  // Save loginInfo to use in other endpoints
  loginInfo = credentials;

  // Send success response
  res.json({ success: true, received: credentials });
});




// Process and filter behavior data
app.get('/behavior', async (req, res) => {
  try {
    if (!loginInfo) {
      return res.status(400).json({ error: 'Not logged in to Mashov' });
    }

    const behavior = await fetchBehavior(loginInfo);

    // Process the behavior data
    const processedBehavior = behavior.map(obj => {
      if (obj.achvaName !== "נוכחות בשיעור מקוון") {
        delete obj.timestamp;
      }
      delete obj.reporterGuid;
      delete obj.lessonId;
      delete obj.achvaCode;
      delete obj.achvaAval;
      delete obj.justificationId;
      delete obj.studentGuid;
      delete obj.eventCode;
      delete obj.lessonType;
      delete obj.lessonReporter;
      obj.justified = obj.justified === 9 ? "מוצדק" : "לא מוצדק";
      delete obj.groupId;

      // Format lesson date
      const lessonDate = new Date(obj.lessonDate).toISOString().split('T')[0];
      obj.lessonDate = lessonDate.split("-").reverse().join("-");
      return obj;
    });

    res.json(processedBehavior);
  } catch (error) {
    console.error('Error fetching behavior data:', error);
    res.status(500).json({ error: 'Failed to fetch behavior data' });
  }
});

// Process and filter grades data
app.get('/grades', async (req, res) => {
  try {
    if (!loginInfo) {
      return res.status(400).json({ error: 'Not logged in to Mashov' });
    }

    const grades = await fetchGrades(loginInfo);

    // Process the grades data
    const processedGrades = grades.map(obj => {
      delete obj.groupId;
      delete obj.gradingPeriod;
      delete obj.gradeTypeId;
      delete obj.gradeRate;
      delete obj.id;
      delete obj.gradingEventId;
      delete obj.studentGuid;
      delete obj.rate;
      delete obj.year;
      return obj;
    });

    // Structure grades by subject
    const subjectGrades = {};
    processedGrades.forEach(entry => {
      const { subjectName, grade } = entry;

      if (subjectGrades[subjectName]) {
        subjectGrades[subjectName].push(grade);
      } else {
        subjectGrades[subjectName] = [grade];
      }
    });

    res.json(subjectGrades);
  } catch (error) {
    console.error('Error fetching grades data:', error);
    res.status(500).json({ error: 'Failed to fetch grades data' });
  }
});

// Process and filter timetable data
app.get('/timetable', async (req, res) => {
  try {
    if (!loginInfo) {
      return res.status(400).json({ error: 'Not logged in to Mashov' });
    }

    const timetable = await fetchTimetable(loginInfo);

    // Process the timetable data
    const processedTimetable = timetable.map(obj => {
      delete obj.groupDetails.groupInactiveTeachers;
      delete obj.groupDetails.groupId;
      delete obj.groupDetails.subjectName;

      const { day, lesson } = obj.timeTable;
      obj.groupDetails.day = day;
      obj.groupDetails.lesson = lesson;
      delete obj.timeTable;

      const teacherNames = obj.groupDetails.groupTeachers.map(teacher => teacher.teacherName);
      obj.groupDetails.teacherName = teacherNames.join(", ");
      delete obj.groupDetails.groupTeachers;

      return obj;
    });

    // Split timetableData into sublists based on the day property
    const timetableByDay = {};
    processedTimetable.forEach(obj => {
      const { day, ...rest } = obj.groupDetails;
      if (!timetableByDay[day]) {
        timetableByDay[day] = [];
      }
      timetableByDay[day].push(rest);
    });

    // Sort by lesson
    for (const day in timetableByDay) {
      timetableByDay[day].sort((a, b) => a.lesson - b.lesson);
    }

    res.json(timetableByDay);
  } catch (error) {
    console.error('Error fetching timetable data:', error);
    res.status(500).json({ error: 'Failed to fetch timetable data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});