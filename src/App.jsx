import './App.css'

function App() {

  return (
    <>
      <h1>QU&nbsp;<span>Better Schedule</span>&nbsp;<button style={{ width:"50px", height: "40px" }}>EN</button></h1>
      <section className='step'>
        <h2>Step <span>1</span></h2>
        <p>Paste the text mentioned in <a href="https://www.youtube.com/watch?v=fOA93H6UEnc">this</a> tutorial video</p>
        <div className='input-container'>
          <textarea placeholder='Paste the text here...' cols={56} rows={12} wrap='hard'></textarea>
        </div>
      </section>
      <section className='step'>
        <h2>Step <span>2</span></h2>
        <p>Click the generate button</p>
        <div className='input-container'>
          <button style={{ width: "200px", height: "50px" }}>Generate</button>
        </div>
      </section>
      <section className='step'>
        <h2>Step <span>3</span></h2>
        <p>Screenshot the Schedule</p>
        
      </section>
    </>
  )
}

export default App
