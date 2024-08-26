import React, { useEffect, useState } from 'react'
import { getCourseData } from '../functions'
import styles from './schedule.module.css'

const Schedule = ({ scheduleData }) => {

  const [schedule, setSchedule] = useState({})

  useEffect(() => {
    setSchedule(getCourseData(scheduleData))
  }, [])

  return (
    <div className={styles.scheduleContainer}>
      {Object.keys(schedule).map(day => 
        <div className={styles.day}>
          <h4 className={styles.dayName}>{day}</h4>
          <div className={styles.courseContainer}>
            {schedule[day].map(course => 
              <>
                
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Schedule