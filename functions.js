import { COLORS, DAYS, DEMO, RAMADAN_HOURS } from "./constants.js";

/* ------------- */
/* MAIN FUNCTION */
/* ------------- */

function indexOfSemester(string) {
  if (string.includes("Spring")) return string.indexOf("Spring")
  if (string.includes("Fall")) return string.indexOf("Fall")
  if (string.includes("Summer")) return string.indexOf("Summer")
  if (string.includes("Winter")) return string.indexOf("Winter")
}

function splitLectureAndLab(data) {
  const lines = data.split("\n")
  let newData = ""
  for(let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Lecture") && lines[i].includes("Lab")) {
      let line = lines[i].split("/")
      newData += line.join("/") +"\n"
      newData += lines[i+4]+"\n"+lines[i+5]+"\n"
      newData += lines[i-1]+"\n"
      newData += line.join("/") +"\n"
      newData += lines[i+2]+"\n"+lines[i+3]+"\n"
      i+=5
    } else {
      newData += lines[i]+"\n"
    }
  }
  return newData
}

function infoCheck(courseData) {
  return courseData.name && courseData.type && courseData.timing && courseData.room && courseData.building
}

export const getCourseData = (rawData, ramadan = false) => {
  const data = splitLectureAndLab(rawData)

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
    line = line.trim()
    if (line.length <= 0) continue
    if (regexes.name.test(line)) {
      // --- Push Each Course Data To The Schedule ---
      if (courseDays.length > 0 && infoCheck(courseData)) {
        // Get margin & height
        const [margin, height] = marginHeightCalculator(courseData.timing)
        courseData.margin = margin
        courseData.height = height
        // Get color
        courseData.color = COLORS[courseData.building] ? COLORS[courseData.building] : "#8e1837"

        // Add the course to the schedule
        for (let day of courseDays) {
          schedule[day].push(courseData)
        }
        courseData = {}
      }
      // Get course name
      courseData.name = line.substring(0, indexOfSemester(line)).trim()
    } else if (regexes.codeType.test(line)) {
      // Get Type & Section
      courseData.type = line.split("/").map(x => x.trim())[1] + (line.split("/").length > 3 ? " | "+line.split("/").map(x => x.trim())[2]:"")
    } else if (regexes.daysTiming.test(line)) {
      // Get days of the course
      const info = line.split(" ")
      courseDays = info[0].trim().split(",").map((x) => DAYS[x])
      // Get Timing
      info.shift()
      const formattedTiming = info.join("").split("-").map((x) => toAmPM(x))
      courseData.timing = ramadan ? ramadanTiming(formattedTiming) : formattedTiming;
    } else if (regexes.roomBuilding.test(line)) {
      // Get Room & Building
      const info = line.split(" ")
      courseData.building = info[0].substring(0, info[0].length - 1)
      courseData.room = info[info.length - 1]
    }
  }
  // --- Conclude Course Data ---
  if (courseDays.length > 0) {
    // Get margin & height
    const [margin, height] = marginHeightCalculator(courseData.timing)
    courseData.margin = margin
    courseData.height = height

    // Get color
    courseData.color = COLORS[courseData.building] ? COLORS[courseData.building] : "#8e1837"

    // Add the course to the schedule
    for (let day of courseDays) {
      if (courseData.margin == -1 || courseData.height == -1) continue
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
function marginHeightCalculator(timing) {
  if (!timing) return [-1, -1]
  console.log(timing)
  const margin = timingToNum(timing[0])
  const height = timingToNum(timing[1]) - margin

  return [margin, height]
}

function timingToNum(timing) {
  timing = toAmPM(timing)
  let hours = +timing.split(":")[0];
  let minutes = +timing.split(":")[1].substring(0, 2) / 60;

  if (timing.substring(timing.length-2, timing.length) == "PM" && hours != 12) hours += 12

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
      console.log(course.timing[1], timingToNum(course.timing[1]))
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
  console.log(startTime, endTime)
  let duration = timingToNum(endTime) - timingToNum(startTime)
  let counter = 1;
  let finalTimings = [numToTiming(timingToNum(endTime), offset)]
  endTime = numToTiming(timingToNum(endTime), offset)[0]

  while (duration > 0) {
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

function convertTo24Hour(time) {
  let [_, hours, minutes, period] = time.match(/(\d{2}):(\d{2})(AM|PM)/);
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return [hours, minutes] // hours * 60 + minutes; Convert time to total minutes
}

function convertTo12Hour(hours, minutes) {
  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12 for AM times
  let formattedMinutes = String(minutes).padStart(2, "0");
  return `${hours}:${formattedMinutes}${period}`;
}

function calculateMinutesBetween(startTime, endTime) {

  let [startHours, startMins] = convertTo24Hour(startTime);
  console.log(startHours, startMins)
  let startMinutes = startHours * 60 + startMins

  let [endHours, endMins] = convertTo24Hour(endTime);
  let endMinutes = endHours * 60 + endMins

  console.log(endMinutes, startMinutes)

  return Math.abs(endMinutes - startMinutes); // Return absolute difference
}

const ramadanDuration = (mins) => mins > 75 ? 170 : mins;

export const ramadanTiming = (timing, day) => {
  const STT = ["Sunday", "Tuesday", "Thursday"]
  const key = STT.includes(day) ? "STT" : "MW";

  console.log(timing)
  const duration = calculateMinutesBetween(timing[0], timing[1])
  const isLab = duration > 75 // Minutes
  console.log(isLab, duration, timing[0], RAMADAN_HOURS[key][timing[0]])
  if (RAMADAN_HOURS[key][timing[0]] && (isLab) == (timing[0] == "03:30PM")) {
    const startTime = RAMADAN_HOURS[key][timing[0]]
    let [hours, minutes] = convertTo24Hour(startTime)
    let totalMinutes = hours * 60 + minutes + ramadanDuration(duration);
    let newHours = Math.floor(totalMinutes / 60);
    let newMinutes = totalMinutes % 60;
    const endTime = convertTo12Hour(newHours, newMinutes);
    return [startTime, endTime]
  }
  return timing
}

console.log(getCourseData(DEMO))