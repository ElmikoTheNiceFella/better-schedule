const demoData = `
Arabic Language I | Arabic Language 100 Section L09 | Class Begin: 08/25/2024 | Class End: 12/05/2024
Registered
08/25/2024 -- 12/05/2024   Sunday,Tuesday
S
M
T
W
T
F
S
   03:30 PM - 04:45 PM Type: Class Location: All Building: I09- College of Law Room: A110
Instructor: ElKhrashy, Youssry (Primary)
CRN: 11045
Calculus I | Mathematics 101 Section L01 | Class Begin: 08/25/2024 | Class End: 12/05/2024
Registered
08/25/2024 -- 12/05/2024   Sunday,Tuesday,Thursday
S
M
T
W
T
F
S
   12:00 PM - 12:50 PM Type: Class Location: Male Designated Area Building: BCR- Corridor Room: I111
Instructor: El-Sanfaz, Mustafa (Primary)
CRN: 11333
Calculus I | Mathematics 101 Section B02 | Class Begin: 08/25/2024 | Class End: 12/05/2024
Registered
08/25/2024 -- 12/05/2024   Thursday
S
M
T
W
T
F
S
   01:00 PM - 01:50 PM Type: Lab Location: Male Designated Area Building: BCR- Corridor Room: I110
Instructor: Dabboorasad, Yousef (Primary)
CRN: 11668
History of Qatar | History 121 Section L06 | Class Begin: 08/25/2024 | Class End: 12/05/2024
Registered
08/25/2024 -- 12/05/2024   Sunday,Tuesday,Thursday
S
M
T
W
T
F
S
   05:00 PM - 05:50 PM Type: Class Location: All Building: H08- Business & Econ. Bldg. Room: D107
Instructor: Hayajneh, Raed (Primary)
CRN: 10590
Introduction to Psychology | Education Psychology 201 Section L01 | Class Begin: 08/25/2024 | Class End: 12/05/2024
Registered
08/25/2024 -- 12/05/2024   Monday,Wednesday
S
M
T
W
T
F
S
   03:30 PM - 04:45 PM Type: Class Location: All Building: I10- College of Education Room: C202
Instructor: ElSawaf, Mona
CRN: 12787
Islamic Culture | Dawa 111 Section L05 | Class Begin: 08/25/2024 | Class End: 12/05/2024
Registered
08/25/2024 -- 12/05/2024   Monday,Wednesday
S
M
T
W
T
F
S
   05:00 PM - 06:15 PM Type: Class Location: All Building: H08- Business & Econ. Bldg. Room: D214
Instructor: Laabdi, Mourad (Primary)
CRN: 12009`

/* ------------- */
/* MAIN FUNCTION */
/* ------------- */

const getCourseData = (data) => {
  const regexes = {
    days: /\d{2}\/\d{2}\/\d{2}/,
    timing: /\d{2}\:\d{2}\s(PM|AM)\s\-\s\d{2}\:\d{2}\s(PM|AM)/
  }

  let schedule = {
    "Sunday": [],
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
  }

  let courseDays;
  let courseData = {};

  for(let line of data.split("\n")) {
    if (line.includes("|")) {
      // Get course name
      courseData.name = line.substring(0, line.indexOf("|"))

    } else if (regexes.days.test(line)) {
      // Get days of the course
      courseDays = line.split("   ")[1].split(",")

    } else if (regexes.timing.test(line)) {
      const information = line.split(/Type: |Building: |Room: /)
      // Get timing
      courseData.timing = information[0].trim().split(" - ")
      
      // Get type
      courseData.type = information[1].split(" ")[0] == "Class" ? "Lecture" : "Lab"

      // Get building
      courseData.building = information[2].substring(0, information[2].indexOf("-"))

      // Get room
      courseData.room = information[3]
    } else if (line.includes("CRN")) {
      // Get margin & height
      [courseData.margin, courseData.height] = marginHeightCalculator(courseData.timing)

      for (let day of courseDays) {
        schedule[day].push(courseData)
      }
      courseData = {}
    }
  }

  console.log(schedule)
}

/* ---------------- */
/* HELPER FUNCTIONS */
/* ---------------- */

// Calculating margins & heights
const marginHeightCalculator = (timing) => {
  const margin = timingToNum(timing[0])
  const height = timingToNum(timing[1]) - margin

  return [margin, height]
}

function timingToNum(timing) {
  let hours = +timing.substring(0, 2);
  let minutes = +timing.substring(3, 5) / 60;

  if (timing.substring(6, 8) == "PM" && hours != 12) hours += 12

  return hours + minutes
}