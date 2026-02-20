import './App.css'
import { getCourseData } from '../functions'
import { TUTORIAL_LINK } from '../constants'
import Schedule from './Schedule'
import { useState } from 'react'

function App() {

  const [scheduleText, setScheduleText] = useState("")
  const [schedule, setSchedule] = useState({ status: "empty" })
  const [isRamadan, setIsRamadan] = useState(false)
  const [heightRatio, setHeightRatio] = useState(100)

  const handleGenerate = () => setSchedule(getCourseData(scheduleText, isRamadan))

  return (
    <>
      {/* Title */}
      <h1>QU&nbsp;<span>Better Schedule</span></h1>

      {/* Step 1 */}
      <section className='step'>
        <h2>Step <span>1</span></h2>
        <p className='instructions'>Paste the text mentioned in <a href={TUTORIAL_LINK}>this</a> tutorial video</p>
        <div className='input-container'>
          <textarea onChange={(e) => setScheduleText(e.target.value)} 
                    value={scheduleText} 
                    placeholder='Paste the text here...' 
                    cols={56} rows={12} 
                    wrap='hard'></textarea>
        </div>
      </section>

      {/* Step 2 */}
      {scheduleText && 
        <section className='step'>
          <h2>Step <span>2</span></h2>
          <p className='instructions'>Click the generate button</p>
          <div className='input-container'>
            <a href="#step3" id='generate' onClick={handleGenerate} style={{ width: "200px", height: "50px" }}>Generate</a>
          </div>
        </section>
      }

      {/* Step 3 */}
      {schedule.status != "empty" &&
        <section className='step'>
          <h2 id='step3'>Step <span>3</span></h2>
          <p className='instructions'>Click a course to change it's color if you want, then click the same course again to close the color change mini-window,<br/>then screenshot the schedule when you're done.</p>
            <div className='settings'>
              <div><input id='is-ramadan' type='checkbox' value={isRamadan} onChange={() => setIsRamadan(p => !p)} /><label htmlFor='is-ramadan'>&nbsp;Ramadan schedule</label></div>
              <div><input type="number" name="height-ratio" id="height-ratio" value={heightRatio} onChange={(e) => setHeightRatio(e.target.value)} /><label htmlFor='height-ratio'>&nbsp;Schedule Height</label></div>
            </div>
          {/* Schedule generation */}
          <Schedule scheduleData={scheduleText} isRamadan={isRamadan} heightRatio={heightRatio} />
        </section>
      }
    </>
  )
}

export default App
