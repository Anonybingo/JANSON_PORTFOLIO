import { useEffect, useRef, useState } from 'react'
import { start } from './engine.js'
import photo from './photo.jpg'

// ---- EDIT ME: everything you'd normally change lives here ----
const ME = {
  name: ['JANSON'],
  email: 'ndayizeyejanson15@gmail.com',
  manifesto: 'I build websites at the intersection of design, code, and play.',
  about: 'I build websites where design, code, and play meet: WebGL scenes, motion systems, and fast product interfaces.',
  roles: ['creative developer', '3D web designer', 'interface tinkerer'],
  links: [['GitHub', '#'], ['LinkedIn', '#'], ['X', '#']],
  projects: [
    { title: 'Aurora', meta: '2026 · WebGL', text: 'A real-time weather globe.', color: '#3b6fd1' },
    { title: 'Northwind', meta: '2025 · React', text: 'Design system for a logistics startup.', color: '#2d323d' },
    { title: 'Field Notes', meta: '2025 · Motion', text: 'A scroll-driven essay on glaciers.', color: '#6fae85' },
    { title: 'Halo', meta: '2024 · Creative coding', text: 'Audio-reactive tour visuals.', color: '#e27a3d' },
  ],
}

// the flipping job-title tag
function RoleFlip({ roles }) {
  const [i, setI] = useState(0)
  const [sw, setSw] = useState(false)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const ts = []
    const id = setInterval(() => {
      setSw(true)
      ts.push(setTimeout(() => setI((n) => (n + 1) % roles.length), 350), setTimeout(() => setSw(false), 700))
    }, 2600)
    return () => { clearInterval(id); ts.forEach(clearTimeout) }
  }, [roles])
  return <span className="flip"><i id="role" className={sw ? 'sw' : ''}>{roles[i]}</i></span>
}

// one project = one door that swings open
function Door({ p }) {
  const [open, setOpen] = useState(false)
  return (
    <button className={'door' + (open ? ' open' : '')} style={{ '--c': p.color }} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
      <span className="room"><b>{p.title}</b>{p.meta}<br />{p.text}</span>
      <span className="leaf"><em>{p.title}</em></span>
    </button>
  )
}

export default function App() {
  const eng = useRef(null)
  const [sound, setSound] = useState(false)
  const [light, setLight] = useState(true)

  // the imperative 3D scene + intro animation live in engine.js
  useEffect(() => {
    eng.current = start(photo)
    return () => eng.current.stop()
  }, [])

  return (
    <>
      <canvas id="gl" aria-hidden="true" />
      <div className="vig" />
      <svg id="hud" aria-hidden="true" />

      <div className="h tl"><b>{ME.name[0]}<br />{ME.name[1]}</b><p>// Portfolio {new Date().getFullYear()}<br />Available for work.</p></div>
      <aside className="h tr"><b>////// Manifesto</b>{ME.manifesto}</aside>
      <button className="h bl" onClick={() => setSound(eng.current.toggleSound())}>Sound: {sound ? 'On' : 'Off'}</button>
      <button className="h bl" style={{ left: 'calc(clamp(20px,5vw,64px) + 128px)' }} onClick={() => setLight(eng.current.toggleLight())}>Light: {light ? 'On' : 'Off'}</button>
      <div className="h hint2" id="hint">Hover or tap the blocks</div>
      <nav className="h br"><a href="#about">About</a><a href="#work">Work</a><a href="#contact">Contact</a></nav>

      <div id="intro">
        <canvas id="pc" />
        <div id="dot" />
        <h1 id="ptitle" />
        <p id="psub">Creative <i>Developer</i></p>
        <div id="cue">Scroll</div>
      </div>

      <main>
        <section className="sp" />
        <section className="sp" />
        <section id="about">
          <div className="panel">
            <p className="hi">Hi, I’m {ME.name.join(' ')}.<br />I am a <RoleFlip roles={ME.roles} /></p>
            <p className="lead">{ME.about}</p>
          </div>
        </section>
        <section id="work">
          <div className="panel">
            <h2>Magic happens behind the doors</h2>
            <p className="lead">Hover or tap a door to open the project.</p>
            <div className="doors">{ME.projects.map((p) => <Door key={p.title} p={p} />)}</div>
          </div>
        </section>
        <section id="contact">
          <div className="panel">
            <h2>Got a project?<br />Let’s build it together.</h2>
            <a className="mail" href={'mailto:' + ME.email}>{ME.email}</a>
            <div className="soc">{ME.links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>
          </div>
        </section>
      </main>
    </>
  )
}
