import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { start } from './engine.js'
import { ME } from './content.js'
import photo from './photo.jpg'

const range = (n) => [...Array(n).keys()]

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

// A 3D door modelled on the reference: slim arch, stone frame, thick grooved slab on a left hinge that swings
// inward, brass plate, lever handle + keyhole, dark tunnel behind. Layers stacked in Z fake the thickness.
function DoorView({ p, cls, dref, idx, ...rest }) {
  return (
    <div className={'dw ' + cls} style={{ '--c': p.color, '--i': idx || 0 }}>
      <div ref={dref} className="door" {...rest}>
        <span className="tilt">
          {range(4).map((k) => <i key={'r' + k} className="ring" style={{ '--k': k, transform: `translateZ(${-k * 5}px)` }} />)}
          {range(4).map((k) => <i key={'t' + k} className="tun" style={{ '--k': k, transform: `translateZ(${-40 - k * 40}px)` }} />)}
          <span className="wall" />
          <span className="leaf">
            {range(5).map((k) => <i key={'e' + k} className="edge" style={{ transform: `translateZ(${-(k + 1) * 3}px)` }} />)}
            <span className="face"><i className="shade" /><em>{p.title}</em><i className="key" /></span>
          </span>
        </span>
      </div>
    </div>
  )
}

function Door({ p, i, cls, onHover, onEnter }) {
  const ref = useRef(null)
  const tilt = (x, y) => { ref.current.style.setProperty('--tx', x); ref.current.style.setProperty('--ty', y) }
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    tilt(((e.clientX - r.left) / r.width - 0.5).toFixed(3), ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
    onHover(i)
  }
  const go = () => onEnter(i, ref.current.getBoundingClientRect(), ref.current.style.getPropertyValue('--tx') || 0, ref.current.style.getPropertyValue('--ty') || 0)
  return (
    <DoorView p={p} cls={cls} dref={ref} idx={i} role="button" tabIndex={0} aria-label={'Open ' + p.title}
      onPointerEnter={() => onHover(i)} onPointerLeave={() => { onHover(-1); tilt(0, 0) }} onPointerMove={move}
      onFocus={() => onHover(i)} onBlur={() => onHover(-1)} onClick={go}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go() } }} />
  )
}

// walking in: the door zooms up and swings open, you pass through the doorway in a flash of light, the project appears
function Room({ p, rm, close }) {
  const ref = useRef(null)
  const { rect, phase } = rm
  useEffect(() => { ref.current.querySelector('.back').focus({ preventScroll: true }) }, [])
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && close()
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [close])
  const s = Math.min((innerHeight / rect.height) * 1.12, innerWidth / rect.width)
  const dx = innerWidth / 2 - (rect.left + rect.width / 2)
  const dy = innerHeight / 2 - (rect.top + rect.height / 2)
  const vars = { '--c': p.color, '--t1': `translate(${dx}px,${dy}px) scale(${s})`, '--t2': `translate(${dx}px,${dy}px) scale(${s * 3.4})` }
  return createPortal(
    <div ref={ref} className={'rm p' + phase + (rm.closing ? ' closing' : '')} style={vars} role="dialog" aria-modal="true" aria-label={p.title}>
      <div className="stage" style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}>
        <DoorView p={p} cls={phase ? 'on in' : rm.wasOpen ? 'on' : ''} style={{ '--tx': phase ? 0 : rm.tx, '--ty': phase ? 0 : rm.ty }} />
      </div>
      <div className="info">
        <small>{p.meta}</small>
        <h3>{p.title}</h3>
        <p>{p.details}</p>
        <ul>{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        <a className="visit" href={p.url} target="_blank" rel="noreferrer">View project</a>
      </div>
      <button className="back" onClick={close}>← Back to the doors</button>
    </div>, document.body)
}

// hover = that door opens (others dim), unhover = it closes, click = walk in
function Work({ projects, onOverlay }) {
  const [hover, setHover] = useState(-1)
  const [rm, setRm] = useState(null)
  const tm = useRef([])
  const box = useRef(null)
  const [seen, setSeen] = useState(false)
  const later = useCallback((f, ms) => { tm.current.push(setTimeout(f, ms)) }, [])
  useEffect(() => () => tm.current.forEach(clearTimeout), [])
  // phase 0 = door at its spot, 1 = zoomed in + open, 2 = through the doorway, 3 = project page
  const enter = (i, rect, tx, ty) => { if (!rm) setRm({ i, rect, tx, ty, wasOpen: hover === i, phase: 0 }) }
  const close = useCallback(() => {
    setRm((r) => r && { ...r, phase: 0, closing: true })
    later(() => { setRm(null); setHover(-1) }, 1100)
  }, [later])
  useEffect(() => {
    if (!rm) return
    const go = (n) => setRm((r) => (r && !r.closing ? { ...r, phase: n } : r))
    let a = requestAnimationFrame(() => { a = requestAnimationFrame(() => go(1)) })
    const t1 = setTimeout(() => go(2), 1100), t2 = setTimeout(() => go(3), 1950)
    return () => { cancelAnimationFrame(a); clearTimeout(t1); clearTimeout(t2) }
  }, [rm && rm.i])
  useEffect(() => {
    if (!rm) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [!!rm])
  // doors rise in one after another the first time they scroll into view
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.3 })
    io.observe(box.current)
    return () => io.disconnect()
  }, [])
  // freeze the 3D scene while the door room covers the screen
  useEffect(() => { onOverlay(!!(rm && rm.phase >= 1 && !rm.closing)) }, [rm && rm.phase, rm && rm.closing])
  const open = (i) => (rm ? rm.i === i : hover === i)
  return (
    <>
      <div ref={box} className={'doors' + (seen ? ' seen' : '') + (rm || hover >= 0 ? ' hv' : '')}>
        {projects.map((p, i) => (
          <Door key={p.title} p={p} i={i} cls={open(i) ? 'on' : ''} onHover={(j) => { if (!rm) setHover(j) }} onEnter={enter} />
        ))}
      </div>
      {rm && <Room p={projects[rm.i]} rm={rm} close={close} />}
    </>
  )
}

export default function App() {
  const eng = useRef(null)

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
          <div className="wk">
            <h2>Magic happens behind the doors</h2>
            <p className="lead">Hover a door to open it, click to walk in.</p>
            <Work projects={ME.projects} onOverlay={(v) => eng.current && eng.current.pause(v)} />
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
