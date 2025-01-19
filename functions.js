import { COLORS, DAYS, DEMO } from "./constants.js";

/* ------------- */
/* MAIN FUNCTION */
/* ------------- */

function indexOfSemester(string) {
  if (string.includes("Spring")) return string.indexOf("Spring")
  if (string.includes("Fall")) return string.indexOf("Fall")
  if (string.includes("Summer")) return string.indexOf("Summer")
  if (string.includes("Winter")) return string.indexOf("Winter")
}

export const getCourseData = (data) => {
  const regexes = {
    name: /Fall|Spring|Summer|Winter/,
    codeType: /[A-Z]{4,5}\s[0-9]{3}/,
    daysTiming: /(Sun|Mon|Tue|Wed|Thu)(\,|\s)/,
    roomBuilding: /([A-Z]{1}[0-9]{2}|[A-Z]{3})\-\s/
  }

  let schedule = {
    "Sunday": [], // [{*name, *type, building, color, height, margin, room, *timing: [XX:XX AM], type}, ...]
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
  }

  let courseDays = [];
  let courseData = {};

  for (let line of data.split("\n")) {
    console.log(line)
    line = line.trim()
    if (line.length <= 0) continue
    if (regexes.name.test(line)) {
      // --- Push Each Course Data To The Schedule ---
      if (courseDays.length > 0) {
        // Get margin & height
        [courseData.margin, courseData.height] = marginHeightCalculator(courseData.timing)

        // Get color
        courseData.color = COLORS[courseData.building] && "#8e1837"

        // Add the course to the schedule
        for (let day of courseDays) {
          schedule[day].push(courseData)
        }
        console.log(courseData)
        courseData = {}
      }
      // Get course name
      courseData.name = line.substring(0, indexOfSemester(line)).trim()
    } else if (regexes.codeType.test(line)) {
      // Get Type & Section
      courseData.type = line.split("/").map(x => x.trim())[1]
    } else if (regexes.daysTiming.test(line)) {
      // Get days of the course
      const info = line.split(" ")
      courseDays = info[0].trim().split(",").map((x) => DAYS[x])
      // Get Timing
      info.shift()
      courseData.timing = info.join("").split("-").map((x) => toAmPM(x))
    } else if (regexes.roomBuilding.test(line)) {
      // Get Room & Building
      const info = line.split(" ")
      courseData.building = info[0].substring(0, info[0].length-1)
      courseData.room = info[info.length-1]
    }
  }
  // --- Conclude Course Data ---
  if (courseDays.length > 0) {
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
  return schedule
  
}

/* ---------------- */
/* HELPER FUNCTIONS */
/* ---------------- */

// Calculating margins & heights
const marginHeightCalculator = (timing) => { 
  console.log(timing) 
  const margin = timingToNum(timing[0])
  const height = timingToNum(timing[1]) - margin

  return [margin, height]
}

function timingToNum(timing) {
  timing = toAmPM(timing)
  let hours = +timing.substring(0, 2);
  let minutes = +timing.substring(3, 5) / 60;

  if (timing.substring(5, 7) == "PM" && hours != 12) hours += 12

  return hours + minutes
}

export function getMinTiming(schedule) {
  let minTiming
  let startTime
  let counter = 0

  for (let day of Object.keys(schedule)) {
    for (let course of schedule[day]) {
      if (counter == 0 || minTiming > timingToNum(course.timing[0])) {
        minTiming = timingToNum(course.timing[0])
        startTime = course.timing[0]
      }
      counter++
    }
  }

  return [Math.floor(minTiming) * 100, startTime]
}

export function getScheduleHeight(schedule) {

  let maxTiming
  let endTime
  let counter = 0

  for (let day of Object.keys(schedule)) {
    for (let course of schedule[day]) {
      if (counter == 0 || maxTiming < timingToNum(course.timing[1])) {
        maxTiming = timingToNum(course.timing[1])
        endTime = course.timing[1]
      }
      counter++
    }
  }

  return [(maxTiming * 100) - getMinTiming(schedule)[0], endTime]
}

function numToTiming(num, offset) {
  let suffix = "AM"
  let hours = Math.floor(num)
  let height = (num % 1 == 0 ? 1 : num % 1) * offset

  if (hours >= 12) {
    suffix = "PM"
    hours -= (hours == 12 ? 0 : 12)
  }

  const result = ("" + hours).padStart(2, '0') + ":00" + suffix

  return [result, height]
}

export function getBackgroundTimings(startTime, endTime, offset = 100) {
  let duration = timingToNum(endTime) - timingToNum(startTime)
  let counter = 1;
  let finalTimings = [numToTiming(timingToNum(endTime), offset)]
  endTime = numToTiming(timingToNum(endTime), offset)[0]

  while (duration > 1) {
    finalTimings.unshift(numToTiming(timingToNum(endTime) - counter, offset))
    counter++
    duration--
  }

  return finalTimings
}
const toAmPM = (timing) => {
  if (timing.length > 5) return timing
  let hours = +timing.substring(0, 2)
  let suffix = "AM"
  if (hours >= 12) {
    suffix = "PM"
    hours -= (hours > 12 ? 12 : 0)
  }
  return String(hours).padStart(2, '0') + timing.substring(2, timing.length) + suffix
}

getCourseData(DEMO)
// console.log(getMinTiming(getCourseData(DEMO)))
// console.log(getBackgroundTimings(getMinTiming(getCourseData(DEMO))[1], getScheduleHeight(getCourseData(DEMO))[1], 100))