import { useEffect, useState, type ElementType, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Box, ChevronDown, ChevronRight, ClipboardCheck, Globe2, Menu, MoveRight,
  PackageCheck, Plane, Ship, Truck, Warehouse, X, Zap, MapPin, ScanLine, Route, FileCheck2, BarChart3,
  Link, Camera, Send, Check, CircleHelp, ShieldCheck, Train, PackagePlus, Handshake, ShoppingCart, FileText,
  Leaf, MonitorSmartphone, Award, Target, Eye, Sparkles, Mail, Phone, Megaphone
} from 'lucide-react'

const navItems = ['Home', 'Services', 'Tracking', 'Industries', 'Contact Us', 'About Us']
const navHref = (item: string) => item === 'Industries' ? '/industries' : item === 'About Us' ? '/about' : item === 'Contact Us' ? '/contact' : `#${item.toLowerCase().replace(' ', '-')}`
const serviceId = (name: string) => `service-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`

const industryTabs = {
  Achievements: ['Extensive Transport Network', 'Efficient Logistics Solutions', 'Industry Recognition', 'Employee Development', 'Successfully managing global supply chains'],
  Goals: ['Expansion and Growth', 'Innovation and Technology', 'Environmental Sustainability', 'Employee Engagement', 'Customer-Centric Approach'],
  Vision: ['Becoming a Global Leader', 'Community Engagement', 'Safety and Compliance', 'Continuous Improvement', 'Innovative Solutions'],
} as const

const industryTabIcons = { Achievements: Award, Goals: Target, Vision: Eye } as const

const services: { icon: ElementType; name: string; description: string; tag: string }[] = [
  { icon: Plane, name: 'Air Freight', description: 'Fast, controlled international movement for time-sensitive cargo.', tag: 'Air' },
  { icon: ShieldCheck, name: 'Cargo Insurance', description: 'Practical protection for your cargo from origin through to final delivery.', tag: 'Protection' },
  { icon: Ship, name: 'Ocean Freight (FCL)', description: 'Dedicated full-container shipments with dependable schedules and port coverage.', tag: 'Sea' },
  { icon: PackagePlus, name: 'Ocean Freight (LCL)', description: 'Flexible consolidated shipping for cargo that does not require a full container.', tag: 'Sea' },
  { icon: Train, name: 'Rail Freight', description: 'Efficient rail connections that keep inland cargo moving reliably.', tag: 'Rail' },
  { icon: Truck, name: 'Road Freight', description: 'Reliable first-mile and last-mile delivery across key markets.', tag: 'Road' },
  { icon: Warehouse, name: 'Social & Weighting & Filling', description: 'Careful cargo handling, weighing, and filling services tailored to your shipment.', tag: 'Handling' },
  { icon: Handshake, name: 'Contract Logistics', description: 'Integrated logistics operations designed around your ongoing business needs.', tag: 'Solutions' },
  { icon: ShoppingCart, name: 'Cross Border E-Commerce', description: 'Streamlined international fulfilment and delivery for online commerce.', tag: 'E-commerce' },
  { icon: FileText, name: 'Customs Brokerage', description: 'Expert customs documentation and clearance support for smoother border crossings.', tag: 'Customs' },
  { icon: Leaf, name: 'Green Solution', description: 'Lower-impact logistics options that support more sustainable supply chains.', tag: 'Sustainable' },
  { icon: MonitorSmartphone, name: 'Technology & Customer Solution', description: 'Digital tools and responsive support that keep every shipment visible and simple.', tag: 'Digital' },
]

const serviceFromHash = () => services.find(service => `#${serviceId(service.name)}` === window.location.hash)?.name ?? null

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

function Logo({ href = '#home' }: { href?: string }) { return <a className="logo" href={href} aria-label="Lara Shipping home"><span className="logo-mark"><i /><i /><i /></span><span>LARA<small>SHIPPING</small></span></a> }

function Button({ children, variant = 'primary', className = '' }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'dark'; className?: string }) {
  return <a href="#quote" className={`button ${variant} ${className}`}>{children}</a>
}

function App() {
  const [pagePath, setPagePath] = useState(() => window.location.pathname)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(serviceFromHash)
  const [scrolled, setScrolled] = useState(false)
  const [trackValue, setTrackValue] = useState('')
  const [trackMessage, setTrackMessage] = useState('')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handlePopState = () => setPagePath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const handleHashChange = () => setSelectedService(serviceFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const track = () => setTrackMessage(trackValue.trim() ? `Tracking ${trackValue.toUpperCase()} — status ready to view.` : 'Enter your shipment number to begin.')
  const navigateTo = (event: ReactMouseEvent<HTMLAnchorElement>, path: string, beforeUpdate?: () => void) => {
    event.preventDefault()
    const [basePath, hash] = path.split('#')
    
    if (basePath === pagePath) {
      if (beforeUpdate) beforeUpdate()
      if (hash) {
        window.history.pushState({}, '', path)
        setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 10)
      } else {
        window.scrollTo(0, 0)
      }
      return
    }
    const updatePage = () => {
      if (beforeUpdate) beforeUpdate()
      window.history.pushState({}, '', path)
      setPagePath(basePath)
      if (hash) {
        setTimeout(() => document.getElementById(hash)?.scrollIntoView(), 10)
      } else {
        window.scrollTo(0, 0)
      }
    }
    const documentWithTransition = document as Document & { startViewTransition?: (callback: () => void) => void }
    documentWithTransition.startViewTransition ? documentWithTransition.startViewTransition(updatePage) : updatePage()
  }
  const selectService = (event: ReactMouseEvent<HTMLAnchorElement>, name: string) => {
    event.preventDefault()
    const closeMenus = () => {
      setServicesOpen(false)
      setMobileServicesOpen(false)
      setMobileOpen(false)
    }
    if (name === 'Air Freight') {
      navigateTo(event, '/air-freight', closeMenus)
      return
    }
    if (name === 'Cargo Insurance') {
      navigateTo(event, '/cargo-insurance', closeMenus)
      return
    }
    if (name === 'Ocean Freight (FCL)') {
      navigateTo(event, '/ocean-freight-fcl', closeMenus)
      return
    }
    if (name === 'Ocean Freight (LCL)') {
      navigateTo(event, '/ocean-freight-lcl', closeMenus)
      return
    }
    if (name === 'Rail Freight') {
      navigateTo(event, '/rail-freight', closeMenus)
      return
    }
    if (name === 'Road Freight') {
      navigateTo(event, '/road-freight', closeMenus)
      return
    }
    if (name === 'Social & Weighting & Filling') {
      navigateTo(event, '/social-weighting', closeMenus)
      return
    }
    if (name === 'Contract Logistics') {
      navigateTo(event, '/contract-logistics', closeMenus)
      return
    }
    if (name === 'Cross Border E-Commerce' || name.toLowerCase().includes('cross border')) {
      navigateTo(event, '/cross-border', closeMenus)
      return
    }
    if (name === 'Customs Brokerage' || name.toLowerCase().includes('custom')) {
      navigateTo(event, '/customs-brokerage', closeMenus)
      return
    }
    if (name === 'Green Solution' || name.toLowerCase().includes('green')) {
      navigateTo(event, '/green-solution', closeMenus)
      return
    }
    if (name.toLowerCase().includes('technology') || name.toLowerCase().includes('customer solution') || name.toLowerCase().includes('custommer')) {
      navigateTo(event, '/technology-customer-solution', closeMenus)
      return
    }
    setSelectedService(name)
    window.requestAnimationFrame(() => {
      const service = document.getElementById(serviceId(name))
      window.history.replaceState(null, '', `#${serviceId(name)}`)
      service?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      service?.focus({ preventScroll: true })
    })
  }

  if (pagePath === '/industries') return <IndustriesPage onNavigate={navigateTo} />
  if (pagePath === '/about') return <AboutPage onNavigate={navigateTo} />
  if (pagePath === '/contact') return <ContactPage onNavigate={navigateTo} />
  if (pagePath === '/air-freight') return <AirFreightPage onNavigate={navigateTo} />
  if (pagePath === '/cargo-insurance') return <CargoInsurancePage onNavigate={navigateTo} />
  if (pagePath === '/ocean-freight-fcl') return <OceanFreightFCLPage onNavigate={navigateTo} />
  if (pagePath === '/ocean-freight-lcl') return <OceanFreightLCLPage onNavigate={navigateTo} />
  if (pagePath === '/rail-freight') return <RailFreightPage onNavigate={navigateTo} />
  if (pagePath === '/road-freight') return <RoadFreightPage onNavigate={navigateTo} />
  if (pagePath === '/social-weighting') return <SocialWeightingPage onNavigate={navigateTo} />
  if (pagePath === '/contract-logistics') return <ContractLogisticsPage onNavigate={navigateTo} />
  if (pagePath === '/cross-border') return <CrossBorderEcommercePage onNavigate={navigateTo} />
  if (pagePath === '/customs-brokerage') return <CustomsBrokeragePage onNavigate={navigateTo} />
  if (pagePath === '/green-solution') return <GreenSolutionPage onNavigate={navigateTo} />
  if (pagePath === '/technology-customer-solution') return <TechnologyCustomerSolutionPage onNavigate={navigateTo} />

  return <div>
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <Logo />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item, i) => item === 'Services' ? (
          <div className="services-menu" key={item} onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button className="services-menu-trigger" type="button" onClick={() => setServicesOpen(open => !open)} aria-expanded={servicesOpen} aria-haspopup="menu">
              Services <ChevronDown size={15} aria-hidden="true" />
            </button>
            <div className={`services-dropdown ${servicesOpen ? 'open' : ''}`} role="menu" aria-label="Services">
              {services.map(({ name }) => <a key={name} href={`#${serviceId(name)}`} role="menuitem" aria-current={selectedService === name ? 'true' : undefined} onClick={event => selectService(event, name)}>{name}</a>)}
            </div>
          </div>
        ) : <a key={item} className={i === 0 ? 'active' : ''} href={navHref(item)} onClick={item === 'Industries' || item === 'About Us' || item === 'Contact Us' ? event => navigateTo(event, navHref(item)) : undefined}>{item}</a>)}
      </nav>
      <div className="header-actions"><Button className="quote-top">Get a Quote <ArrowUpRight size={16} /></Button><button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button></div>
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>{navItems.map(item => item === 'Services' ? <div className="mobile-services" key={item}><button type="button" onClick={() => setMobileServicesOpen(open => !open)} aria-expanded={mobileServicesOpen} aria-controls="mobile-services-list">Services <ChevronDown size={16}/></button><div id="mobile-services-list" className={mobileServicesOpen ? 'open' : ''}>{services.map(({ name }) => <a key={name} href={`#${serviceId(name)}`} aria-current={selectedService === name ? 'true' : undefined} onClick={event => selectService(event, name)}>{name}<ChevronRight size={14}/></a>)}</div></div> : <a onClick={event => { if (item === 'Industries' || item === 'About Us' || item === 'Contact Us') navigateTo(event, navHref(item), () => setMobileOpen(false)) }} key={item} href={navHref(item)}>{item}<ArrowRight size={16}/></a>)}<Button>Get a Quote <ArrowRight size={16}/></Button></div>
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
        {selectedService && <SelectedServicePanel service={services.find(service => service.name === selectedService)!} onClear={() => { setSelectedService(null); window.history.replaceState(null, '', '#services') }} />}
        <div className="services-grid">{services.map(({icon: Icon, name, description, tag}) => {
          const path = name === 'Air Freight' ? '/air-freight' : name === 'Cargo Insurance' ? '/cargo-insurance' : name === 'Ocean Freight (FCL)' ? '/ocean-freight-fcl' : name === 'Ocean Freight (LCL)' ? '/ocean-freight-lcl' : name === 'Rail Freight' ? '/rail-freight' : name === 'Road Freight' ? '/road-freight' : name === 'Social & Weighting & Filling' ? '/social-weighting' : name === 'Contract Logistics' ? '/contract-logistics' : name === 'Cross Border E-Commerce' ? '/cross-border' : name === 'Customs Brokerage' ? '/customs-brokerage' : name === 'Green Solution' ? '/green-solution' : '/technology-customer-solution';
          return <article className={`service-card ${selectedService === name ? 'selected' : ''}`} id={serviceId(name)} key={name} tabIndex={0} style={{ cursor: 'pointer' }} onClick={(e) => navigateTo(e as any, path)}><div className="service-top"><div className="line-icon"><Icon size={24}/></div><span>{tag}</span></div><h3>{name}</h3><p>{description}</p><a href={path} aria-label={`Request a quote for ${name}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateTo(e as any, path); }}>Request a quote <ArrowRight size={16}/></a></article>
        })}</div>
      </section>

      <section className="process-section section-shell" id="solutions"><div className="center-intro"><span className="eyebrow"><span /> How it works</span><h2>Complex logistics.<br /><em>Made clear.</em></h2><p>One experienced partner from the first request to final delivery.</p></div><div className="process-line">{process.map(([number, title, copy], i) => <article key={title}><span>{number}</span><i className={i === 0 ? 'active-dot' : ''}/><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

      <section className="network" id="global-network"><div className="network-map" aria-hidden="true"><div className="map-continent continent-a"/><div className="map-continent continent-b"/><div className="map-continent continent-c"/><svg viewBox="0 0 1000 500" preserveAspectRatio="none"><path d="M145 210 C280 45, 430 420, 550 190 S710 145, 830 220"/><path d="M140 210 C335 410, 500 45, 725 290 S860 120, 945 270"/><path d="M300 330 C460 245, 570 335, 720 290"/></svg><span className="pin p1"/><span className="pin p2"/><span className="pin p3"/><span className="pin p4"/><span className="pin p5"/></div><div className="network-inner section-shell"><span className="eyebrow light"><span /> Global network</span><h2>Connected across<br /><em>continents.</em></h2><p>Our network connects major trade routes, ports, and logistics hubs around the world.</p><Button variant="secondary">Explore our network <ArrowRight size={17}/></Button><div className="network-regions"><span>ASIA</span><span>EUROPE</span><span>AMERICAS</span><span>MIDDLE EAST</span><span>AFRICA</span></div></div></section>

      <section className="technology section-shell"><div className="tech-copy"><span className="eyebrow"><span /> The Lara advantage</span><h2>Logistics, powered<br />by <em>intelligence.</em></h2><p>We combine global operations with digital clarity, giving you a more informed and responsive way to move cargo.</p><Button variant="dark">Explore digital tools <ArrowRight size={17}/></Button></div><div className="dashboard"><div className="dash-top"><span>LIVE SHIPMENT OVERVIEW</span><i>● Online</i></div><div className="dash-route"><div><span>Origin</span><strong>SHANGHAI</strong></div><MoveRight/><div><span>Destination</span><strong>ROTTERDAM</strong></div></div><div className="dash-progress"><div><span>Voyage progress</span><b>68%</b></div><i><em/></i><small>Day 18 of 26 · ETA 08 Sep</small></div><div className="dash-bottom"><div className="chart"><span/><span/><span/><span/><span/><span/><span/></div><div className="eta"><span>ESTIMATED ARRIVAL</span><strong>08 <small>SEP</small></strong><p>On schedule <Check size={13}/></p></div></div></div></section>

      <section className="featured"><div className="feature-ship"><div className="small-wake"/><div className="feature-stack"/><div className="feature-hull"/></div><div className="feature-content"><span className="eyebrow light"><span /> Ocean freight</span><h2>From port<br />to <em>port.</em></h2><p>Your cargo moves with precision across the world’s major trade routes.</p><Button>Discover our capabilities <ArrowRight size={17}/></Button></div></section>

      <section className="reliability section-shell" id="about"><div><span className="eyebrow"><span /> Why Lara Shipping</span><h2>Built around<br /><em>reliability.</em></h2></div><div className="benefits">{benefits.map(({icon: Icon, title, copy}) => <article key={title}><div className="line-icon"><Icon size={21}/></div><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>

      <section className="quote-section" id="quote"><div className="quote-inner"><span className="eyebrow light"><span /> Let’s move forward</span><h2>Ready to move your<br /><em>business forward?</em></h2><p>Tell us what you’re shipping, where it’s going, and we’ll help find the right logistics solution.</p><div><Button>Get a Quote <ArrowRight size={17}/></Button><Button variant="secondary">Talk to our team</Button></div></div></section>
    </main>

    <footer><div className="footer-top section-shell"><div className="footer-brand"><Logo/><p>Global logistics, made more intelligent.</p><div><a href="#linkedin" aria-label="LinkedIn"><Link size={17}/></a><a href="#instagram" aria-label="Instagram"><Camera size={17}/></a><a href="#x" aria-label="X"><Send size={17}/></a></div></div><FooterColumn title="Company" items={['About Us', 'Careers', 'Global Network', 'Contact']}/><FooterColumn title="Services" items={['Ocean Freight', 'Air Freight', 'Warehousing', 'Customs', 'Transportation']}/><FooterColumn title="Resources" items={['Track Shipment', 'Get a Quote', 'FAQs', 'Support']}/></div><div className="footer-bottom section-shell"><span>© 2026 LARA SHIPPING. All rights reserved.</span><div><a href="#privacy">Privacy policy</a><a href="#terms">Terms of use</a></div></div></footer>
  </div>
}

function FooterColumn({title, items}: {title: string; items: string[]}) { return <div className="footer-column"><h3>{title}</h3>{items.map(item => <a key={item} href="#home">{item}</a>)}</div> }

function SelectedServicePanel({ service, onClear }: { service: typeof services[number]; onClear: () => void }) {
  const Icon = service.icon
  return <aside className="selected-service-panel" aria-live="polite">
    <div className="selected-service-icon"><Icon size={25}/></div>
    <div><span>Selected service · {service.tag}</span><h3>{service.name}</h3><p>{service.description}</p></div>
    <a href="#quote" className="selected-service-cta">Request a quote <ArrowRight size={15}/></a>
    <button type="button" onClick={onClear} aria-label="Close selected service information"><X size={17}/></button>
  </aside>
}

function AboutPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return <div className="about-page">
    <header className="about-header"><div className="about-header-inner"><Logo href="/" /><nav aria-label="Primary navigation"><a href="/" onClick={event => onNavigate(event, '/')}>Home</a><a href="/#services" onClick={event => onNavigate(event, '/#services')}>Services</a><a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a><a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a><a className="active" href="/about">About Us</a></nav><a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15}/></a></div></header>
    <main>
      <section className="about-masthead"><div className="about-company-card"><span className="eyebrow light"><span /> LARA SHIPPING LINE</span><h1>A trusted partner in global logistics.</h1><p>We deliver thoughtful cargo transportation solutions, with operational clarity at every stage.</p></div></section>
      <section className="about-story section-shell"><div className="about-truck-art" aria-hidden="true"><i className="truck-box"/><i className="truck-cab"/><i className="truck-window"/><i className="truck-wheel wheel-one"/><i className="truck-wheel wheel-two"/></div><div className="about-copy"><span className="eyebrow light"><span /> About us</span><h2>Secure &amp; swift<br /><em>logistics solutions.</em></h2><p>LARA Shipping Line is a trusted name in global logistics, specializing in efficient cargo transportation solutions. Through our network of carriers and partners, we provide reliable and timely delivery around the world.</p><p>From ocean freight and air cargo to inland transportation, we offer a complete range of services designed around the way your business moves.</p></div></section>
      <section className="why-us section-shell"><div><span className="eyebrow light"><span /> Why choose us</span><h2>Faster and trusted<br /><em>logistics services.</em></h2><p>We understand that choosing the right logistics partner is crucial. Our team combines global reach with a focused, responsive service experience.</p><ul>{['Global reach across key trade routes', 'Customized solutions for each shipment', '24/7 customer support', 'Customer-first operations', 'Environmental responsibility'].map(item => <li key={item}><Check size={14}/>{item}</li>)}</ul><a className="about-read-more" href="/#quote">Talk to our team <ArrowRight size={16}/></a></div><div className="about-ship-art" aria-hidden="true"><i className="about-ship-stack"/><i className="about-ship-bridge"/><i className="about-ship-hull"/><b/></div></section>
    </main>
    <footer className="industries-footer"><div className="industries-footer-inner section-shell"><div className="industries-footer-brand"><Logo /><p>LARA SHIPPING LINE PVT LTD</p><span>Connect With Us</span><div><a href="#facebook" aria-label="Facebook">f</a><a href="#instagram" aria-label="Instagram">◎</a><a href="#linkedin" aria-label="LinkedIn">in</a><a href="#x" aria-label="X">𝕏</a></div></div><FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']}/><FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight']}/><FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']}/></div></footer>
  </div>
}

function ContactPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return <div className="contact-page">
    <header className="about-header"><div className="about-header-inner"><Logo href="/" /><nav aria-label="Primary navigation"><a href="/" onClick={event => onNavigate(event, '/')}>Home</a><a href="/#services" onClick={event => onNavigate(event, '/#services')}>Services</a><a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a><a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a><a className="active" href="/contact">Contact Us</a></nav><a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15}/></a></div></header>
    <main className="contact-main section-shell"><section className="contact-details"><span className="eyebrow light"><span /> Contact us</span><h1>Get in <em>touch.</em></h1><p className="contact-company">Lara Shipping Line</p><ContactOffice title="Head Office" details={[['address', '114/115, Vivaan Arcade, Ramlakshman Nagar, East Zone, Sowripalayam Post, Coimbatore-641028'], ['email', 'sales@larashippingline.com'], ['phone', '+91 81481 14238'], ['phone', '+91 81481 14279']]} /><ContactOffice title="Mumbai Branch Office" details={[['address', 'G-34, Haware Fantasia Business Park, Plot No. 47, Sector -30A, Vashi, Navi Mumbai - 400703.'], ['phone', '+91 22 45773828']]} /><ContactOffice title="Dubai Branch Office" subtitle="LARA SHIPPING LINE LLC" details={[['address', 'M-Floor Office – 208, Hamsa A Wing, Al Karama, Dubai, UAE.'], ['phone', '+971 56 542 0228']]} /></section>
      <section className="contact-form-wrap"><div className="contact-form-heading"><span className="eyebrow light"><span /> Send a message</span><h2>How can we help?</h2><p>Tell us about your shipment or question, and our team will respond shortly.</p><div className="contact-response-note"><span><i /> Typically replies within one business day</span><span>Secure &amp; confidential</span></div></div><form className="contact-form" onSubmit={submitContact}>{submitted ? <div className="contact-success" role="status"><Check size={22}/><div><strong>Message received</strong><p>Thank you. Our team will be in touch soon.</p></div><button type="button" onClick={() => setSubmitted(false)}>Send another message</button></div> : <><div className="contact-form-row"><label>Name<input name="name" autoComplete="name" placeholder="Your full name" required /></label><label>Email <b>*</b><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label></div><label>Subject<input name="subject" placeholder="How can we help?" required /></label><label>Message<textarea name="message" rows={6} placeholder="Tell us about your shipment, route, or requirement…" required /></label><div className="contact-form-footer"><small>By submitting, you agree to be contacted by our logistics team.</small><button className="contact-submit" type="submit">Send message <ArrowRight size={16}/></button></div></>}</form></section>
    </main>
    <footer className="industries-footer"><div className="industries-footer-inner section-shell"><div className="industries-footer-brand"><Logo /><p>LARA SHIPPING LINE PVT LTD</p><span>Connect With Us</span><div><a href="#facebook" aria-label="Facebook">f</a><a href="#instagram" aria-label="Instagram">◎</a><a href="#linkedin" aria-label="LinkedIn">in</a><a href="#x" aria-label="X">𝕏</a></div></div><FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']}/><FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight']}/><FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']}/></div></footer>
  </div>
}

function ContactOffice({ title, subtitle, details }: { title: string; subtitle?: string; details: [string, string][] }) {
  return <section className="contact-office"><h2>{title}</h2>{subtitle && <strong>{subtitle}</strong>}{details.map(([type, content], index) => { const Icon = type === 'address' ? MapPin : type === 'email' ? Mail : Phone; return <p key={`${type}-${index}`}><Icon size={20}/><span>{content}</span></p> })}</section>
}

function IndustriesPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [activeTab, setActiveTab] = useState<keyof typeof industryTabs>('Achievements')

  return <div className="industries-page">
    <header className="about-header"><div className="about-header-inner"><Logo href="/" /><nav aria-label="Primary navigation"><a href="/" onClick={event => onNavigate(event, '/')}>Home</a><a href="/#services" onClick={event => onNavigate(event, '/#services')}>Services</a><a className="active" href="/industries">Industries</a><a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a><a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a></nav><a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15}/></a></div></header>
    <main>
      <section className="industries-masthead"><div className="industries-company-card"><span className="eyebrow light"><span /> LARA SHIPPING LINE</span><h1>Industries we<br /><em>move forward.</em></h1><p>Specialized logistics capabilities built around the needs, pace, and standards of your industry.</p></div></section>
      <section className="industries-journey section-shell">
        <div className="industries-copy"><span className="eyebrow light"><span /> Built for progress</span><h2>Value-added logistics<br /><em>with real impact.</em></h2><p>Our people, global network, and digital operations work together to make your supply chain clearer, stronger, and ready for what is next.</p><div className="industry-tabs" role="tablist" aria-label="Company information">
          {(Object.keys(industryTabs) as (keyof typeof industryTabs)[]).map(tab => { const TabIcon = industryTabIcons[tab]; return <button key={tab} className={activeTab === tab ? 'active' : ''} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}><TabIcon size={18}/><span>{tab}</span></button> })}
        </div>
        <div className="industry-tab-panel" role="tabpanel"><span className="industry-panel-label">Lara Shipping promise · {activeTab}</span><ul>{industryTabs[activeTab].map(item => <li key={item}>{item}</li>)}</ul></div></div>
        <div className="industry-network-art" aria-hidden="true"><span className="network-orbit orbit-one"/><span className="network-orbit orbit-two"/><span className="network-node node-one"/><span className="network-node node-two"/><span className="network-node node-three"/><div className="network-core"><Globe2 size={67}/><b>120+</b><small>Countries connected</small></div></div>
      </section>
      <section className="industry-scale section-shell"><div className="industry-scale-art" aria-hidden="true"><div className="scale-container-row"><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="scale-vessel"><span/></div></div><div><span className="eyebrow light"><span /> Global scale</span><h2>One network.<br /><em>Every opportunity.</em></h2><p>Whether you are expanding into new markets or improving the flow of everyday operations, Lara Shipping connects the services and intelligence that keep business moving.</p><div className="industry-signals"><span><b>120+</b> Countries served</span><span><b>24/7</b> Dedicated support</span><span><b>98%</b> On-time operations</span></div><a className="about-read-more" href="/#quote">Explore our solutions <ArrowRight size={16}/></a></div>
      </section>
    </main>
    <footer className="industries-footer"><div className="industries-footer-inner section-shell"><div className="industries-footer-brand"><Logo /><p>LARA SHIPPING LINE PVT LTD</p><span>Connect With Us</span><div><a href="#facebook" aria-label="Facebook">f</a><a href="#instagram" aria-label="Instagram">◎</a><a href="#linkedin" aria-label="LinkedIn">in</a><a href="#x" aria-label="X">𝕏</a></div></div><FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']}/><FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight(FCL)', 'Multi Modal', 'Ocean Freight(LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']}/><FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']}/></div></footer>
  </div>
}

function AirFreightPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="air-freight-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Hero masthead — same stripe pattern as Industries */}
        <section className="af-masthead">
          <div className="af-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Air freight,<br /><em>delivered fast.</em></h1>
            <p>Global air cargo solutions built around speed, reliability, and compliance — from first flight to final delivery.</p>
          </div>
        </section>

        {/* Intro section — two-column like industries-journey */}
        <section className="af-journey section-shell">
          <div className="af-journey-copy">
            <span className="eyebrow light"><span /> Our air freight service</span>
            <h2>Fast, secure &amp;<br /><em>global coverage.</em></h2>
            <p>LARA SHIPPING offers airfreight services through its global network of offices. By partnering with leading carriers, LARA SHIPPING ensures that customer's cargo needs are met through a variety of solutions including fixed schedules on our daily flights, consolidation services in our own facilities and the creation of specialized solutions based on customer's unique requirements. Throughout the entire process, global compliance and security requirements are met at all times.</p>
            <p>LARA SHIPPING has successfully implemented strategic alliances with carriers that uphold the standards of quality and value that are passed on to our valued customers. As part of this expectation, we require air carriers to report their performance during formal business reviews. The result is that our carrier strategy leverages 70% of the global volume to core and preferred carriers; ensuring market competitive rates while protecting capacity during shoulder and peak times.</p>
          </div>

          {/* CSS plane art panel — styled like industry-network-art */}
          <div className="af-plane-panel" aria-hidden="true">
            <div className="af-plane-body" />
            <div className="af-plane-wing" />
            <div className="af-plane-tail" />
            <div className="af-plane-engine" />
            <div className="af-plane-window" />
            <div className="af-runway" />
            <div className="af-cargo-box cb1" />
            <div className="af-cargo-box cb2" />
            <div className="af-cargo-box cb3" />
            <div className="af-plane-core">
              <Plane size={54} />
              <b>70%</b>
              <small>Core carrier volume</small>
            </div>
          </div>
        </section>

        {/* Features section — same dark panel grid as industry-scale */}
        <section className="af-scale section-shell">
          <div className="af-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>global air shipping.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>24/7</b> Global support</span>
              <span><b>120+</b> Countries served</span>
              <span><b>98%</b> On-time operations</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="af-features-grid">
            {[
              { icon: Zap, title: 'Fast Delivery', copy: 'We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.' },
              { icon: Globe2, title: 'Global Reach', copy: 'Our Air Freight service connects you to a vast network of destinations worldwide.' },
              { icon: ShieldCheck, title: 'Secure Handling', copy: 'Your cargo is handled with utmost care and attention to ensure it arrives safely.' },
              { icon: Sparkles, title: 'Tailored Solutions', copy: 'We provide customized air freight solutions to meet your specific needs.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="af-feature-card" key={title}>
                <div className="af-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function CargoInsurancePage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="cargo-ins-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="ci-masthead">
          <div className="ci-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Cargo Insurance,<br /><em>protected end-to-end.</em></h1>
            <p>Comprehensive cargo protection from origin through to final delivery — covering what carriers legally cannot.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="ci-journey section-shell">
          <div className="ci-journey-copy">
            <span className="eyebrow light"><span /> Why cargo insurance matters</span>
            <h2>Beyond carrier<br /><em>liability limits.</em></h2>
            <p>Transportation carriers are often responsible only for their legal liability for damage caused to your cargo, which may not be equal to the full value of your cargo, and in many cases, such as acts of god, may not be liable for the damage for the loss or damage at all. Even in the case your cargo was not damaged and discharged successfully at your destination, you may still need to pay for the loss of others under the "General Average" concept.</p>
            <p>LARA SHIPPING provides practical cargo insurance solutions that cover your shipment from point of origin to final destination, giving you genuine peace of mind regardless of the mode of transport, route, or circumstances encountered along the way.</p>
          </div>

          {/* CSS art panel — mirrors industry-network-art */}
          <div className="ci-shield-panel" aria-hidden="true">
            <div className="ci-cargo-row">
              <i /><i /><i /><i /><i /><i />
            </div>
            <div className="ci-crane" />
            <div className="ci-crane-arm" />
            <div className="ci-panel-core">
              <ShieldCheck size={52} />
              <b>100%</b>
              <small>Cargo value covered</small>
            </div>
            <span className="ci-node n1" />
            <span className="ci-node n2" />
            <span className="ci-node n3" />
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="ci-scale section-shell">
          <div className="ci-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>cargo protection.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>120+</b> Countries covered</span>
              <span><b>24/7</b> Claims support</span>
              <span><b>100%</b> Cargo value insured</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="ci-features-grid">
            {[
              { icon: ShieldCheck, title: 'Full Value Coverage', copy: 'We insure your cargo to its full declared value, not just carrier liability limits.' },
              { icon: Globe2, title: 'Global Coverage', copy: 'Our cargo insurance covers shipments across all modes — ocean, air, road, and rail.' },
              { icon: Zap, title: 'Fast Claims', copy: 'Our dedicated claims team ensures swift, transparent resolution for any covered loss.' },
              { icon: FileText, title: 'General Average', copy: 'Protection against shared maritime losses under the General Average principle.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="ci-feature-card" key={title}>
                <div className="ci-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function OceanFreightLCLPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="ocean-lcl-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="ol-masthead">
          <div className="ol-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Ocean Freight(LCL),<br /><em>flexible shipping.</em></h1>
            <p>Flexible consolidated shipping for cargo that does not require a full container.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="ol-journey section-shell">
          <div className="ol-journey-copy">
            <span className="eyebrow light"><span /> LCL Services</span>
            <h2>Integrated,<br /><em>cost-effective.</em></h2>
            <p>Completely integrated LCL service (pre/post carriage, cross docking & ocean shipment) for all our customers from our closest consolidation freight station to your final destination, to reduce shipments costs and carbon impact thanks to optimized containers and sailings.This end to end service is facilitated thanks to a local customer service at each destination and a global control tower managing & optimizing all LCL flows. Different levels of traceability can be proposed.</p>
          </div>

          {/* CSS art panel — mirrors industry-network-art */}
          <div className="ol-ship-panel" aria-hidden="true">
            <div className="ol-water-back" />
            <div className="ol-ship-hull" />
            <div className="ol-ship-cargo-stack" />
            <div className="ol-ship-bridge" />
            <div className="ol-water-front" />
            <div className="ol-panel-core">
              <Ship size={52} />
              <b>LCL</b>
              <small>Less than Container Load</small>
            </div>
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="ol-scale section-shell">
          <div className="ol-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>global shipping.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>120+</b> Countries served</span>
              <span><b>24/7</b> Support</span>
              <span><b>98%</b> On-time</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="ol-features-grid">
            {[
              { icon: Zap, title: 'Fast Delivery', copy: 'We offer swift transportation of goods via ocean, ensuring your cargo reaches its destination promptly.' },
              { icon: Globe2, title: 'Global Reach', copy: 'Our Ocean Freight service connects you to a vast network of destinations worldwide.' },
              { icon: ShieldCheck, title: 'Secure Handling', copy: 'Your cargo is handled with utmost care and attention to ensure it arrives safely.' },
              { icon: Sparkles, title: 'Tailored Solutions', copy: 'We provide customized ocean freight solutions to meet your specific needs.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="ol-feature-card" key={title}>
                <div className="ol-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function OceanFreightFCLPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="ocean-fcl-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="of-masthead">
          <div className="of-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Ocean Freight (FCL),<br /><em>reliable capacity.</em></h1>
            <p>Dedicated full-container shipments with dependable schedules, port coverage, and complete supply chain visibility.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="of-journey section-shell">
          <div className="of-journey-copy">
            <span className="eyebrow light"><span /> FCL Services</span>
            <h2>Global scale,<br /><em>local expertise.</em></h2>
            <p>Our carrier relationships enable us to offer the right services at competitive rates while our expertise and seamless global networks help reduce your administrative burden. Long term relationships with carriers responsible for the majority of LARA SHIPPING LINE ocean volume mean that we can ensure the availability of space and equipment. We actively manage contracts and service levels to ensure our customers receive the best possible, reliable service at competitive rates. From end to end, the status of your shipment is also visible in real-time via our platform.</p>
          </div>

          {/* CSS art panel — mirrors industry-network-art */}
          <div className="of-ship-panel" aria-hidden="true">
            <div className="of-water-back" />
            <div className="of-ship-hull" />
            <div className="of-ship-cargo-stack" />
            <div className="of-ship-bridge" />
            <div className="of-water-front" />
            <div className="of-panel-core">
              <Ship size={52} />
              <b>FCL</b>
              <small>Full Container Load</small>
            </div>
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="of-scale section-shell">
          <div className="of-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>global shipping.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>120+</b> Countries served</span>
              <span><b>98%</b> On-time operations</span>
              <span><b>24/7</b> Global support</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="of-features-grid">
            {[
              { icon: Zap, title: 'Fast Delivery', copy: 'We offer swift transportation of goods via ocean, ensuring your cargo reaches its destination promptly.' },
              { icon: Globe2, title: 'Global Reach', copy: 'Our Ocean Freight service connects you to a vast network of destinations worldwide.' },
              { icon: ShieldCheck, title: 'Secure Handling', copy: 'Your cargo is handled with utmost care and attention to ensure it arrives safely.' },
              { icon: Sparkles, title: 'Tailored Solutions', copy: 'We provide customized ocean freight solutions to meet your specific needs.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="of-feature-card" key={title}>
                <div className="of-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function RailFreightPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="rail-freight-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="rf-masthead">
          <div className="rf-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Rail Freight,<br /><em>fast &amp; reliable.</em></h1>
            <p>Dependable rail-based solutions across Europe and Asia with GPS tracking, low CO₂ emissions, and competitive transit times.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="rf-journey section-shell">
          <div className="rf-journey-copy">
            <span className="eyebrow light"><span /> Our Rail Freight service</span>
            <h2>Greener shipping,<br /><em>fewer delays.</em></h2>
            <p>Compared to ocean freight and road transport, rail-based solutions are highly dependable and help eliminate long transit times with its high speeds over long distances. Furthermore, as a result of its comparatively low CO2 emissions, rail-based solutions can be an environmentally friendly and budget-friendly option when shipping by sea is not an option.</p>
            <p>Our powerful IT support enables clear communication throughout the shipping process, as team members track your shipment from start to finish. This same GPS tracking system provides an extra layer of security helping prevent transit losses and theft. With a green and reliable rail-based services across Europe and Asia, extensive knowledge of the market, and an entirely independent position, our team members are equipped to find the perfect rail freight solution to fit your needs.</p>
          </div>

          {/* CSS rail art panel — mirrors industry-network-art */}
          <div className="rf-rail-panel" aria-hidden="true">
            <div className="rf-track" />
            <div className="rf-track rf-track2" />
            <div className="rf-sleeper s1" />
            <div className="rf-sleeper s2" />
            <div className="rf-sleeper s3" />
            <div className="rf-sleeper s4" />
            <div className="rf-sleeper s5" />
            <div className="rf-container rc1" />
            <div className="rf-container rc2" />
            <div className="rf-container rc3" />
            <div className="rf-panel-core">
              <Train size={52} />
              <b>CO₂</b>
              <small>Low emission rail freight</small>
            </div>
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="rf-scale section-shell">
          <div className="rf-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>rail logistics.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>120+</b> Countries served</span>
              <span><b>GPS</b> Real-time tracking</span>
              <span><b>Low</b> CO₂ emissions</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="rf-features-grid">
            {[
              { icon: Zap, title: 'Fast Transit', copy: 'Rail freight eliminates long transit times with high-speed routes across Europe and Asia.' },
              { icon: Globe2, title: 'Global Reach', copy: 'Our extensive rail network connects you to major destinations worldwide.' },
              { icon: ShieldCheck, title: 'GPS Tracking', copy: 'End-to-end GPS tracking ensures visibility and prevents transit losses and theft.' },
              { icon: Leaf, title: 'Eco-Friendly', copy: 'Rail is one of the most carbon-efficient freight modes, reducing your CO₂ footprint.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="rf-feature-card" key={title}>
                <div className="rf-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function RoadFreightPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="road-freight-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="rdf-masthead">
          <div className="rdf-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Road Freight,<br /><em>everywhere you need.</em></h1>
            <p>Flexible road transport solutions serving Europe, Asia, and the Middle East — reaching the most remote places across the globe.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="rdf-journey section-shell">
          <div className="rdf-journey-copy">
            <span className="eyebrow light"><span /> Our Road Freight service</span>
            <h2>Flexible, fast &amp;<br /><em>truly global.</em></h2>
            <p>More than 3 billion people worldwide live in rural areas. Road freight is the only mode of transport that can reach the most remote places across the globe. You never have to compromise flexibility and efficiency when shipping goods over long or short distances.</p>
            <p>Our road transport solutions serve Europe, Asia, and the Middle East. We leverage our extensive knowledge of the market and our independent positioning to create the perfect road freight solution for your needs — whether it is a full truckload, partial load, or a specialized service.</p>
          </div>

          {/* CSS truck art panel — mirrors industry-network-art */}
          <div className="rdf-truck-panel" aria-hidden="true">
            <div className="rdf-road" />
            <div className="rdf-road-line" />
            <div className="rdf-truck-body" />
            <div className="rdf-truck-cab" />
            <div className="rdf-truck-wheel w1" />
            <div className="rdf-truck-wheel w2" />
            <div className="rdf-truck-wheel w3" />
            <div className="rdf-panel-core">
              <Truck size={52} />
              <b>3B+</b>
              <small>People reached via road</small>
            </div>
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="rdf-scale section-shell">
          <div className="rdf-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>road logistics.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>3B+</b> People reachable</span>
              <span><b>3</b> Continents served</span>
              <span><b>24/7</b> Dedicated support</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="rdf-features-grid">
            {[
              { icon: Zap, title: 'Fast Delivery', copy: 'Road freight offers flexible scheduling for swift delivery across short and long distances.' },
              { icon: Globe2, title: 'Remote Reach', copy: 'The only mode of transport able to reach rural and remote areas across the globe.' },
              { icon: ShieldCheck, title: 'Secure Handling', copy: 'Your cargo is handled with care throughout every leg of the road freight journey.' },
              { icon: Sparkles, title: 'Tailored Solutions', copy: 'FTL, LTL, or specialist services — customized to your exact shipping requirements.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="rdf-feature-card" key={title}>
                <div className="rdf-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function SocialWeightingPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="social-weighting-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="swf-masthead">
          <div className="swf-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Social, Weighting<br /><em>&amp; Filling.</em></h1>
            <p>Specialized solutions for precise weighting, automated filling, and integrated social compliance throughout your supply chain.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="swf-journey section-shell">
          <div className="swf-journey-copy">
            <span className="eyebrow light"><span /> Value-added services</span>
            <h2>Precision at<br /><em>every step.</em></h2>
            <p>LARA SHIPPING offers comprehensive weighting, filling, and social compliance services through its global network of offices. By partnering with leading facilities, we ensure that your specialized cargo handling needs are met with absolute precision and adherence to strict compliance standards.</p>
            <p>We provide a variety of solutions including fixed schedules, consolidation services in our own facilities, and the creation of specialized packaging and filling operations based on our customers' unique requirements. Throughout the entire process, global compliance, precise calibration, and security requirements are met at all times.</p>
          </div>

          {/* CSS Phone / Social Art Panel */}
          <div className="swf-social-panel" aria-hidden="true">
            <div className="swf-phone-body">
              <div className="swf-phone-notch" />
              <div className="swf-phone-screen">
                <div className="swf-feed-card" style={{ top: '15%' }} />
                <div className="swf-feed-card" style={{ top: '45%' }} />
                <div className="swf-feed-card" style={{ top: '75%' }} />
              </div>
            </div>
            {/* Orbiting nodes (representing social/connectivity) */}
            <div className="swf-orbit swf-orb1"><span /></div>
            <div className="swf-orbit swf-orb2"><span /></div>
            <div className="swf-orbit swf-orb3"><span /></div>
            
            <div className="swf-panel-core">
              <MonitorSmartphone size={52} />
              <b>100%</b>
              <small>Compliance &amp; Accuracy</small>
            </div>
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="swf-scale section-shell">
          <div className="swf-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>global shipping.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>100%</b> Compliance rate</span>
              <span><b>24/7</b> Monitoring</span>
              <span><b>ISO</b> Certified facilities</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="swf-features-grid">
            {[
              { icon: Zap, title: 'Fast Delivery', copy: 'Integrated filling and weighting processes minimize delays and accelerate your time-to-market.' },
              { icon: Globe2, title: 'Global Reach', copy: 'Our specialized facilities network connects you to standardized quality worldwide.' },
              { icon: ShieldCheck, title: 'Secure Handling', copy: 'Your cargo is handled with utmost care, ensuring compliance and perfect calibration.' },
              { icon: Sparkles, title: 'Tailored Solutions', copy: 'We provide customized filling and weighting solutions to meet your specific industry needs.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="swf-feature-card" key={title}>
                <div className="swf-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function ContractLogisticsPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="contract-logistics-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="cl-masthead">
          <div className="cl-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Contract Logistics,<br /><em>scalable &amp; rapid.</em></h1>
            <p>Integrated warehousing, distribution, and supply chain management designed around your ongoing business needs.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="cl-journey section-shell">
          <div className="cl-journey-copy">
            <span className="eyebrow light"><span /> Operations &amp; Strategy</span>
            <h2>Peace of mind<br /><em>for your supply chain.</em></h2>
            <p>REPLICABLE, SCALABLE, RAPID DEPLOYMENT. Give your supply chain the peace of mind it needs. Tap into our global infrastructure and local expertise and never worry about demand spikes or last-minute regulatory changes.</p>
            <p>Our contract logistics services go beyond simply storing and moving goods. We act as an extension of your business, managing complex operations, optimizing inventory flows, and implementing technology-driven solutions that reduce overhead while increasing end-customer satisfaction.</p>
          </div>

          {/* CSS Art Panel — Clipboard & Handshake */}
          <div className="cl-art-panel" aria-hidden="true">
            {/* Abstract facility structures */}
            <div className="cl-facility f1" />
            <div className="cl-facility f2" />
            <div className="cl-facility f3" />
            <div className="cl-shelf s1" />
            <div className="cl-shelf s2" />
            <div className="cl-shelf s3" />
            
            <div className="cl-panel-core">
              <Handshake size={52} />
              <b>Partnership</b>
              <small>Long-term operational scale</small>
            </div>
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="cl-scale section-shell">
          <div className="cl-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>global shipping.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>100%</b> Scalable operations</span>
              <span><b>24/7</b> Inventory visibility</span>
              <span><b>Global</b> Infrastructure access</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="cl-features-grid">
            {[
              { icon: Zap, title: 'Rapid Deployment', copy: 'Quickly scale operations up or down to respond perfectly to seasonal demand spikes.' },
              { icon: Globe2, title: 'Global Reach', copy: 'Tap into our established infrastructure and localized expertise in markets worldwide.' },
              { icon: ShieldCheck, title: 'Secure Handling', copy: 'Your inventory is managed with absolute care, backed by robust security and compliance.' },
              { icon: Sparkles, title: 'Tailored Solutions', copy: 'Custom workflows and integrations designed specifically around your operational goals.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="cl-feature-card" key={title}>
                <div className="cl-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function CrossBorderEcommercePage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="cross-border-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="cbe-masthead">
          <div className="cbe-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Cross Border E-Commerce,<br /><em>scalable &amp; rapid.</em></h1>
            <p>Streamlined international fulfilment, customs clearance, and global supply chain solutions designed for digital commerce.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="cbe-journey section-shell">
          <div className="cbe-journey-copy">
            <span className="eyebrow light"><span /> Operations &amp; Strategy</span>
            <h2>Peace of mind<br /><em>for global commerce.</em></h2>
            <p>LARA SHIPPING brokerage services provide clients with expertise around the globe. LARA SHIPPING brokers are professionals with experience in brokerage services and consultancy to ensure that our clients have the best possible outcomes when clearing their goods for consumption around the globe. For more information, contact us.</p>
            <p>Our cross-border e-commerce operations simplify global digital commerce. From customs compliance and automated duty calculations to rapid air freight connections and last-mile parcel distribution, we empower merchants to scale worldwide with confidence.</p>
          </div>

          {/* CSS Art Panel — styled like industries-network-art */}
          <div className="cbe-art-panel" aria-hidden="true">
            <span className="cbe-orbit orbit-one" />
            <span className="cbe-orbit orbit-two" />
            <span className="cbe-node node-one" />
            <span className="cbe-node node-two" />
            <span className="cbe-node node-three" />
            
            <div className="cbe-panel-core">
              <ShoppingCart size={52} />
              <b>E-Commerce</b>
              <small>Cross-border fulfillment</small>
            </div>
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="cbe-scale section-shell">
          <div className="cbe-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>global shipping.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>100%</b> Scalable operations</span>
              <span><b>24/7</b> Inventory visibility</span>
              <span><b>Global</b> Infrastructure access</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="cbe-features-grid">
            {[
              { icon: Zap, title: 'Fast Delivery', copy: 'We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.' },
              { icon: Globe2, title: 'Global Reach', copy: 'Our Air Freight service connects you to a vast network of destinations worldwide.' },
              { icon: ShieldCheck, title: 'Secure Handling', copy: 'Your cargo is handled with utmost care and attention to ensure it arrives safely.' },
              { icon: Sparkles, title: 'Tailored Solutions', copy: 'We provide customized air freight solutions to meet your specific needs.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="cbe-feature-card" key={title}>
                <div className="cbe-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function CustomsBrokeragePage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="customs-brokerage-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="cb-masthead">
          <div className="cb-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Customs Brokerage,<br /><em>expert clearance.</em></h1>
            <p>Global customs compliance, documentation consultancy, and swift clearance across all international borders.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="cb-journey section-shell">
          <div className="cb-journey-copy">
            <span className="eyebrow light"><span /> Compliance &amp; Consulting</span>
            <h2>Peace of mind<br /><em>for cross-border trade.</em></h2>
            <p>LARA SHIPPING brokerage services provide clients with expertise around the globe. LARA SHIPPING brokers are professionals with experience in brokerage services and consultancy to ensure that our clients have the best possible outcomes when clearing their goods for consumption around the globe. For more information, contact us.</p>
            <p>Navigating changing tariff codes, import-export regulations, and international trade laws requires seasoned local professionals. Our dedicated customs brokers ensure your shipments clear customs quickly, legally, and cost-effectively.</p>
          </div>

          {/* CSS Art Panel — styled like industries-network-art */}
          <div className="cb-art-panel" aria-hidden="true">
            <span className="cb-orbit orbit-one" />
            <span className="cb-orbit orbit-two" />
            <span className="cb-node node-one" />
            <span className="cb-node node-two" />
            <span className="cb-node node-three" />
            
            <div className="cb-panel-core">
              <FileText size={52} />
              <b>Customs</b>
              <small>100% border compliance</small>
            </div>
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="cb-scale section-shell">
          <div className="cb-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>global shipping.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>100%</b> Compliant</span>
              <span><b>24/7</b> Clearance support</span>
              <span><b>Global</b> Tariff expertise</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="cb-features-grid">
            {[
              { icon: Zap, title: 'Fast Delivery', copy: 'We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.' },
              { icon: Globe2, title: 'Global Reach', copy: 'Our Air Freight service connects you to a vast network of destinations worldwide.' },
              { icon: ShieldCheck, title: 'Secure Handling', copy: 'Your cargo is handled with utmost care and attention to ensure it arrives safely.' },
              { icon: Sparkles, title: 'Tailored Solutions', copy: 'We provide customized air freight solutions to meet your specific needs.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="cb-feature-card" key={title}>
                <div className="cb-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function GreenSolutionPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="green-solution-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="gs-masthead">
          <div className="gs-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Green Solution,<br /><em>sustainable logistics.</em></h1>
            <p>Lower-impact transportation options, carbon-efficient routing, and eco-conscious supply chain strategies.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="gs-journey section-shell">
          <div className="gs-journey-copy">
            <span className="eyebrow light"><span /> Eco-Friendly Logistics</span>
            <h2>Sustainable choices<br /><em>for global trade.</em></h2>
            <p>We strive to make sustainable choices easily available to our customers, and Green Solutions is our way of identifying and proposing the most sustainable method of transportation for you. Our team members are trained to help you select the most environmentally friendly shipping option while having constrains such as time and market availability in mind.</p>
            <p>From route optimization that minimizes fuel consumption to consolidated eco-freight and carbon-offset partnerships, we help you reduce your environmental footprint without compromising operational efficiency.</p>
          </div>

          {/* CSS Art Panel — styled like industries-network-art */}
          <div className="gs-art-panel" aria-hidden="true">
            <span className="gs-orbit orbit-one" />
            <span className="gs-orbit orbit-two" />
            <span className="gs-node node-one" />
            <span className="gs-node node-two" />
            <span className="gs-node node-three" />
            
            <div className="gs-panel-core">
              <Leaf size={52} />
              <b>Green Freight</b>
              <small>Sustainable supply chains</small>
            </div>
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="gs-scale section-shell">
          <div className="gs-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>global shipping.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>-35%</b> Carbon emissions</span>
              <span><b>100%</b> Eco-compliant</span>
              <span><b>Smart</b> Green routing</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="gs-features-grid">
            {[
              { icon: Zap, title: 'Fast Delivery', copy: 'We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.' },
              { icon: Globe2, title: 'Global Reach', copy: 'Our Air Freight service connects you to a vast network of destinations worldwide.' },
              { icon: ShieldCheck, title: 'Secure Handling', copy: 'Your cargo is handled with utmost care and attention to ensure it arrives safely.' },
              { icon: Sparkles, title: 'Tailored Solutions', copy: 'We provide customized air freight solutions to meet your specific needs.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="gs-feature-card" key={title}>
                <div className="gs-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

function TechnologyCustomerSolutionPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <div className="technology-customer-solution-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as Industries */}
        <section className="tcs-masthead">
          <div className="tcs-company-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Technology &amp;<br /><em>Customer Solutions.</em></h1>
            <p>Next-generation logistics technology, intelligent shipment tracking, and dedicated customer-first operations.</p>
          </div>
        </section>

        {/* Intro — two-column like industries-journey */}
        <section className="tcs-journey section-shell">
          <div className="tcs-journey-copy">
            <span className="eyebrow light"><span /> Digital Logistics &amp; Support</span>
            <h2>Intelligent systems,<br /><em>responsive service.</em></h2>
            <p>LARA SHIPPING offers airfreight services through its global network of offices. By partnering with leading carriers, LARA SHIPPING ensures that customer's cargo needs are met through a variety of solutions including fixed schedules on our daily flights, consolidation services in our own facilities and the creation of specialized solutions based on customer's unique requirements. Throughout the entire process, global compliance and security requirements are met at all times.</p>
            <p>Our proprietary platform and responsive support teams give you real-time visibility, predictive tracking, and seamless document management from origin to destination.</p>
          </div>

          {/* CSS Art Panel — styled like industries-network-art */}
          <div className="tcs-art-panel" aria-hidden="true">
            <span className="tcs-orbit orbit-one" />
            <span className="tcs-orbit orbit-two" />
            <span className="tcs-node node-one" />
            <span className="tcs-node node-two" />
            <span className="tcs-node node-three" />
            
            <div className="tcs-panel-core">
              <MonitorSmartphone size={52} />
              <b>Tech &amp; Support</b>
              <small>24/7 intelligent visibility</small>
            </div>
          </div>
        </section>

        {/* What We Do — mirrors industry-scale */}
        <section className="tcs-scale section-shell">
          <div className="tcs-scale-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>One-stop shop for<br /><em>global shipping.</em></h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery.</p>
            <div className="industry-signals">
              <span><b>24/7</b> Live support</span>
              <span><b>100%</b> API integration</span>
              <span><b>Real-Time</b> Telemetry</span>
            </div>
            <a className="about-read-more" href="/#quote">Get a Quote <ArrowRight size={16} /></a>
          </div>
          <div className="tcs-features-grid">
            {[
              { icon: Zap, title: 'Fast Delivery', copy: 'We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.' },
              { icon: Globe2, title: 'Global Reach', copy: 'Our Air Freight service connects you to a vast network of destinations worldwide.' },
              { icon: ShieldCheck, title: 'Secure Handling', copy: 'Your cargo is handled with utmost care and attention to ensure it arrives safely.' },
              { icon: Sparkles, title: 'Tailored Solutions', copy: 'We provide customized air freight solutions to meet your specific needs.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article className="tcs-feature-card" key={title}>
                <div className="tcs-feature-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
      </footer>
    </div>
  )
}

export default App




