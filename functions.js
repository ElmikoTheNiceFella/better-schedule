import { COLORS } from "./constants.js";

/* ------------- */
/* MAIN FUNCTION */
/* ------------- */

export const getCourseData = (data) => {
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

  try {
      for(let line of data.split("\n")) {
        if (line.includes("|")) {
          // Get course name
          courseData.name = line.substring(0, line.indexOf("|")).trim()
    
        } else if (regexes.days.test(line)) {
          // Get days of the course
          courseDays = line.split("   ")[1].split(",")
    
        } else if (regexes.timing.test(line)) {
          const information = line.split(/Type: |Building: |Room: /)
          // Get timing
          courseData.timing = information[0].trim().split(" - ")
          
          // Get type
          courseData.type = information[1].split(" ")[0] == "Class" ? "LEC" : "LAB"
    
          // Get building
          courseData.building = information[2].substring(0, information[2].indexOf("-"))
    
          // Get room
          courseData.room = information[3]
        } else if (line.includes("CRN")) {
          // Get margin & height
          [courseData.margin, courseData.height] = marginHeightCalculator(courseData.timing)
    
          // Get color
          courseData.color = COLORS[courseData.building] ? COLORS[courseData.building] : "#8e1837"
    
          // Add the course to the schedule
          for (let day of courseDays) {
            schedule[day].push(courseData)
          }
          courseData = {}
        }
      }
      return schedule
  } catch(e) {
    console.log(e.message)
    return schedule
  }
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

export function getMinTiming(schedule) {
  let minTiming;
  let counter = 0;

  for(let day of Object.keys(schedule)) {
    for(let course of schedule[day]) {
      if (counter == 0) minTiming = timingToNum(course.timing[0])
      else if (minTiming > timingToNum(course.timing[0])) minTiming = timingToNum(course.timing[0])
      counter++
    }
  }

  return minTiming * 100
}

export function getScheduleHeight(schedule) {
  let maxTiming;
  let counter = 0;

  for (let day of Object.keys(schedule)) {
    for (let course of schedule[day]) {
      if (counter == 0) maxTiming = timingToNum(course.timing[1])
      else if (maxTiming < timingToNum(course.timing[1])) maxTiming = timingToNum(course.timing[1])
      counter++
    }
  }

  return (maxTiming * 100) - getMinTiming(schedule)
}