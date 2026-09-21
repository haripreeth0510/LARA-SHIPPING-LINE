import { useEffect, useState, type ElementType } from 'react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Box, ChevronRight, ClipboardCheck, Globe2, Menu, MoveRight,
  PackageCheck, Plane, Ship, Truck, Warehouse, X, Zap, MapPin, ScanLine, Route, FileCheck2, BarChart3,
  Link, Camera, Send, Check, CircleHelp
} from 'lucide-react'

const navItems = ['Home', 'Services', 'Tracking', 'Solutions', 'Global Network', 'About']

const services: { icon: ElementType; name: string; description: string; tag: string }[] = [
  { icon: Ship, name: 'Ocean Freight', description: 'Global container transportation with dependable schedules and port coverage.', tag: 'Sea' },
  { icon: Plane, name: 'Air Freight', description: 'Fast, controlled international movement for time-sensitive cargo.', tag: 'Air' },
  { icon: Warehouse, name: 'Warehousing', description: 'Secure storage and smart inventory operations close to demand.', tag: 'Storage' },
  { icon: ClipboardCheck, name: 'Customs Clearance', description: 'Clear documentation and customs processes without the guesswork.', tag: 'Compliance' },
  { icon: Truck, name: 'Road Transportation', description: 'Reliable first-mile and last-mile delivery across key markets.', tag: 'Land' },
  { icon: Route, name: 'Supply Chain Solutions', description: 'End-to-end planning that makes complex supply chains feel simple.', tag: 'Strategy' },
]

const stats = [
  ['120+', 'Countries served'], ['50K+', 'Shipments managed'], ['98%', 'On-time operations'], ['24/7', 'Global support']
]

const process = [
  ['01', 'Request', 'Tell us what you need to move.'], ['02', 'Plan', 'We build the most efficient route.'],
  ['03', 'Move', 'Your cargo travels our network.'], ['04', 'Track', 'Monitor progress in real time.'], ['05', 'Deliver', 'Cargo arrives safely.']
]

const tech = [
  { icon: ScanLine, title: 'Real-time tracking', copy: 'Know where your shipment is at every meaningful stage.' },
  { icon: Route, title: 'Route optimization', copy: 'Smarter planning, designed around your cargo and deadlines.' },
  { icon: BarChart3, title: 'Data-driven operations', copy: 'Clear visibility that helps you make the next move with confidence.' },
  { icon: FileCheck2, title: 'Digital documentation', copy: 'Simplified shipment management, all in one place.' },
]

const benefits: { icon: ElementType; title: string; copy: string }[] = [
  { icon: Globe2, title: 'Global coverage', copy: 'An established presence across the routes that matter to your business.' },
  { icon: Zap, title: 'Operational reliability', copy: 'Experienced teams and dependable processes at every touchpoint.' },
  { icon: MapPin, title: 'Transparent tracking', copy: 'Meaningful visibility from booking to final destination.' },
  { icon: CircleHelp, title: 'Dedicated support', copy: 'Real people, ready to help whenever your shipment needs attention.' },
]

function Logo() { return <a className="logo" href="#home" aria-label="Lara Shipping home"><span className="logo-mark"><i /><i /><i /></span><span>LARA<small>SHIPPING</small></span></a> }

function Button({ children, variant = 'primary', className = '' }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'dark'; className?: string }) {
  return <a href="#quote" className={`button ${variant} ${className}`}>{children}</a>
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [trackValue, setTrackValue] = useState('')
  const [trackMessage, setTrackMessage] = useState('')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const track = () => setTrackMessage(trackValue.trim() ? `Tracking ${trackValue.toUpperCase()} — status ready to view.` : 'Enter your shipment number to begin.')

  return <div>
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <Logo />
      <nav className="desktop-nav" aria-label="Primary navigation">{navItems.map((item, i) => <a key={item} className={i === 0 ? 'active' : ''} href={`#${item.toLowerCase().replace(' ', '-')}`}>{item}</a>)}</nav>
      <div className="header-actions"><Button className="quote-top">Get a Quote <ArrowUpRight size={16} /></Button><button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button></div>
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>{navItems.map(item => <a onClick={() => setMobileOpen(false)} key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}>{item}<ArrowRight size={16}/></a>)}<Button>Get a Quote <ArrowRight size={16}/></Button></div>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="grid-overlay" /><div className="glow glow-a" /><div className="glow glow-b" />
        <div className="ocean"><span /><span /><span /></div>
        <div className="ship-scene" aria-hidden="true"><div className="wake" /><div className="ship-stack stack-one" /><div className="ship-stack stack-two" /><div className="ship-stack stack-three" /><div className="ship-hull"><span /></div></div>
        <div className="hero-content">
          <div className="eyebrow light"><span /> Global freight, intelligently connected</div>
          <h1>Moving the world.<br /><em>Delivering what matters.</em></h1>
          <p>Reliable global shipping and logistics solutions designed to move your cargo efficiently, securely, and on time.</p>
          <div className="hero-actions"><Button>Get a Quote <ArrowRight size={17}/></Button><Button variant="secondary">Explore Services <ArrowDown size={17}/></Button></div>
          <div className="trust"><Check size={14}/> Global reach <b /> Reliable operations <b /> End-to-end logistics</div>
        </div>
        <a className="scroll-cue" href="#tracking"><span>SCROLL TO EXPLORE</span><i><ArrowDown size={15}/></i></a>
      </section>

      <section className="tracking-wrap" id="tracking">
        <div className="tracking-card">
          <div className="tracking-heading"><div className="heading-icon"><PackageCheck /></div><div><span className="eyebrow">Shipment visibility</span><h2>Track your shipment</h2></div></div>
          <div className="track-control"><label className="sr-only" htmlFor="shipment">Container, shipment or tracking number</label><input id="shipment" value={trackValue} onChange={e => setTrackValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && track()} placeholder="Enter container / shipment / tracking number"/><button onClick={track}>Track shipment <ArrowRight size={16}/></button></div>
          <p className="track-message" aria-live="polite">{trackMessage}</p>
          <div className="status-flow">{['Booked', 'In transit', 'At port', 'Out for delivery', 'Delivered'].map((status, i) => <div className={i === 1 ? 'current' : ''} key={status}><i>{i < 2 ? <Check size={10}/> : i + 1}</i><span>{status}</span></div>)}</div>
        </div>
      </section>

      <section className="stats section-shell">{stats.map(([value, label]) => <div className="stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>

      <section className="section-shell services-section" id="services">
        <div className="section-intro"><div><span className="eyebrow"><span /> What we do</span><h2>One network.<br /><em>Every shipping need.</em></h2></div><p>From ocean freight to complete supply-chain solutions, we help businesses move cargo across borders with confidence.</p></div>
        <div className="services-grid">{services.map(({icon: Icon, name, description, tag}) => <article className="service-card" key={name}><div className="service-top"><div className="line-icon"><Icon size={24}/></div><span>{tag}</span></div><h3>{name}</h3><p>{description}</p><a href="#quote" aria-label={`Learn more about ${name}`}>Discover service <ArrowRight size={16}/></a></article>)}</div>
      </section>

      <section className="process-section section-shell" id="solutions"><div className="center-intro"><span className="eyebrow"><span /> How it works</span><h2>Complex logistics.<br /><em>Made clear.</em></h2><p>One experienced partner from the first request to final delivery.</p></div><div className="process-line">{process.map(([number, title, copy], i) => <article key={title}><span>{number}</span><i className={i === 0 ? 'active-dot' : ''}/><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

      <section className="network" id="global-network"><div className="network-map" aria-hidden="true"><div className="map-continent continent-a"/><div className="map-continent continent-b"/><div className="map-continent continent-c"/><svg viewBox="0 0 1000 500" preserveAspectRatio="none"><path d="M145 210 C280 45, 430 420, 550 190 S710 145, 830 220"/><path d="M140 210 C335 410, 500 45, 725 290 S860 120, 945 270"/><path d="M300 330 C460 245, 570 335, 720 290"/></svg><span className="pin p1"/><span className="pin p2"/><span className="pin p3"/><span className="pin p4"/><span className="pin p5"/></div><div className="network-inner section-shell"><span className="eyebrow light"><span /> Global network</span><h2>Connected across<br /><em>continents.</em></h2><p>Our network connects major trade routes, ports, and logistics hubs around the world.</p><Button variant="secondary">Explore our network <ArrowRight size={17}/></Button><div className="network-regions"><span>ASIA</span><span>EUROPE</span><span>AMERICAS</span><span>MIDDLE EAST</span><span>AFRICA</span></div></div></section>

      <section className="technology section-shell"><div className="tech-copy"><span className="eyebrow"><span /> The Lara advantage</span><h2>Logistics, powered<br />by <em>intelligence.</em></h2><p>We combine global operations with digital clarity, giving you a more informed and responsive way to move cargo.</p><Button variant="dark">Explore digital tools <ArrowRight size={17}/></Button></div><div className="dashboard"><div className="dash-top"><span>LIVE SHIPMENT OVERVIEW</span><i>● Online</i></div><div className="dash-route"><div><span>Origin</span><strong>SHANGHAI</strong></div><MoveRight/><div><span>Destination</span><strong>ROTTERDAM</strong></div></div><div className="dash-progress"><div><span>Voyage progress</span><b>68%</b></div><i><em/></i><small>Day 18 of 26 · ETA 08 Sep</small></div><div className="dash-bottom"><div className="chart"><span/><span/><span/><span/><span/><span/><span/></div><div className="eta"><span>ESTIMATED ARRIVAL</span><strong>08 <small>SEP</small></strong><p>On schedule <Check size={13}/></p></div></div></div></section>

      <section className="featured"><div className="feature-ship"><div className="small-wake"/><div className="feature-stack"/><div className="feature-hull"/></div><div className="feature-content"><span className="eyebrow light"><span /> Ocean freight</span><h2>From port<br />to <em>port.</em></h2><p>Your cargo moves with precision across the world’s major trade routes.</p><Button>Discover our capabilities <ArrowRight size={17}/></Button></div></section>

      <section className="reliability section-shell" id="about"><div><span className="eyebrow"><span /> Why Lara Shipping</span><h2>Built around<br /><em>reliability.</em></h2></div><div className="benefits">{benefits.map(({icon: Icon, title, copy}) => <article key={title}><div className="line-icon"><Icon size={21}/></div><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>

      <section className="quote-section" id="quote"><div className="quote-inner"><span className="eyebrow light"><span /> Let’s move forward</span><h2>Ready to move your<br /><em>business forward?</em></h2><p>Tell us what you’re shipping, where it’s going, and we’ll help find the right logistics solution.</p><div><Button>Get a Quote <ArrowRight size={17}/></Button><Button variant="secondary">Talk to our team</Button></div></div></section>
    </main>

    <footer><div className="footer-top section-shell"><div className="footer-brand"><Logo/><p>Global logistics, made more intelligent.</p><div><a href="#linkedin" aria-label="LinkedIn"><Link size={17}/></a><a href="#instagram" aria-label="Instagram"><Camera size={17}/></a><a href="#x" aria-label="X"><Send size={17}/></a></div></div><FooterColumn title="Company" items={['About', 'Careers', 'Global Network', 'Contact']}/><FooterColumn title="Services" items={['Ocean Freight', 'Air Freight', 'Warehousing', 'Customs', 'Transportation']}/><FooterColumn title="Resources" items={['Track Shipment', 'Get a Quote', 'FAQs', 'Support']}/></div><div className="footer-bottom section-shell"><span>© 2026 LARA SHIPPING. All rights reserved.</span><div><a href="#privacy">Privacy policy</a><a href="#terms">Terms of use</a></div></div></footer>
  </div>
}

function FooterColumn({title, items}: {title: string; items: string[]}) { return <div className="footer-column"><h3>{title}</h3>{items.map(item => <a key={item} href="#home">{item}</a>)}</div> }

export default App
