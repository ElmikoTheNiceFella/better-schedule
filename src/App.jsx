import './App.css'
import { getCourseData } from '../functions'
import { TUTORIAL_LINK, DEMO_DATA } from '../constants'
import Schedule from './Schedule'
import { useState } from 'react'

function App() {

  const [scheduleText, setScheduleText] = useState("")
  const [schedule, setSchedule] = useState({ status: "empty" })

  const handleGenerate = () => setSchedule(getCourseData(scheduleText))

  return (
    <>
      {/* Title */}
      <h1>QU&nbsp;<span>Better Schedule</span>&nbsp;<button style={{ width:"50px", height: "40px" }}>EN</button></h1>

      {/* Step 1 */}
      <section className='step'>
        <h2>Step <span>1</span></h2>
        <p>Paste the text mentioned in <a href={TUTORIAL_LINK}>this</a> tutorial video</p>
        <div className='input-container'>
          <textarea onChange={(e) => setScheduleText(e.target.value)} 
                    value={scheduleText} 
                    placeholder='Paste the text here...' 
                    cols={56} rows={12} 
                    wrap='hard'></textarea>
        </div>
      </section>

      {/* Step 2 */}
      <section className='step'>
        <h2>Step <span>2</span></h2>
        <p>Click the generate button</p>
        <div className='input-container'>
          <button style={{ width: "200px", height: "50px" }}>Generate</button>
        </div>
      </section>

      {/* Step 3 */}
      <section className='step'>
        <h2>Step <span>3</span></h2>
        <p>Screenshot the Schedule</p>
        {/* Schedule generation */}
        <Schedule scheduleData={DEMO_DATA} />
      </section>
    </>
  )
}

export default App
