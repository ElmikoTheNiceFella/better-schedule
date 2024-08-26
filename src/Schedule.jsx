import React, { useEffect, useState } from 'react'
import { getCourseData, getMinTiming, getScheduleHeight } from '../functions'
import styles from './schedule.module.css'

const Schedule = ({ scheduleData }) => {

  const [schedule, setSchedule] = useState({})
  const [minTimingMargin, setMinTimingMargin] = useState(0)
  const [scheduleHeight, setScheduleHeight] = useState(0)

  /* 
    name, timing, type, building, room, margin, height, color
  */

  useEffect(() => {
    const scheduleInfo = getCourseData(scheduleData)

    setSchedule(scheduleInfo)
    setMinTimingMargin(getMinTiming(scheduleInfo))
    setScheduleHeight(getScheduleHeight(scheduleInfo))
  }, [])

  return (
    scheduleData.status != "empty" &&
    <div className={styles.scheduleContainer}>
      {Object.keys(schedule).map(day => 
        <div className={styles.day} style={{ borderRight: day != "Thursday" ? "none" : "1px solid #6c757d" }}>
          <h4 className={styles.dayName} >{day}</h4>
          <div className={styles.courseContainer} style={{ height: scheduleHeight }}>
            {schedule[day].map(course => 
              <div className={styles.course} style={{ backgroundColor: course.color, marginTop: (course.margin * 100) - minTimingMargin, height: course.height* 100 }}>
                <p className={styles.courseInfo}>{course.name} - {course.type}<br /><br />{course.timing[0]} - {course.timing[1]}<br />Bldg. {course.building} - Room: {course.room}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Schedule