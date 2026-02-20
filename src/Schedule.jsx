import React, { useEffect, useState } from 'react'
import { getCourseData, getMinTiming, getScheduleHeight, getBackgroundTimings, ramadanTiming } from '../functions'
import styles from './schedule.module.css'

const Schedule = ({ scheduleData, isRamadan, heightRatio }) => {

  const colors = ["#343a40", "#b81f47", "#b81f6b", "#b81fae", "#761fb8", "#1f66b8", "#1fb8b3", "#1fb834", "#b8a31f", "#b8661f"]
  const actualColors = ["#343a40", "#8e1837", "#8e1853", "#8e1886", "#5b188e", "#184f8e", "#188e8a", "#188e28", "#8e7e18", "#8e4f18"]

  const [schedule, setSchedule] = useState({})
  const [minTimingMargin, setMinTimingMargin] = useState(0)
  const [scheduleHeight, setScheduleHeight] = useState(0)
  const [times, setTimes] = useState([])
  const [customColors, setCustomColors] = useState({})
  const [activeCourse, setActiveCourse] = useState(-1)

  /* 
    name, timing, type, building, room, margin, height, color
  */

  const handleActiveCourse = (num) => 
    setActiveCourse(() => num == activeCourse ? -1 : num)

  const handleColorChange = (name, type, index) => 
    setCustomColors(p => ({...p, [name+type]:  actualColors[index]}))

  useEffect(() => {
    const scheduleInfo = getCourseData(scheduleData, isRamadan)
    const [minTiming, scheduleHeight] = [getMinTiming(scheduleInfo)[0], getScheduleHeight(scheduleInfo)[0]]
    
    setSchedule(scheduleInfo)
    setMinTimingMargin(minTiming)
    setScheduleHeight(scheduleHeight)
    setTimes(getBackgroundTimings(getMinTiming(scheduleInfo)[1], getScheduleHeight(scheduleInfo)[1], heightRatio))
  }, [isRamadan, heightRatio])

  return (
    <>
      <div id="schedule" className={styles.scheduleContainer}>
        {Object.keys(schedule).map((day, j) => 
          <div key={day+`${j}`} className={styles.day} style={{ 
            borderRight: day != "Thursday" ? "none" : "1px solid #6c757d" }}>
              <h4 className={styles.dayName} >{day}</h4>
              <div className={styles.courseContainer} style={{ 
                height: scheduleHeight * (heightRatio/100) }}>
              {schedule[day].map((course, k) => 
                  <>
                    {/* Color change */}
                    <div key={course.timing[0] + `${k} color`} style={{ 
                      border: "1px solid #343a40", 
                      top: (course.margin * heightRatio) - minTimingMargin - 80, 
                      display: (j*13)+k == activeCourse ? "flex" : "none", 
                      flexWrap: "wrap" }} className={styles.colorChange}>
                        {colors.map((color, idx) => 
                          <div onClick={() => handleColorChange(course.name, course.type, idx)} 
                              key={color} 
                              style={{ 
                                backgroundColor: color, 
                                width: 38, 
                                height: 38, 
                                border: "1px solid #343a40" }}></div>)}
                          </div>
                    {/* Course Data (Name, Time, Location) */}
                    <div onClick={() => handleActiveCourse((j * 13) + k)} key={course.timing[0] + `${k}`} className={styles.course} style={{ 
                      backgroundColor: customColors[course.name + course.type] ? customColors[course.name + course.type] : course.color, 
                      top: (course.margin * heightRatio) - minTimingMargin * (heightRatio/100), 
                      height: course.height * heightRatio }}>
                        <p className={styles.courseInfo}>
                          <span className={styles.bold}>{course.name} - {course.type}</span>
                          <br />{course.timing[0]} - {course.timing[1]}
                          <br />Bldg. <span className={styles.bold}>{course.building}</span> - Room: <span className={styles.bold}>{course.room}</span>
                        </p>
                    </div>
                  </>
              )}
            </div>
          </div>
        )}
        {/* Schedule format (the timings on the left side and Monday Tuesday thursday that kinda stuff) */}
        <div className={styles.timesContainer}>
          {times.map((time, i) => {
            return (
              <div key={time[0]+`${i}`} 
                  className={styles.time} 
                  style={{ height: time[1], top: i * heightRatio, borderBottom: times.length == 3 ? "1px solid #6c757d" : "none" }}>
                    {time[0]}
              </div>
            )
          }
          )}
        </div>
        <div className={styles.bottom}></div>
      </div>
    </>
  )
}

export default Schedule