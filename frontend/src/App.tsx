import { useEffect, useState, type ElementType, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react'
import MapComponent from './MapComponent'
import ChatWidget from './ChatWidget'
import { ConverterPage } from './ConverterPage'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Box, ChevronDown, ChevronRight, ClipboardCheck, Globe2, Menu, MoveRight,
  PackageCheck, Plane, Ship, Truck, Warehouse, X, Zap, MapPin, ScanLine, Route, FileCheck2, BarChart3,
  Link, Camera, Send, Check, CircleHelp, ShieldCheck, Train, PackagePlus, Handshake, ShoppingCart, FileText,
  Leaf, MonitorSmartphone, Award, Target, Eye, Sparkles, Mail, Phone, Megaphone, MessageCircle, MessageSquare,
  Calculator, Network, Search
} from 'lucide-react'

const navItems = ['Home', 'Services', 'Tracking', 'CBM Calculator', 'Industries', 'Contact Us', 'About Us']
const navHref = (item: string) => item === 'Industries' ? '/industries' : item === 'About Us' ? '/about' : item === 'Contact Us' ? '/contact' : item === 'CBM Calculator' ? '/cbm-calculator' : `#${item.toLowerCase().replace(' ', '-')}`
const serviceId = (name: string) => `service-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`

const industryTabs = {
  Achievements: ['Extensive Transport Network', 'Efficient Logistics Solutions', 'Industry Recognition', 'Employee Development', 'Successfully managing global supply chains'],
  Goals: ['Expansion and Growth', 'Innovation and Technology', 'Environmental Sustainability', 'Employee Engagement', 'Customer-Centric Approach'],
  Vision: ['Becoming a Global Leader', 'Community Engagement', 'Safety and Compliance', 'Continuous Improvement', 'Innovative Solutions'],
} as const

const industryTabIcons = { Achievements: Award, Goals: Target, Vision: Eye } as const

const services: { icon: ElementType; name: string; description: string; tag: string; sector: 'Freight Forwarding Services' | 'Customer Solution' }[] = [
  // Sector 1: Freight Forwarding Services
  { icon: Plane, name: 'Air Freight', description: 'Fast, controlled international movement for time-sensitive cargo.', tag: 'Air', sector: 'Freight Forwarding Services' },
  { icon: ShieldCheck, name: 'Cargo Insurance', description: 'Practical protection for your cargo from origin through to final delivery.', tag: 'Protection', sector: 'Freight Forwarding Services' },
  { icon: Ship, name: 'Ocean Freight (FCL)', description: 'Dedicated full-container shipments with dependable schedules and port coverage.', tag: 'Sea', sector: 'Freight Forwarding Services' },
  { icon: Network, name: 'Multi Modal', description: 'Integrated multi-modal transport combining sea, air, rail, and road under a single bill of lading.', tag: 'Multi-Modal', sector: 'Freight Forwarding Services' },
  { icon: PackagePlus, name: 'Ocean Freight (LCL)', description: 'Flexible consolidated shipping for cargo that does not require a full container.', tag: 'Sea', sector: 'Freight Forwarding Services' },
  { icon: Train, name: 'Rail Freight', description: 'Efficient rail connections that keep inland cargo moving reliably.', tag: 'Rail', sector: 'Freight Forwarding Services' },
  { icon: Truck, name: 'Road Freight', description: 'Reliable first-mile and last-mile delivery across key markets.', tag: 'Road', sector: 'Freight Forwarding Services' },
  { icon: Warehouse, name: 'Social & Weighting & Filling', description: 'Careful cargo handling, weighing, and filling services tailored to your shipment.', tag: 'Handling', sector: 'Freight Forwarding Services' },

  // Sector 2: Customer Solution
  { icon: Handshake, name: 'Contract Logistics', description: 'Integrated logistics operations designed around your ongoing business needs.', tag: 'Solutions', sector: 'Customer Solution' },
  { icon: ShoppingCart, name: 'Cross Border E-Commerce', description: 'Streamlined international fulfilment and delivery for online commerce.', tag: 'E-commerce', sector: 'Customer Solution' },
  { icon: FileText, name: 'Customs Brokerage', description: 'Expert customs documentation and clearance support for smoother border crossings.', tag: 'Customs', sector: 'Customer Solution' },
  { icon: Leaf, name: 'Green Solution', description: 'Lower-impact logistics options that support more sustainable supply chains.', tag: 'Sustainable', sector: 'Customer Solution' },
  { icon: MonitorSmartphone, name: 'Technology & Customer Solution', description: 'Digital tools and responsive support that keep every shipment visible and simple.', tag: 'Digital', sector: 'Customer Solution' },
]

const serviceFromHash = () => services.find(service => `#${serviceId(service.name)}` === window.location.hash)?.name ?? null

const getServicePath = (name: string) => {
  if (name === 'Air Freight') return '/air-freight'
  if (name === 'Cargo Insurance') return '/cargo-insurance'
  if (name === 'Ocean Freight (FCL)') return '/ocean-freight-fcl'
  if (name === 'Multi Modal' || name.toLowerCase().includes('multi modal') || name.toLowerCase().includes('multimodal')) return '/multi-modal'
  if (name === 'Ocean Freight (LCL)') return '/ocean-freight-lcl'
  if (name === 'Rail Freight') return '/rail-freight'
  if (name === 'Road Freight') return '/road-freight'
  if (name === 'Social & Weighting & Filling' || name.toLowerCase().includes('social') || name.toLowerCase().includes('weighting')) return '/social-weighting'
  if (name === 'Contract Logistics') return '/contract-logistics'
  if (name === 'Cross Border E-Commerce' || name.toLowerCase().includes('cross border')) return '/cross-border'
  if (name === 'Customs Brokerage' || name.toLowerCase().includes('custom')) return '/customs-brokerage'
  if (name === 'Green Solution') return '/green-solution'
  if (name.toLowerCase().includes('technology') || name.toLowerCase().includes('customer solution')) return '/technology-customer-solution'
  return '/#services'
}

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

function Logo({ href = '#home', onClick }: { href?: string; onClick?: (e: ReactMouseEvent<HTMLAnchorElement>) => void }) { 
  return <a className="logo" href={href} onClick={onClick} aria-label="Lara Shipping home"><img src="/logo.png" alt="LARA Shipping Logo" style={{ height: '45px', width: 'auto', display: 'block' }} /></a> 
}

function Button({
  children,
  variant = 'primary',
  className = '',
  href,
  onClick,
  type = 'button'
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'dark'
  className?: string
  href?: string
  onClick?: (e: ReactMouseEvent<HTMLElement>) => void
  type?: 'button' | 'submit' | 'reset'
}) {
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick as (e: ReactMouseEvent<HTMLAnchorElement>) => void}
        className={`button ${variant} ${className}`}
      >
        {children}
      </a>
    )
  }
  return (
    <button
      type={type}
      onClick={onClick as (e: ReactMouseEvent<HTMLButtonElement>) => void}
      className={`button ${variant} ${className}`}
    >
      {children}
    </button>
  )
}

function smoothScrollTo(targetY: number, duration: number = 850, onComplete?: () => void) {
  const startY = window.pageYOffset || document.documentElement.scrollTop
  const diff = targetY - startY
  if (Math.abs(diff) < 2) {
    if (onComplete) onComplete()
    return
  }
  const startTime = performance.now()

  function easeOutQuint(x: number): number {
    return 1 - Math.pow(1 - x, 5)
  }

  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeOutQuint(progress)

    window.scrollTo(0, startY + diff * easedProgress)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      window.scrollTo(0, targetY)
      if (onComplete) onComplete()
    }
  }

  requestAnimationFrame(step)
}

function App() {
  const [pagePath, setPagePath] = useState(() => window.location.pathname)
  const [pageTransitioning, setPageTransitioning] = useState<'idle' | 'leaving' | 'entering'>('idle')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(serviceFromHash)
  const [scrolled, setScrolled] = useState(false)
  const [activeSector, setActiveSector] = useState<'all' | 'Freight Forwarding Services' | 'Customer Solution'>('all')
  const [trackValue, setTrackValue] = useState('')
  const [trackMessage, setTrackMessage] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)

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
  const navigateTo = (event?: ReactMouseEvent<HTMLElement>, path?: string, beforeUpdate?: () => void) => {
    if (event && event.preventDefault) event.preventDefault()
    if (!path) return
    const [basePath, hash] = path.split('#')
    
    if (basePath === pagePath || (basePath === '' && hash)) {
      if (beforeUpdate) beforeUpdate()
      if (hash) {
        window.history.pushState({}, '', path)
        const el = document.getElementById(hash)
        if (el) {
          const y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 84)
          smoothScrollTo(y, 850)
        }
      } else {
        smoothScrollTo(0, 650)
      }
      return
    }

    if (beforeUpdate) beforeUpdate()
    setPageTransitioning('leaving')

    setTimeout(() => {
      window.history.pushState({}, '', path)
      setPagePath(basePath)
      window.scrollTo(0, 0)
      setPageTransitioning('entering')

      setTimeout(() => {
        setPageTransitioning('idle')
        if (hash) {
          const el = document.getElementById(hash)
          if (el) {
            const y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 84)
            smoothScrollTo(y, 850)
          }
        }
      }, 40)
    }, 180)
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
    if (name === 'Multi Modal' || name.toLowerCase().includes('multi modal') || name.toLowerCase().includes('multimodal')) {
      navigateTo(event, '/multi-modal', closeMenus)
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

  let content = null;
  if (pagePath === '/industries') content = <IndustriesPage onNavigate={navigateTo} />
  else if (pagePath === '/about') content = <AboutPage onNavigate={navigateTo} />
  else if (pagePath === '/contact') content = <ContactPage onNavigate={navigateTo} />
  else if (pagePath === '/our-offer') content = <OurOfferPage onNavigate={navigateTo} />
  else if (pagePath === '/quote') content = <GetQuotePage onNavigate={navigateTo} />
  else if (pagePath === '/air-freight') content = <AirFreightPage onNavigate={navigateTo} />
  else if (pagePath === '/cargo-insurance') content = <CargoInsurancePage onNavigate={navigateTo} />
  else if (pagePath === '/ocean-freight-fcl') content = <OceanFreightFCLPage onNavigate={navigateTo} />
  else if (pagePath === '/multi-modal') content = <MultiModalPage onNavigate={navigateTo} />
  else if (pagePath === '/ocean-freight-lcl') content = <OceanFreightLCLPage onNavigate={navigateTo} />
  else if (pagePath === '/rail-freight') content = <RailFreightPage onNavigate={navigateTo} />
  else if (pagePath === '/road-freight') content = <RoadFreightPage onNavigate={navigateTo} />
  else if (pagePath === '/social-weighting') content = <SocialWeightingPage onNavigate={navigateTo} />
  else if (pagePath === '/contract-logistics') content = <ContractLogisticsPage onNavigate={navigateTo} />
  else if (pagePath === '/cross-border') content = <CrossBorderEcommercePage onNavigate={navigateTo} />
  else if (pagePath === '/customs-brokerage') content = <CustomsBrokeragePage onNavigate={navigateTo} />
  else if (pagePath === '/green-solution') content = <GreenSolutionPage onNavigate={navigateTo} />
  else if (pagePath === '/technology-customer-solution') content = <TechnologyCustomerSolutionPage onNavigate={navigateTo} />
  else if (pagePath === '/inco-terms') content = <IncoTermsPage onNavigate={navigateTo} />
  else if (pagePath === '/container-spec') content = <ContainerSpecPage onNavigate={navigateTo} />
  else if (pagePath === '/cbm-calculator' || pagePath === '/converter') content = <ConverterPage onNavigate={navigateTo} />
  else content = <div>
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <Logo />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item, i) => item === 'Services' ? (
          <div className="services-menu" key={item} onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button className="services-menu-trigger" type="button" onClick={() => setServicesOpen(open => !open)} aria-expanded={servicesOpen} aria-haspopup="menu">
              Services <ChevronDown size={15} aria-hidden="true" />
            </button>
            <div className={`services-dropdown ${servicesOpen ? 'open' : ''}`} role="menu" aria-label="Services">
              <div className="services-dropdown-sector-title">Freight Forwarding Services</div>
              {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => <a key={name} href={`#${serviceId(name)}`} role="menuitem" aria-current={selectedService === name ? 'true' : undefined} onClick={event => selectService(event, name)}>{name}</a>)}
              <div className="services-dropdown-sector-title">Customer Solution</div>
              {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => <a key={name} href={`#${serviceId(name)}`} role="menuitem" aria-current={selectedService === name ? 'true' : undefined} onClick={event => selectService(event, name)}>{name}</a>)}
            </div>
          </div>
        ) : <a key={item} className={i === 0 ? 'active' : ''} href={navHref(item)} onClick={item === 'Industries' || item === 'About Us' || item === 'Contact Us' || item === 'CBM Calculator' || item === 'Tracking' ? event => navigateTo(event, navHref(item)) : undefined}>{item}</a>)}
      </nav>
      <div className="header-actions"><Button className="quote-top" onClick={e => navigateTo(e, '/quote')}>Get a Quote <ArrowUpRight size={16} /></Button><button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button></div>
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>{navItems.map(item => item === 'Services' ? <div className="mobile-services" key={item}><button type="button" onClick={() => setMobileServicesOpen(open => !open)} aria-expanded={mobileServicesOpen} aria-controls="mobile-services-list">Services <ChevronDown size={16}/></button><div id="mobile-services-list" className={mobileServicesOpen ? 'open' : ''}><div className="mobile-sector-title">Freight Forwarding Services</div>{services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => <a key={name} href={`#${serviceId(name)}`} aria-current={selectedService === name ? 'true' : undefined} onClick={event => selectService(event, name)}>{name}<ChevronRight size={14}/></a>)}<div className="mobile-sector-title">Customer Solution</div>{services.filter(s => s.sector === 'Customer Solution').map(({ name }) => <a key={name} href={`#${serviceId(name)}`} aria-current={selectedService === name ? 'true' : undefined} onClick={event => selectService(event, name)}>{name}<ChevronRight size={14}/></a>)}</div></div> : <a onClick={event => { if (item === 'Industries' || item === 'About Us' || item === 'Contact Us' || item === 'CBM Calculator' || item === 'Tracking') navigateTo(event, navHref(item), () => setMobileOpen(false)) }} key={item} href={navHref(item)}>{item}<ArrowRight size={16}/></a>)}<Button onClick={e => navigateTo(e, '/quote')}>Get a Quote <ArrowRight size={16}/></Button></div>
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
          <div className="hero-actions"><Button onClick={e => navigateTo(e, '/quote')}>Get a Quote <ArrowRight size={17}/></Button><Button variant="secondary" onClick={(e) => { e.preventDefault(); setIsChatOpen(true); }}>Chat with Us <MessageCircle size={17}/></Button><Button variant="secondary" href="#services" onClick={(e) => { e.preventDefault(); const el = document.getElementById('services'); if (el) { const y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 84); smoothScrollTo(y, 900, () => window.history.pushState(null, '', '#services')); } }}>Services <ArrowDown size={15}/></Button></div>
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

        {/* Sector Filter Tabs */}
        <div className="services-sector-tabs">
          <button
            type="button"
            className={`services-sector-tab-btn ${activeSector === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSector('all')}
          >
            All Services <span className="tab-count">{services.length}</span>
          </button>
          <button
            type="button"
            className={`services-sector-tab-btn ${activeSector === 'Freight Forwarding Services' ? 'active' : ''}`}
            onClick={() => setActiveSector('Freight Forwarding Services')}
          >
            Freight Forwarding Services <span className="tab-count">{services.filter(s => s.sector === 'Freight Forwarding Services').length}</span>
          </button>
          <button
            type="button"
            className={`services-sector-tab-btn ${activeSector === 'Customer Solution' ? 'active' : ''}`}
            onClick={() => setActiveSector('Customer Solution')}
          >
            Customer Solution <span className="tab-count">{services.filter(s => s.sector === 'Customer Solution').length}</span>
          </button>
        </div>

        {/* Sector 1: Freight Forwarding Services */}
        {(activeSector === 'all' || activeSector === 'Freight Forwarding Services') && (
          <div className="services-sector-block" id="freight-forwarding-services">
            <div className="services-sector-heading">
              <div className="services-sector-heading-left">
                <span className="eyebrow"><span /> Sector 01</span>
                <h3>Freight Forwarding Services</h3>
                <p>Comprehensive international transport solutions spanning air, ocean, rail, road, and multimodal networks.</p>
              </div>
              <span className="services-sector-count">8 Services</span>
            </div>
            <div className="services-grid services-grid-forwarding">
              {services.filter(s => s.sector === 'Freight Forwarding Services').map(({icon: Icon, name, description, tag}) => {
                const path = getServicePath(name)
                return (
                  <article className={`service-card ${selectedService === name ? 'selected' : ''}`} id={serviceId(name)} key={name} tabIndex={0} style={{ cursor: 'pointer' }} onClick={(e) => navigateTo(e as any, path)}>
                    <div className="service-top">
                      <div className="line-icon"><Icon size={24}/></div>
                      <span>{tag}</span>
                    </div>
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <a href={path} aria-label={`Request a quote for ${name}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateTo(e as any, path); }}>Request a quote <ArrowRight size={16}/></a>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {/* Sector 2: Customer Solution */}
        {(activeSector === 'all' || activeSector === 'Customer Solution') && (
          <div className="services-sector-block" id="customer-solution" style={{ marginTop: activeSector === 'all' ? '64px' : '0' }}>
            <div className="services-sector-heading">
              <div className="services-sector-heading-left">
                <span className="eyebrow"><span /> Sector 02</span>
                <h3>Customer Solution</h3>
                <p>Integrated contract logistics, customs brokerage, cross-border e-commerce, green initiatives, and digital systems.</p>
              </div>
              <span className="services-sector-count">5 Services</span>
            </div>
            <div className="services-grid services-grid-solutions">
              {services.filter(s => s.sector === 'Customer Solution').map(({icon: Icon, name, description, tag}) => {
                const path = getServicePath(name)
                return (
                  <article className={`service-card ${selectedService === name ? 'selected' : ''}`} id={serviceId(name)} key={name} tabIndex={0} style={{ cursor: 'pointer' }} onClick={(e) => navigateTo(e as any, path)}>
                    <div className="service-top">
                      <div className="line-icon"><Icon size={24}/></div>
                      <span>{tag}</span>
                    </div>
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <a href={path} aria-label={`Request a quote for ${name}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateTo(e as any, path); }}>Request a quote <ArrowRight size={16}/></a>
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </section>

      <section className="process-section section-shell" id="solutions"><div className="center-intro"><span className="eyebrow"><span /> How it works</span><h2>Complex logistics.<br /><em>Made clear.</em></h2><p>One experienced partner from the first request to final delivery.</p></div><div className="process-line">{process.map(([number, title, copy], i) => <article key={title}><span>{number}</span><i className={i === 0 ? 'active-dot' : ''}/><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

      <section className="network" id="global-network"><div className="network-map" aria-hidden="true"><div className="map-continent continent-a"/><div className="map-continent continent-b"/><div className="map-continent continent-c"/><svg viewBox="0 0 1000 500" preserveAspectRatio="none"><path d="M145 210 C280 45, 430 420, 550 190 S710 145, 830 220"/><path d="M140 210 C335 410, 500 45, 725 290 S860 120, 945 270"/><path d="M300 330 C460 245, 570 335, 720 290"/></svg><span className="pin p1"/><span className="pin p2"/><span className="pin p3"/><span className="pin p4"/><span className="pin p5"/></div><div className="network-inner section-shell"><span className="eyebrow light"><span /> Global network</span><h2>Connected across<br /><em>continents.</em></h2><p>Our network connects major trade routes, ports, and logistics hubs around the world.</p><Button variant="secondary" onClick={() => { const el = document.getElementById('global-network'); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>Explore our network <ArrowRight size={17}/></Button><div className="network-regions"><span>ASIA</span><span>EUROPE</span><span>AMERICAS</span><span>MIDDLE EAST</span><span>AFRICA</span></div></div></section>

      <section className="technology section-shell"><div className="tech-copy"><span className="eyebrow"><span /> The Lara advantage</span><h2>Logistics, powered<br />by <em>intelligence.</em></h2><p>We combine global operations with digital clarity, giving you a more informed and responsive way to move cargo.</p><Button variant="dark" onClick={e => navigateTo(e, '/technology-customer-solution')}>Explore digital tools <ArrowRight size={17}/></Button></div><div className="dashboard"><div className="dash-top"><span>LIVE SHIPMENT OVERVIEW</span><i>● Online</i></div><div className="dash-route"><div><span>Origin</span><strong>SHANGHAI</strong></div><MoveRight/><div><span>Destination</span><strong>ROTTERDAM</strong></div></div><div className="dash-progress"><div><span>Voyage progress</span><b>68%</b></div><i><em/></i><small>Day 18 of 26 · ETA 08 Sep</small></div><div className="dash-bottom"><div className="chart"><span/><span/><span/><span/><span/><span/><span/></div><div className="eta"><span>ESTIMATED ARRIVAL</span><strong>08 <small>SEP</small></strong><p>On schedule <Check size={13}/></p></div></div></div></section>

      <section className="featured"><div className="feature-ship"><div className="small-wake"/><div className="feature-stack"/><div className="feature-hull"/></div><div className="feature-content"><span className="eyebrow light"><span /> Ocean freight</span><h2>From port<br />to <em>port.</em></h2><p>Your cargo moves with precision across the world’s major trade routes.</p><Button onClick={e => navigateTo(e, '/ocean-freight-fcl')}>Discover our capabilities <ArrowRight size={17}/></Button></div></section>


      <section className="reliability section-shell" id="about"><div><span className="eyebrow"><span /> Why Lara Shipping</span><h2>Built around<br /><em>reliability.</em></h2></div><div className="benefits">{benefits.map(({icon: Icon, title, copy}) => <article key={title}><div className="line-icon"><Icon size={21}/></div><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>

      <section className="quote-section" id="quote"><div className="quote-inner"><span className="eyebrow light"><span /> Let’s move forward</span><h2>Ready to move your<br /><em>business forward?</em></h2><p>Tell us what you’re shipping, where it’s going, and we’ll help find the right logistics solution.</p><div><Button onClick={e => navigateTo(e, '/quote')}>Get a Quote <ArrowRight size={17}/></Button><Button variant="secondary" onClick={(e) => { e.preventDefault(); setIsChatOpen(true); }}>Chat with Us <MessageCircle size={17}/></Button></div></div></section>
    </main>

    <footer><div className="footer-top section-shell"><div className="footer-brand"><Logo/><p>Global logistics, made more intelligent.</p><span>Connect With Us</span><div><a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Link size={17}/></a><a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Camera size={17}/></a><a href="#x" aria-label="X"><Send size={17}/></a></div></div><FooterColumn title="Company" items={['About Us', 'Careers', 'Global Network', 'Contact']}/><FooterColumn title="Services" items={['Ocean Freight', 'Air Freight', 'Warehousing', 'Customs', 'Transportation']}/><FooterColumn title="Resources" items={['Track Shipment', 'Get a Quote', 'FAQs', 'Support']}/></div><div className="footer-bottom section-shell"><span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span><div><a href="#privacy">Privacy policy</a><a href="#terms">Terms of use</a></div></div></footer>
  </div>;

  return (
    <>
      <div className={`page-redirect-bar ${pageTransitioning !== 'idle' ? 'active' : ''}`} />
      <div className={`page-transition-wrap ${pageTransitioning}`}>
        {content}
      </div>
      <FloatingSidebar onNavigate={navigateTo} onOpenChat={() => setIsChatOpen(true)} />
      <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} onNavigate={navigateTo} />
    </>
  )
}

function FloatingSidebar({ onNavigate, onOpenChat }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void; onOpenChat: () => void }) {
  return (
    <div className="floating-sidebar">
      <button type="button" className="fs-item fs-chat-item" onClick={onOpenChat} title="Chat with Us">
        <MessageCircle size={20} strokeWidth={2.5} />
        <span>Chat<br/>With Us</span>
      </button>
      <a href="/cbm-calculator" className="fs-item" onClick={e => onNavigate(e, '/cbm-calculator')} title="CBM Calculator">
        <Calculator size={20} strokeWidth={2.5} />
        <span>CBM<br/>Calc</span>
      </a>
      <a href="/our-offer" className="fs-item" onClick={e => onNavigate(e, '/our-offer')}>
        <Link size={20} strokeWidth={2.5} />
        <span>Our Offer</span>
      </a>
      <a href="/contact" className="fs-item" onClick={e => onNavigate(e, '/contact')}>
        <Mail size={20} strokeWidth={2.5} />
        <span>Contact<br/>Us</span>
      </a>
      <a href="/inco-terms" className="fs-item" onClick={e => onNavigate(e, '/inco-terms')}>
        <Box size={20} strokeWidth={2.5} />
        <span>Inco<br/>Terms</span>
      </a>
      <a href="/container-spec" className="fs-item" onClick={e => onNavigate(e, '/container-spec')}>
        <FileText size={20} strokeWidth={2.5} />
        <span>Container<br/>Specification</span>
      </a>
    </div>
  )
}

const getFooterLinkPath = (name: string) => {
  if (name === 'Home') return '/'
  if (name === 'About Us') return '/about'
  if (name === 'Services') return '/#services'
  if (name === 'Industries') return '/industries'
  if (name === 'Contact' || name === 'Contact Us') return '/contact'
  if (name === 'Air Freight') return '/air-freight'
  if (name === 'Cargo Insurance') return '/cargo-insurance'
  if (name === 'Ocean Freight' || name === 'Ocean Freight(FCL)' || name === 'Ocean Freight (FCL)') return '/ocean-freight-fcl'
  if (name === 'Ocean Freight(LCL)' || name === 'Ocean Freight (LCL)') return '/ocean-freight-lcl'
  if (name === 'Rail Freight') return '/rail-freight'
  if (name === 'Road Freight') return '/road-freight'
  if (name === 'Multi Modal') return '/multi-modal'
  if (name === 'Social, Weighting and Filling' || name === 'Social & Weighting & Filling' || name === 'Warehousing') return '/social-weighting'
  if (name === 'Contract Logistics') return '/contract-logistics'
  if (name === 'Cross Border E-Commerce') return '/cross-border'
  if (name === 'Customs Brokerage' || name === 'Customs') return '/customs-brokerage'
  if (name === 'Green Solution') return '/green-solution'
  if (name === 'Technology & Customer Services' || name === 'Technology & Customer Solution') return '/technology-customer-solution'
  if (name === 'Global Network') return '/#global-network'
  if (name === 'Careers' || name === 'Track Shipment' || name === 'Get a Quote' || name === 'FAQs' || name === 'Support' || name === 'Transportation') return '/#quote'
  return '/'
}

function FooterColumn({title, items}: {title: string; items: string[]}) {
  const navigate = (e: ReactMouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const [basePath, hash] = path.split('#');
    if (basePath === window.location.pathname || (basePath === '' && !hash)) {
      if (hash) {
        window.history.pushState({}, '', path);
        setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 10);
      } else {
        window.scrollTo(0, 0);
      }
      return;
    }
    const updatePage = () => {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      if (hash) {
        setTimeout(() => document.getElementById(hash)?.scrollIntoView(), 10);
      } else {
        window.scrollTo(0, 0);
      }
    };
    const documentWithTransition = document as Document & { startViewTransition?: (callback: () => void) => void };
    documentWithTransition.startViewTransition ? documentWithTransition.startViewTransition(updatePage) : updatePage();
  };

  return <div className="footer-column">
    <h3>{title}</h3>
    {items.map(item => {
      const path = getFooterLinkPath(item);
      return <a key={item} href={path} onClick={(e) => navigate(e as any, path)}>{item}</a>
    })}
  </div>
}

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
    <footer className="industries-footer"><div className="industries-footer-inner section-shell"><div className="industries-footer-brand"><Logo /><p>LARA SHIPPING LINE PVT LTD</p><span>Connect With Us</span><div><a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a><a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a><a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a><a href="#x" aria-label="X">𝕏</a></div></div><FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']}/><FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight']}/><FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']}/></div><div className="footer-bottom section-shell"><span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span></div></footer>
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
    <MapComponent />
    <footer className="industries-footer"><div className="industries-footer-inner section-shell"><div className="industries-footer-brand"><Logo /><p>LARA SHIPPING LINE PVT LTD</p><span>Connect With Us</span><div><a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a><a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a><a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a><a href="#x" aria-label="X">𝕏</a></div></div><FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']}/><FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight']}/><FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']}/></div><div className="footer-bottom section-shell"><span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span></div></footer>
  </div>
}

function ContactOffice({ title, subtitle, details }: { title: string; subtitle?: string; details: [string, string][] }) {
  return <section className="contact-office"><h2>{title}</h2>{subtitle && <strong>{subtitle}</strong>}{details.map(([type, content], index) => { const Icon = type === 'address' ? MapPin : type === 'email' ? Mail : Phone; return <p key={`${type}-${index}`}><Icon size={20}/><span>{content}</span></p> })}</section>
}

function OurOfferPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const submitOffer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return <div className="contact-page">
    <header className="about-header"><div className="about-header-inner"><Logo href="/" /><nav aria-label="Primary navigation"><a href="/" onClick={event => onNavigate(event, '/')}>Home</a><a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a><a href="/#services" onClick={event => onNavigate(event, '/#services')}>Services</a><a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a><a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a></nav><a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15}/></a></div></header>
    <main className="contact-main section-shell">
      <section className="contact-details">
        <span className="eyebrow light"><span /> Our Offer</span>
        <h1>We're here <em>for you!</em></h1>
        <p className="contact-company">Lara Shipping Line</p>
        <p style={{color:'#b3c7cf', maxWidth:'400px', lineHeight:'1.7', marginTop:'30px'}}>Tell us about your requirements, select the services you need, and our dedicated team will work with you to find the most efficient logistics solution.</p>
      </section>
      <section className="contact-form-wrap">
        <div className="contact-form-heading">
          <span className="eyebrow light"><span /> Request an offer</span>
          <h2>Submit Details</h2>
          <p>Provide your cargo and contact details below.</p>
          <div className="contact-response-note"><span><i /> Typically replies within one business day</span><span>Secure &amp; confidential</span></div>
        </div>
        <form className="contact-form" onSubmit={submitOffer}>
          {submitted ? <div className="contact-success" role="status"><Check size={22}/><div><strong>Request received</strong><p>Thank you. Our team will review your offer request.</p></div><button type="button" onClick={() => setSubmitted(false)}>Submit another</button></div> : <>
            <div className="contact-form-row">
              <label>Your Name<input name="name" autoComplete="name" placeholder="Your full name" required /></label>
              <label>Company Name<input name="company" placeholder="Company name" /></label>
            </div>
            <div className="contact-form-row">
              <label>Email Id <b>*</b><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label>
              <label>Contact No <b>*</b><input name="contact" type="tel" placeholder="Phone number" required /></label>
            </div>
            <div className="contact-form-row">
              <label>Select Service <b>*</b>
                <div style={{position:'relative'}}>
                  <select name="service" required defaultValue="" style={{width:'100%', height:'46px', padding:'0 16px', border:'1px solid #527586', background:'rgba(255,255,255,.96)', borderRadius:'2px', color:'#000', outline:'none', appearance:'none', fontSize:'13px', boxShadow:'inset 0 1px rgba(3,25,36,.08)'}}>
                    <option value="" disabled>Select Service</option>
                    {services.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                  <ChevronDown size={14} style={{position:'absolute', right:'16px', top:'16px', color:'#527586', pointerEvents:'none'}} />
                </div>
              </label>
              <label>Commodity <b>*</b><input name="commodity" placeholder="Cargo type" required /></label>
            </div>
            <label>Remarks<textarea name="remarks" rows={4} placeholder="Any specific requirements or details..." style={{minHeight:'90px'}} /></label>
            <div className="contact-form-footer">
              <small>By submitting, you agree to be contacted by our logistics team.</small>
              <button className="contact-submit" type="submit">Submit <ArrowRight size={16}/></button>
            </div>
          </>}
        </form>
      </section>
    </main>
    <footer className="industries-footer"><div className="industries-footer-inner section-shell"><div className="industries-footer-brand"><Logo /><p>LARA SHIPPING LINE PVT LTD</p><span>Connect With Us</span><div><a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a><a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a><a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a><a href="#x" aria-label="X">𝕏</a></div></div><FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']}/><FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight(FCL)', 'Multi Modal', 'Ocean Freight(LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']}/><FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']}/></div><div className="footer-bottom section-shell"><span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span></div></footer>
  </div>
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
    <footer className="industries-footer"><div className="industries-footer-inner section-shell"><div className="industries-footer-brand"><Logo /><p>LARA SHIPPING LINE PVT LTD</p><span>Connect With Us</span><div><a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a><a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a><a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a><a href="#x" aria-label="X">𝕏</a></div></div><FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']}/><FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight(FCL)', 'Multi Modal', 'Ocean Freight(LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']}/><FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']}/></div><div className="footer-bottom section-shell"><span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span></div></footer>
  </div>
}

function AirFreightPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
        {/* Top Hero Banner */}
        <section className="af-hero-banner" aria-label="Air Freight Logistics Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and cargo transit port at twilight"
            className="af-hero-img"
          />
          <div className="af-hero-overlay" />
        </section>

        {/* Intro Section: AIR FREIGHT + Two Columns with photo and text */}
        <section className="af-intro-section section-shell">
          <div className="af-intro-header">
            <span className="eyebrow light"><span /> Freight Forwarding Services</span>
            <h1>AIR FREIGHT</h1>
          </div>

          <div className="af-intro-grid">
            {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
            <div className="af-photo-frame">
              <div className="af-photo-backdrop" />
              <div className="af-photo-container">
                <img
                  src="/air-freight-tarmac.jpg"
                  alt="Commercial cargo aircraft turbine and freight pallet loading on tarmac"
                />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="af-intro-copy">
              <p>
                LARA SHIPPING offers airfreight services through its global network of offices. By partnering with leading carriers, LARA SHIPPING ensures that customer's cargo needs are met through a variety of solutions including fixed schedules on our daily flights, consolidation services in our own facilities and the creation of specialized solutions based on customer's unique requirements. Throughout the entire process, global compliance and security requirements are met at all times.
              </p>
              <p>
                LARA SHIPPING has successfully implemented strategic alliances with carriers that uphold the standards of quality and value that are passed on to our valued customers. As part of this expectation, we require air carriers to report their performance during formal business reviews. The result is that our carrier strategy leverages 70% of the global volume to core and preferred carriers; ensuring market competitive rates while protecting capacity during shoulder and peak times.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: What We Do */}
        <section className="af-what-we-do-section section-shell">
          <div className="af-what-header">
            <span className="eyebrow light"><span /> What We Do</span>
            <h2>What We do</h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
          </div>

          <div className="af-pillars-grid">
            <article className="af-pillar-card">
              <div className="af-pillar-icon"><Zap size={26} /></div>
              <h3>Fast Delivery</h3>
              <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
            </article>

            <article className="af-pillar-card">
              <div className="af-pillar-icon"><Globe2 size={26} /></div>
              <h3>Global Reach</h3>
              <p>Our Air Freight service connects you to a vast network of destinations worldwide.</p>
            </article>

            <article className="af-pillar-card">
              <div className="af-pillar-icon"><ShieldCheck size={26} /></div>
              <h3>Secure Handling</h3>
              <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
            </article>

            <article className="af-pillar-card">
              <div className="af-pillar-icon"><Sparkles size={26} /></div>
              <h3>Tailored Solutions</h3>
              <p>We provide customized air freight solutions to meet your specific needs.</p>
            </article>
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
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
      </div>
      <div className="footer-bottom section-shell">
        <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
      </div>
    </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function CargoInsurancePage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        {/* Top Hero Banner */}
        <section className="ci-hero-banner" aria-label="Cargo Insurance Logistics Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and cargo transit port at twilight"
            className="ci-hero-img"
          />
          <div className="ci-hero-overlay" />
        </section>

        {/* Intro Section: Cargo Insurance + Two Columns with photo and text */}
        <section className="ci-intro-section section-shell">
          <div className="ci-intro-header">
            <h1>Cargo Insurance</h1>
          </div>

          <div className="ci-intro-grid">
            {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
            <div className="ci-photo-frame">
              <div className="ci-photo-backdrop" />
              <div className="ci-photo-container">
                <img
                  src="/cargo-insurance-port.jpg"
                  alt="Container port terminal with towering gantry crane and container freight truck"
                />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="ci-intro-copy">
              <p>
                Transportation carriers are often responsible only for their legal liability for damage caused to your cargo, which may not be equal to the full value of your cargo, and in many cases, such as acts of god, may not be liable for the damage for the loss or damage at all. Even in the case your cargo was not damaged and discharged successfully at your destination, you may still need to pay for the loss of others under the "General Average" concept.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: What We Do */}
        <section className="ci-what-we-do-section section-shell">
          <div className="ci-what-header">
            <h2>What We do</h2>
            <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
          </div>

          <div className="ci-pillars-grid">
            <article className="ci-pillar-card">
              <div className="ci-pillar-icon"><Truck size={26} /></div>
              <h3>Fast Delivery</h3>
              <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
            </article>

            <article className="ci-pillar-card">
              <div className="ci-pillar-icon"><Globe2 size={26} /></div>
              <h3>Global Reach</h3>
              <p>Our Air Freight service connects you to a vast network of destinations worldwide.</p>
            </article>

            <article className="ci-pillar-card">
              <div className="ci-pillar-icon"><ShieldCheck size={26} /></div>
              <h3>Secure Handling</h3>
              <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
            </article>

            <article className="ci-pillar-card">
              <div className="ci-pillar-icon"><Sparkles size={26} /></div>
              <h3>Tailored Solutions</h3>
              <p>We provide customized air freight solutions to meet your specific needs.</p>
            </article>
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
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
      </div>
      <div className="footer-bottom section-shell">
        <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
      </div>
    </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function MultiModalPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="mm-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
            <a href="/#services" className="active" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        {/* Top Hero Banner with the airplane taking off at sunset */}
        <section className="mm-hero-banner" aria-label="Multi Modal Freight Hero">
          <img
            src="/multimodal-hero.jpg"
            alt="Cargo airplane flying over clouds at sunset"
            className="mm-hero-img"
          />
          <div className="mm-hero-overlay" />
        </section>

        {/* Section 1: Multi Modal Intro with Photo Card & Blue Offset Frame */}
        <section className="mm-intro-section section-shell">
          <div className="mm-intro-title-center">
            <span className="eyebrow light"><span /> Freight Forwarding Services</span>
            <h1>Multi Modal</h1>
            <p>Integrated multimodal transport synchronizing ocean, air, rail, and road to deliver superior speed, cost efficiency, and reliable scheduling.</p>
          </div>

          <div className="mm-intro-grid">
            {/* Left: Port image with blue offset shadow card */}
            <div className="mm-photo-frame">
              <div className="mm-photo-backdrop" />
              <div className="mm-photo-container">
                <img
                  src="/multimodal-port.jpg"
                  alt="Multimodal container port with cargo ships and airplane"
                />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="mm-intro-copy">
              <h2 className="mm-quote-text">
                Whether shipping by sea, air, road, or rail, our team members are trained to help you find the combination that fits your needs.
              </h2>
              <p className="mm-secondary-text">
                LARA SHIPPING LINE combines global maritime volume with scheduled rail corridors, road networks, and express air freight. By integrating multimodal logistics under one unified contract, we remove operational friction, cut transit times, and deliver transparent end-to-end tracking for time-critical and high-volume cargo.
              </p>
              <div className="mm-signals-row">
                <div className="mm-signal-item">
                  <b>100%</b>
                  <span>Single Contract</span>
                </div>
                <div className="mm-signal-item">
                  <b>120+</b>
                  <span>Connected Corridors</span>
                </div>
                <div className="mm-signal-item">
                  <b>24/7</b>
                  <span>Live Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: What We Do */}
        <section className="mm-what-we-do-section section-shell">
          <div className="mm-what-header">
            <span className="eyebrow light"><span /> What We do</span>
            <h2>Your one-stop shop for global shipping.</h2>
            <p>We handle everything from complex logistics to seamless delivery.</p>
          </div>

          <div className="mm-pillars-grid">
            <article className="mm-pillar-card">
              <div className="mm-pillar-icon"><Truck size={26} /></div>
              <h3>Fast Delivery</h3>
              <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
            </article>

            <article className="mm-pillar-card">
              <div className="mm-pillar-icon"><Globe2 size={26} /></div>
              <h3>Global Reach</h3>
              <p>Our Air Freight service connects you to a vast network of destinations worldwide.</p>
            </article>

            <article className="mm-pillar-card">
              <div className="mm-pillar-icon"><ShieldCheck size={26} /></div>
              <h3>Secure Handling</h3>
              <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
            </article>

            <article className="mm-pillar-card">
              <div className="mm-pillar-icon"><Sparkles size={26} /></div>
              <h3>Tailored Solutions</h3>
              <p>We provide customized air freight solutions to meet your specific needs.</p>
            </article>
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
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function OceanFreightLCLPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="ocean-lcl-page">
      {/* Top Floating Transparent Header directly over Hero Banner */}
      <header className="of-header">
        <div className="of-header-inner">
          <Logo href="/" />
          
          <nav className="of-nav" aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
            
            <div 
              className="of-services-pill"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button 
                type="button" 
                className="of-services-pill-btn"
                onClick={() => setServicesOpen(open => !open)}
                aria-expanded={servicesOpen}
              >
                Services <ChevronDown size={14} />
              </button>
              {servicesOpen && (
                <div className="of-services-dropdown" role="menu">
                  <div className="of-dropdown-sector">Freight Forwarding Services</div>
                  {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => (
                    <a 
                      key={name} 
                      href={getServicePath(name)} 
                      className={name === 'Ocean Freight (LCL)' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                  <div className="of-dropdown-sector">Customer Solution</div>
                  {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => (
                    <a 
                      key={name} 
                      href={getServicePath(name)}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>

          <div className="of-header-actions">
            <button 
              className="of-login-btn" 
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button 
              className="of-mobile-toggle" 
              type="button" 
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="of-mobile-menu">
            <a href="/" onClick={e => { onNavigate(e, '/'); setMobileOpen(false); }}>Home</a>
            <a href="/about" onClick={e => { onNavigate(e, '/about'); setMobileOpen(false); }}>About Us</a>
            <a href="/#services" onClick={e => { onNavigate(e, '/#services'); setMobileOpen(false); }}>Services</a>
            <a href="/industries" onClick={e => { onNavigate(e, '/industries'); setMobileOpen(false); }}>Industries</a>
            <a href="/contact" onClick={e => { onNavigate(e, '/contact'); setMobileOpen(false); }}>Contact Us</a>
            <button className="of-mobile-login" type="button" onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }}>
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Top Hero Banner */}
        <section className="of-hero-banner" aria-label="Ocean Freight LCL Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and container transit port at dusk"
            className="of-hero-img"
          />
          <div className="of-hero-overlay" />
        </section>

        {/* Content Container holding Title, Intro Grid, and What We Do */}
        <div className="of-content-container">
          {/* Intro Section: Ocean Freight (LCL) + Two Columns with photo and text */}
          <section className="of-intro-section">
            <div className="of-intro-header">
              <h1>Ocean Freight (LCL)</h1>
            </div>

            <div className="of-intro-grid">
              {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
              <div className="of-photo-frame">
                <div className="of-photo-backdrop" />
                <div className="of-photo-container">
                  <img
                    src="/air-freight-tarmac.jpg"
                    alt="Ocean freight LCL cargo consolidation and logistics operations"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="of-intro-copy">
                <p>
                  Completely integrated LCL service (pre/post carriage, cross docking &amp; ocean shipment) for all our customers from our closest consolidation freight station to your final destination, to reduce shipments costs and carbon impact thanks to optimized containers and sailings. This end to end service is facilitated thanks to a local customer service at each destination and a global control tower managing &amp; optimizing all LCL flows. Different levels of traceability can be proposed.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do */}
          <section className="of-what-we-do-section">
            <div className="of-what-header">
              <h2>What We do</h2>
              <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
            </div>

            <div className="of-pillars-grid">
              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Truck size={32} strokeWidth={1.8} /></div>
                <h3>Fast Delivery</h3>
                <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Search size={32} strokeWidth={1.8} /></div>
                <h3>Global Reach</h3>
                <p>Our Air Freight service connects you to a vast network of destinations worldwide</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><ClipboardCheck size={32} strokeWidth={1.8} /></div>
                <h3>Secure Handling</h3>
                <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Megaphone size={32} strokeWidth={1.8} /></div>
                <h3>Tailored Solutions</h3>
                <p>We provide customized air freight solutions to meet your specific needs.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your LCL shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function OceanFreightFCLPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="ocean-fcl-page">
      {/* Top Floating Transparent Header directly over Hero Banner */}
      <header className="of-header">
        <div className="of-header-inner">
          <Logo href="/" />
          
          <nav className="of-nav" aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
            
            <div 
              className="of-services-pill"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button 
                type="button" 
                className="of-services-pill-btn"
                onClick={() => setServicesOpen(open => !open)}
                aria-expanded={servicesOpen}
              >
                Services <ChevronDown size={14} />
              </button>
              {servicesOpen && (
                <div className="of-services-dropdown" role="menu">
                  <div className="of-dropdown-sector">Freight Forwarding Services</div>
                  {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => (
                    <a 
                      key={name} 
                      href={getServicePath(name)} 
                      className={name === 'Ocean Freight (FCL)' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                  <div className="of-dropdown-sector">Customer Solution</div>
                  {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => (
                    <a 
                      key={name} 
                      href={getServicePath(name)}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>

          <div className="of-header-actions">
            <button 
              className="of-login-btn" 
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button 
              className="of-mobile-toggle" 
              type="button" 
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="of-mobile-menu">
            <a href="/" onClick={e => { onNavigate(e, '/'); setMobileOpen(false); }}>Home</a>
            <a href="/about" onClick={e => { onNavigate(e, '/about'); setMobileOpen(false); }}>About Us</a>
            <a href="/#services" onClick={e => { onNavigate(e, '/#services'); setMobileOpen(false); }}>Services</a>
            <a href="/industries" onClick={e => { onNavigate(e, '/industries'); setMobileOpen(false); }}>Industries</a>
            <a href="/contact" onClick={e => { onNavigate(e, '/contact'); setMobileOpen(false); }}>Contact Us</a>
            <button className="of-mobile-login" type="button" onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }}>
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Top Hero Banner */}
        <section className="of-hero-banner" aria-label="Ocean Freight FCL Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and container transit port at dusk"
            className="of-hero-img"
          />
          <div className="of-hero-overlay" />
        </section>

        {/* Content Container holding Title, Intro Grid, and What We Do */}
        <div className="of-content-container">
          {/* Intro Section: Ocean Freight (FCL) + Two Columns with photo and text */}
          <section className="of-intro-section">
            <div className="of-intro-header">
              <h1>Ocean Freight (FCL)</h1>
            </div>

            <div className="of-intro-grid">
              {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
              <div className="of-photo-frame">
                <div className="of-photo-backdrop" />
                <div className="of-photo-container">
                  <img
                    src="/air-freight-tarmac.jpg"
                    alt="Ocean freight cargo operations and container loading"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="of-intro-copy">
                <p>
                  Our carrier relationships enable us to offer the right services at competitive rates while our expertise and seamless global networks help reduce your administrative burden. Long term relationships with carriers responsible for the majority of LARA SHIPPING LINE ocean volume mean that we can ensure the availability of space and equipment. We actively manage contracts and service levels to ensure our customers receive the best possible, reliable service at competitive rates. From end to end, the status of your shipment is also visible in real-time via our platform.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do */}
          <section className="of-what-we-do-section">
            <div className="of-what-header">
              <h2>What We do</h2>
              <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
            </div>

            <div className="of-pillars-grid">
              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Truck size={32} strokeWidth={1.8} /></div>
                <h3>Fast Delivery</h3>
                <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Search size={32} strokeWidth={1.8} /></div>
                <h3>Global Reach</h3>
                <p>Our Air Freight service connects you to a vast network of destinations worldwide</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><ClipboardCheck size={32} strokeWidth={1.8} /></div>
                <h3>Secure Handling</h3>
                <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Megaphone size={32} strokeWidth={1.8} /></div>
                <h3>Tailored Solutions</h3>
                <p>We provide customized air freight solutions to meet your specific needs.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your FCL shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function RailFreightPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="rail-freight-page">
      <header className="of-header">
        <div className="of-header-inner">
          <Logo href="/" onClick={e => onNavigate(e, '/')} />

          <nav className="of-nav" aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>

            <div
              className="of-services-pill"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="of-services-pill-btn"
                onClick={() => setServicesOpen(open => !open)}
                aria-expanded={servicesOpen}
              >
                Services <ChevronDown size={14} />
              </button>
              {servicesOpen && (
                <div className="of-services-dropdown" role="menu">
                  <div className="of-dropdown-sector">Freight Forwarding Services</div>
                  {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Rail Freight' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                  <div className="of-dropdown-sector">Customer Solution</div>
                  {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Rail Freight' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>

          <div className="of-header-actions">
            <button
              className="of-login-btn"
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="of-mobile-toggle"
              type="button"
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="of-mobile-menu">
            <a href="/" onClick={e => { onNavigate(e, '/'); setMobileOpen(false); }}>Home</a>
            <a href="/about" onClick={e => { onNavigate(e, '/about'); setMobileOpen(false); }}>About Us</a>
            <a href="/#services" onClick={e => { onNavigate(e, '/#services'); setMobileOpen(false); }}>Services</a>
            <a href="/industries" onClick={e => { onNavigate(e, '/industries'); setMobileOpen(false); }}>Industries</a>
            <a href="/contact" onClick={e => { onNavigate(e, '/contact'); setMobileOpen(false); }}>Contact Us</a>
            <button className="of-mobile-login" type="button" onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }}>
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Top Hero Banner */}
        <section className="of-hero-banner" aria-label="Rail Freight Logistics Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and freight transit port at dusk"
            className="of-hero-img"
          />
          <div className="of-hero-overlay" />
        </section>

        {/* Content Container holding Title, Intro Grid, and What We Do */}
        <div className="of-content-container">
          {/* Intro Section: Rail Freight + Two Columns with photo and text */}
          <section className="of-intro-section">
            <div className="of-intro-header">
              <h1>Rail Freight</h1>
            </div>

            <div className="of-intro-grid">
              {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
              <div className="of-photo-frame">
                <div className="of-photo-backdrop" />
                <div className="of-photo-container">
                  <img
                    src="/rail-freight-train.jpg"
                    alt="Rail freight train carrying cargo containers across tracks"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="of-intro-copy">
                <p>
                  Compared to ocean freight and road transport, rail-based solutions are highly dependable and help eliminate long transit times with its high speeds over long distances. Furthermore, as a result of its comparatively low CO2 emissions, rail-based solutions can be an environmentally friendly and budget-friendly option when shipping by sea is not an option. Our powerful IT support enables clear communication throughout the shipping process, as team members track your shipment from start to finish. This same GPS tracking system provides an extra layer of security helping prevent transit losses and theft. With a green and reliable rail-based services across Europe and Asia, extensive knowledge of the market, and an entirely independent position, our team members are equipped to find the perfect rail freight solution to fit your needs.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do */}
          <section className="of-what-we-do-section">
            <div className="of-what-header">
              <h2>What We do</h2>
              <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
            </div>

            <div className="of-pillars-grid">
              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Truck size={32} strokeWidth={1.8} /></div>
                <h3>Fast Delivery</h3>
                <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Search size={32} strokeWidth={1.8} /></div>
                <h3>Global Reach</h3>
                <p>Our Air Freight service connects you to a vast network of destinations worldwide</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><ClipboardCheck size={32} strokeWidth={1.8} /></div>
                <h3>Secure Handling</h3>
                <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Megaphone size={32} strokeWidth={1.8} /></div>
                <h3>Tailored Solutions</h3>
                <p>We provide customized air freight solutions to meet your specific needs.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function RoadFreightPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="road-freight-page">
      <header className="of-header">
        <div className="of-header-inner">
          <Logo href="/" onClick={e => onNavigate(e, '/')} />

          <nav className="of-nav" aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>

            <div
              className="of-services-pill"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="of-services-pill-btn"
                onClick={() => setServicesOpen(open => !open)}
                aria-expanded={servicesOpen}
              >
                Services <ChevronDown size={14} />
              </button>
              {servicesOpen && (
                <div className="of-services-dropdown" role="menu">
                  <div className="of-dropdown-sector">Freight Forwarding Services</div>
                  {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Road Freight' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                  <div className="of-dropdown-sector">Customer Solution</div>
                  {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Road Freight' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>

          <div className="of-header-actions">
            <button
              className="of-login-btn"
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="of-mobile-toggle"
              type="button"
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="of-mobile-menu">
            <a href="/" onClick={e => { onNavigate(e, '/'); setMobileOpen(false); }}>Home</a>
            <a href="/about" onClick={e => { onNavigate(e, '/about'); setMobileOpen(false); }}>About Us</a>
            <a href="/#services" onClick={e => { onNavigate(e, '/#services'); setMobileOpen(false); }}>Services</a>
            <a href="/industries" onClick={e => { onNavigate(e, '/industries'); setMobileOpen(false); }}>Industries</a>
            <a href="/contact" onClick={e => { onNavigate(e, '/contact'); setMobileOpen(false); }}>Contact Us</a>
            <button className="of-mobile-login" type="button" onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }}>
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Top Hero Banner */}
        <section className="of-hero-banner" aria-label="Road Freight Logistics Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and freight transit port at dusk"
            className="of-hero-img"
          />
          <div className="of-hero-overlay" />
        </section>

        {/* Content Container holding Title, Intro Grid, and What We Do */}
        <div className="of-content-container">
          {/* Intro Section: Road Freight + Two Columns with photo and text */}
          <section className="of-intro-section">
            <div className="of-intro-header">
              <h1>Road Freight</h1>
            </div>

            <div className="of-intro-grid">
              {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
              <div className="of-photo-frame">
                <div className="of-photo-backdrop" />
                <div className="of-photo-container">
                  <img
                    src="/road-freight-truck.jpg"
                    alt="Road freight cargo truck at loading dock"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="of-intro-copy">
                <p>
                  More than 3 billion people worldwide live in rural areas. Road freight is the only mode of transport that can reach the most remote places across the globe. You never have to compromise flexibility and efficiency when shipping goods over long or short distance. Our road transport solutions serve Europe, Asia, and the Middle East. We leverage our extensive knowledge of the market and our independent positioning to create the perfect road freight solution.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do */}
          <section className="of-what-we-do-section">
            <div className="of-what-header">
              <h2>What We do</h2>
              <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
            </div>

            <div className="of-pillars-grid">
              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Truck size={32} strokeWidth={1.8} /></div>
                <h3>Fast Delivery</h3>
                <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Search size={32} strokeWidth={1.8} /></div>
                <h3>Global Reach</h3>
                <p>Our Air Freight service connects you to a vast network of destinations worldwide</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><ClipboardCheck size={32} strokeWidth={1.8} /></div>
                <h3>Secure Handling</h3>
                <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Megaphone size={32} strokeWidth={1.8} /></div>
                <h3>Tailored Solutions</h3>
                <p>We provide customized air freight solutions to meet your specific needs.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function SocialWeightingPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="social-weighting-page">
      <header className="of-header">
        <div className="of-header-inner">
          <Logo href="/" onClick={e => onNavigate(e, '/')} />

          <nav className="of-nav" aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>

            <div
              className="of-services-pill"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="of-services-pill-btn"
                onClick={() => setServicesOpen(open => !open)}
                aria-expanded={servicesOpen}
              >
                Services <ChevronDown size={14} />
              </button>
              {servicesOpen && (
                <div className="of-services-dropdown" role="menu">
                  <div className="of-dropdown-sector">Freight Forwarding Services</div>
                  {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Social, Weighting and Filling' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                  <div className="of-dropdown-sector">Customer Solution</div>
                  {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Social, Weighting and Filling' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>

          <div className="of-header-actions">
            <button
              className="of-login-btn"
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="of-mobile-toggle"
              type="button"
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="of-mobile-menu">
            <a href="/" onClick={e => { onNavigate(e, '/'); setMobileOpen(false); }}>Home</a>
            <a href="/about" onClick={e => { onNavigate(e, '/about'); setMobileOpen(false); }}>About Us</a>
            <a href="/#services" onClick={e => { onNavigate(e, '/#services'); setMobileOpen(false); }}>Services</a>
            <a href="/industries" onClick={e => { onNavigate(e, '/industries'); setMobileOpen(false); }}>Industries</a>
            <a href="/contact" onClick={e => { onNavigate(e, '/contact'); setMobileOpen(false); }}>Contact Us</a>
            <button className="of-mobile-login" type="button" onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }}>
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Top Hero Banner */}
        <section className="of-hero-banner" aria-label="Social, Weighting & Filling Logistics Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and container transit port at dusk"
            className="of-hero-img"
          />
          <div className="of-hero-overlay" />
        </section>

        {/* Content Container holding Title, Intro Grid, and What We Do */}
        <div className="of-content-container">
          {/* Intro Section: Title + Two Columns with photo and text */}
          <section className="of-intro-section">
            <div className="of-intro-header">
              <h1>Social &amp; Weighting &amp; Filling</h1>
            </div>

            <div className="of-intro-grid">
              {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
              <div className="of-photo-frame">
                <div className="of-photo-backdrop" />
                <div className="of-photo-container">
                  <img
                    src="/social-weighting-phone.jpg"
                    alt="Smartphone with social connectivity and cargo tracking icons"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="of-intro-copy">
                <p>
                  LARA SHIPPING offers airfreight services through its global network of offices. By partnering with leading carriers, LARA SHIPPING ensures that customer's cargo needs are met through a variety of solutions including fixed schedules on our daily flights, consolidation services in our own facilities and the creation of specialized solutions based on customer's unique requirements. Throughout the entire process, global compliance and security requirements are met at all times.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do */}
          <section className="of-what-we-do-section">
            <div className="of-what-header">
              <h2>What We do</h2>
              <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
            </div>

            <div className="of-pillars-grid">
              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Truck size={32} strokeWidth={1.8} /></div>
                <h3>Fast Delivery</h3>
                <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Search size={32} strokeWidth={1.8} /></div>
                <h3>Global Reach</h3>
                <p>Our Air Freight service connects you to a vast network of destinations worldwide</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><ClipboardCheck size={32} strokeWidth={1.8} /></div>
                <h3>Secure Handling</h3>
                <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Megaphone size={32} strokeWidth={1.8} /></div>
                <h3>Tailored Solutions</h3>
                <p>We provide customized air freight solutions to meet your specific needs.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ContractLogisticsPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="contract-logistics-page">
      {/* Top Floating Transparent Header directly over Hero Banner */}
      <header className="of-header">
        <div className="of-header-inner">
          <Logo href="/" onClick={e => onNavigate(e, '/')} />

          <nav className="of-nav" aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>

            <div
              className="of-services-pill"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="of-services-pill-btn"
                onClick={() => setServicesOpen(open => !open)}
                aria-expanded={servicesOpen}
              >
                Services <ChevronDown size={14} />
              </button>
              {servicesOpen && (
                <div className="of-services-dropdown" role="menu">
                  <div className="of-dropdown-sector">Freight Forwarding Services</div>
                  {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Contract Logistics' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                  <div className="of-dropdown-sector">Customer Solution</div>
                  {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Contract Logistics' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>

          <div className="of-header-actions">
            <button
              className="of-login-btn"
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="of-mobile-toggle"
              type="button"
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="of-mobile-menu">
            <a href="/" onClick={e => { onNavigate(e, '/'); setMobileOpen(false); }}>Home</a>
            <a href="/about" onClick={e => { onNavigate(e, '/about'); setMobileOpen(false); }}>About Us</a>
            <a href="/#services" onClick={e => { onNavigate(e, '/#services'); setMobileOpen(false); }}>Services</a>
            <a href="/industries" onClick={e => { onNavigate(e, '/industries'); setMobileOpen(false); }}>Industries</a>
            <a href="/contact" onClick={e => { onNavigate(e, '/contact'); setMobileOpen(false); }}>Contact Us</a>
            <button className="of-mobile-login" type="button" onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }}>
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Top Hero Banner */}
        <section className="of-hero-banner" aria-label="Contract Logistics Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and container transit port at dusk"
            className="of-hero-img"
          />
          <div className="of-hero-overlay" />
        </section>

        {/* Content Container holding Title, Intro Grid, and What We Do */}
        <div className="of-content-container">
          {/* Intro Section: Contract Logistics + Two Columns with photo and text */}
          <section className="of-intro-section">
            <div className="of-intro-header">
              <h1>Contract Logistics</h1>
            </div>

            <div className="of-intro-grid">
              {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
              <div className="of-photo-frame">
                <div className="of-photo-backdrop" />
                <div className="of-photo-container">
                  <img
                    src="/contract-logistics-team.jpg"
                    alt="Logistics staff with packages and handshake"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="of-intro-copy">
                <p>
                  REPLICABLE, SCALABLE, RAPID DEPLOYMENT Give your supply chain the peace of mind it needs. Tap into our global infrastructure and local expertise and never worry about demand spikes or last-minute regulatory changes.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do */}
          <section className="of-what-we-do-section">
            <div className="of-what-header">
              <h2>What We do</h2>
              <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
            </div>

            <div className="of-pillars-grid">
              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Truck size={32} strokeWidth={1.8} /></div>
                <h3>Fast Delivery</h3>
                <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Search size={32} strokeWidth={1.8} /></div>
                <h3>Global Reach</h3>
                <p>Our Air Freight service connects you to a vast network of destinations worldwide</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><ClipboardCheck size={32} strokeWidth={1.8} /></div>
                <h3>Secure Handling</h3>
                <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Megaphone size={32} strokeWidth={1.8} /></div>
                <h3>Tailored Solutions</h3>
                <p>We provide customized air freight solutions to meet your specific needs.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


function CrossBorderEcommercePage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="cross-border-page">
      {/* Top Floating Transparent Header directly over Hero Banner */}
      <header className="of-header">
        <div className="of-header-inner">
          <Logo href="/" onClick={e => onNavigate(e, '/')} />

          <nav className="of-nav" aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>

            <div
              className="of-services-pill"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="of-services-pill-btn"
                onClick={() => setServicesOpen(open => !open)}
                aria-expanded={servicesOpen}
              >
                Services <ChevronDown size={14} />
              </button>
              {servicesOpen && (
                <div className="of-services-dropdown" role="menu">
                  <div className="of-dropdown-sector">Freight Forwarding Services</div>
                  {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Cross Border E-Commerce' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                  <div className="of-dropdown-sector">Customer Solution</div>
                  {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Cross Border E-Commerce' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>

          <div className="of-header-actions">
            <button
              className="of-login-btn"
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="of-mobile-toggle"
              type="button"
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="of-mobile-menu">
            <a href="/" onClick={e => { onNavigate(e, '/'); setMobileOpen(false); }}>Home</a>
            <a href="/about" onClick={e => { onNavigate(e, '/about'); setMobileOpen(false); }}>About Us</a>
            <a href="/#services" onClick={e => { onNavigate(e, '/#services'); setMobileOpen(false); }}>Services</a>
            <a href="/industries" onClick={e => { onNavigate(e, '/industries'); setMobileOpen(false); }}>Industries</a>
            <a href="/contact" onClick={e => { onNavigate(e, '/contact'); setMobileOpen(false); }}>Contact Us</a>
            <button className="of-mobile-login" type="button" onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }}>
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Top Hero Banner */}
        <section className="of-hero-banner" aria-label="Cross Border E-Commerce Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and container transit port at dusk"
            className="of-hero-img"
          />
          <div className="of-hero-overlay" />
        </section>

        {/* Content Container holding Title, Intro Grid, and What We Do */}
        <div className="of-content-container">
          {/* Intro Section: Cross Border E-Commerce + Two Columns with photo and text */}
          <section className="of-intro-section">
            <div className="of-intro-header">
              <h1>Cross Border E-<br />Commerce</h1>
            </div>

            <div className="of-intro-grid">
              {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
              <div className="of-photo-frame">
                <div className="of-photo-backdrop" />
                <div className="of-photo-container">
                  <img
                    src="/cross-border-ecommerce.jpg"
                    alt="Laptop with e-commerce cart illustration on desk"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="of-intro-copy">
                <p>
                  LARA SHIPPING brokerage services provide clients with expertise around the globe. LARA SHIPPING brokers are professionals with experience in brokerage services and consultancy to ensure that our clients have the best possible outcomes when clearing their goods for consumption around the globe. For more information, contact us.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do */}
          <section className="of-what-we-do-section">
            <div className="of-what-header">
              <h2>What We do</h2>
              <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
            </div>

            <div className="of-pillars-grid">
              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Truck size={32} strokeWidth={1.8} /></div>
                <h3>Fast Delivery</h3>
                <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Search size={32} strokeWidth={1.8} /></div>
                <h3>Global Reach</h3>
                <p>Our Air Freight service connects you to a vast network of destinations worldwide</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><ClipboardCheck size={32} strokeWidth={1.8} /></div>
                <h3>Secure Handling</h3>
                <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Megaphone size={32} strokeWidth={1.8} /></div>
                <h3>Tailored Solutions</h3>
                <p>We provide customized air freight solutions to meet your specific needs.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function CustomsBrokeragePage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="customs-brokerage-page">
      {/* Top Floating Transparent Header directly over Hero Banner */}
      <header className="of-header">
        <div className="of-header-inner">
          <Logo href="/" onClick={e => onNavigate(e, '/')} />

          <nav className="of-nav" aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>

            <div
              className="of-services-pill"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="of-services-pill-btn"
                onClick={() => setServicesOpen(open => !open)}
                aria-expanded={servicesOpen}
              >
                Services <ChevronDown size={14} />
              </button>
              {servicesOpen && (
                <div className="of-services-dropdown" role="menu">
                  <div className="of-dropdown-sector">Freight Forwarding Services</div>
                  {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Customs Brokerage' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                  <div className="of-dropdown-sector">Customer Solution</div>
                  {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Customs Brokerage' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>

          <div className="of-header-actions">
            <button
              className="of-login-btn"
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="of-mobile-toggle"
              type="button"
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="of-mobile-menu">
            <a href="/" onClick={e => { onNavigate(e, '/'); setMobileOpen(false); }}>Home</a>
            <a href="/about" onClick={e => { onNavigate(e, '/about'); setMobileOpen(false); }}>About Us</a>
            <a href="/#services" onClick={e => { onNavigate(e, '/#services'); setMobileOpen(false); }}>Services</a>
            <a href="/industries" onClick={e => { onNavigate(e, '/industries'); setMobileOpen(false); }}>Industries</a>
            <a href="/contact" onClick={e => { onNavigate(e, '/contact'); setMobileOpen(false); }}>Contact Us</a>
            <button className="of-mobile-login" type="button" onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }}>
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Top Hero Banner */}
        <section className="of-hero-banner" aria-label="Customs Brokerage Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and container transit port at dusk"
            className="of-hero-img"
          />
          <div className="of-hero-overlay" />
        </section>

        {/* Content Container holding Title, Intro Grid, and What We Do */}
        <div className="of-content-container">
          {/* Intro Section: Customs Brokerage + Two Columns with photo and text */}
          <section className="of-intro-section">
            <div className="of-intro-header">
              <h1>Customs Brokerage</h1>
            </div>

            <div className="of-intro-grid">
              {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
              <div className="of-photo-frame">
                <div className="of-photo-backdrop" />
                <div className="of-photo-container">
                  <img
                    src="/customs-brokerage.jpg"
                    alt="Customs brokerage specialist pointing at global route map"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="of-intro-copy">
                <p>
                  LARA SHIPPING brokerage services provide clients with expertise around the globe. LARA SHIPPING brokers are professionals with experience in brokerage services and consultancy to ensure that our clients have the best possible outcomes when clearing their goods for consumption around the globe. For more information, contact us.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do */}
          <section className="of-what-we-do-section">
            <div className="of-what-header">
              <h2>What We do</h2>
              <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
            </div>

            <div className="of-pillars-grid">
              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Truck size={32} strokeWidth={1.8} /></div>
                <h3>Fast Delivery</h3>
                <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Search size={32} strokeWidth={1.8} /></div>
                <h3>Global Reach</h3>
                <p>Our Air Freight service connects you to a vast network of destinations worldwide</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><ClipboardCheck size={32} strokeWidth={1.8} /></div>
                <h3>Secure Handling</h3>
                <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Megaphone size={32} strokeWidth={1.8} /></div>
                <h3>Tailored Solutions</h3>
                <p>We provide customized air freight solutions to meet your specific needs.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function GreenSolutionPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="green-solution-page">
      {/* Top Floating Transparent Header directly over Hero Banner */}
      <header className="of-header">
        <div className="of-header-inner">
          <Logo href="/" onClick={e => onNavigate(e, '/')} />

          <nav className="of-nav" aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>

            <div
              className="of-services-pill"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="of-services-pill-btn"
                onClick={() => setServicesOpen(open => !open)}
                aria-expanded={servicesOpen}
              >
                Services <ChevronDown size={14} />
              </button>
              {servicesOpen && (
                <div className="of-services-dropdown" role="menu">
                  <div className="of-dropdown-sector">Freight Forwarding Services</div>
                  {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Green Solution' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                  <div className="of-dropdown-sector">Customer Solution</div>
                  {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Green Solution' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>

          <div className="of-header-actions">
            <button
              className="of-login-btn"
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="of-mobile-toggle"
              type="button"
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="of-mobile-menu">
            <a href="/" onClick={e => { onNavigate(e, '/'); setMobileOpen(false); }}>Home</a>
            <a href="/about" onClick={e => { onNavigate(e, '/about'); setMobileOpen(false); }}>About Us</a>
            <a href="/#services" onClick={e => { onNavigate(e, '/#services'); setMobileOpen(false); }}>Services</a>
            <a href="/industries" onClick={e => { onNavigate(e, '/industries'); setMobileOpen(false); }}>Industries</a>
            <a href="/contact" onClick={e => { onNavigate(e, '/contact'); setMobileOpen(false); }}>Contact Us</a>
            <button className="of-mobile-login" type="button" onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }}>
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Top Hero Banner */}
        <section className="of-hero-banner" aria-label="Green Solution Hero">
          <img
            src="/air-freight-hero.jpg"
            alt="Global logistics terminal and container transit port at dusk"
            className="of-hero-img"
          />
          <div className="of-hero-overlay" />
        </section>

        {/* Content Container holding Title, Intro Grid, and What We Do */}
        <div className="of-content-container">
          {/* Intro Section: Green Solution + Two Columns with photo and text */}
          <section className="of-intro-section">
            <div className="of-intro-header">
              <h1>Green Solution</h1>
            </div>

            <div className="of-intro-grid">
              {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
              <div className="of-photo-frame">
                <div className="of-photo-backdrop" />
                <div className="of-photo-container">
                  <img
                    src="/green-solution.jpg"
                    alt="Eco-friendly concept with lightbulb plant and sustainability blocks"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="of-intro-copy">
                <p>
                  We strive to make sustainable choices easily available to our customers, and Green Solutions is our way of identifying and proposing the most sustainable method of transportation for you. Our team members are trained to help you select the most environmentally friendly shipping option while having constrains such as time and market availability in mind.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do */}
          <section className="of-what-we-do-section">
            <div className="of-what-header">
              <h2>What We do</h2>
              <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
            </div>

            <div className="of-pillars-grid">
              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Truck size={32} strokeWidth={1.8} /></div>
                <h3>Fast Delivery</h3>
                <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Search size={32} strokeWidth={1.8} /></div>
                <h3>Global Reach</h3>
                <p>Our Air Freight service connects you to a vast network of destinations worldwide</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><ClipboardCheck size={32} strokeWidth={1.8} /></div>
                <h3>Secure Handling</h3>
                <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Megaphone size={32} strokeWidth={1.8} /></div>
                <h3>Tailored Solutions</h3>
                <p>We provide customized air freight solutions to meet your specific needs.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function TechnologyCustomerSolutionPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="technology-customer-solution-page">
      {/* Top Floating Transparent Header directly over Hero Banner */}
      <header className="of-header">
        <div className="of-header-inner">
          <Logo href="/" onClick={e => onNavigate(e, '/')} />

          <nav className="of-nav" aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>

            <div
              className="of-services-pill"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="of-services-pill-btn"
                onClick={() => setServicesOpen(open => !open)}
                aria-expanded={servicesOpen}
              >
                Services <ChevronDown size={14} />
              </button>
              {servicesOpen && (
                <div className="of-services-dropdown" role="menu">
                  <div className="of-dropdown-sector">Freight Forwarding Services</div>
                  {services.filter(s => s.sector === 'Freight Forwarding Services').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Technology & Customer Services' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                  <div className="of-dropdown-sector">Customer Solution</div>
                  {services.filter(s => s.sector === 'Customer Solution').map(({ name }) => (
                    <a
                      key={name}
                      href={getServicePath(name)}
                      className={name === 'Technology & Customer Services' ? 'active' : ''}
                      onClick={e => { onNavigate(e, getServicePath(name)); setServicesOpen(false); }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
          </nav>

          <div className="of-header-actions">
            <button
              className="of-login-btn"
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="of-mobile-toggle"
              type="button"
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="of-mobile-menu">
            <a href="/" onClick={e => { onNavigate(e, '/'); setMobileOpen(false); }}>Home</a>
            <a href="/about" onClick={e => { onNavigate(e, '/about'); setMobileOpen(false); }}>About Us</a>
            <a href="/#services" onClick={e => { onNavigate(e, '/#services'); setMobileOpen(false); }}>Services</a>
            <a href="/industries" onClick={e => { onNavigate(e, '/industries'); setMobileOpen(false); }}>Industries</a>
            <a href="/contact" onClick={e => { onNavigate(e, '/contact'); setMobileOpen(false); }}>Contact Us</a>
            <button className="of-mobile-login" type="button" onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }}>
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Top Hero Banner */}
        <section className="of-hero-banner" aria-label="Technology & Customer Solution Hero">
          <img
            src="/airplane-sunset-hero.jpg"
            alt="Airplane landing in sunset sky with clouds"
            className="of-hero-img"
          />
          <div className="of-hero-overlay" />
        </section>

        {/* Content Container holding Title, Intro Grid, and What We Do */}
        <div className="of-content-container">
          {/* Intro Section: Technology & Custommer Solution + Two Columns with photo and text */}
          <section className="of-intro-section">
            <div className="of-intro-header">
              <h1>Technology &amp;<br />Custommer Solution</h1>
            </div>

            <div className="of-intro-grid">
              {/* Left: Photo Frame with Blue Offset Backdrop and White Border */}
              <div className="of-photo-frame">
                <div className="of-photo-backdrop" />
                <div className="of-photo-container">
                  <img
                    src="/technology-customer-solution.jpg"
                    alt="Laptop screen displaying logistics technology and security icons"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="of-intro-copy">
                <p>
                  LARA SHIPPING offers airfreight services through its global network of offices. By partnering with leading carriers, LARA SHIPPING ensures that customer's cargo needs are met through a variety of solutions including fixed schedules on our daily flights, consolidation services in our own facilities and the creation of specialized solutions based on customer's unique requirements. Throughout the entire process, global compliance and security requirements are met at all times.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do */}
          <section className="of-what-we-do-section">
            <div className="of-what-header">
              <h2>What We do</h2>
              <p>Your one-stop shop for global shipping. We handle everything from complex logistics to seamless delivery</p>
            </div>

            <div className="of-pillars-grid">
              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Truck size={32} strokeWidth={1.8} /></div>
                <h3>Fast Delivery</h3>
                <p>We offer swift transportation of goods via air, ensuring your cargo reaches its destination promptly.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Search size={32} strokeWidth={1.8} /></div>
                <h3>Global Reach</h3>
                <p>Our Air Freight service connects you to a vast network of destinations worldwide</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><ClipboardCheck size={32} strokeWidth={1.8} /></div>
                <h3>Secure Handling</h3>
                <p>Your cargo is handled with utmost care and attention to ensure it arrives safely.</p>
              </div>

              <div className="of-pillar-item">
                <div className="of-pillar-icon"><Megaphone size={32} strokeWidth={1.8} /></div>
                <h3>Tailored Solutions</h3>
                <p>We provide customized air freight solutions to meet your specific needs.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <Logo />
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Multi Modal', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>

      {/* Login Portal Modal */}
      {isLoginOpen && (
        <div className="login-modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal-card" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setIsLoginOpen(false)} aria-label="Close dialog">
              <X size={18} />
            </button>
            <div className="login-modal-header">
              <Logo />
              <h3>Client Portal Login</h3>
              <p>Sign in to track your shipments, download Bills of Lading, and manage bookings.</p>
            </div>
            <form className="login-modal-form" onSubmit={e => { e.preventDefault(); alert('Customer portal login'); setIsLoginOpen(false); }}>
              <label>
                <span>Email Address or Client ID</span>
                <input type="text" placeholder="name@company.com" required autoFocus />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="••••••••" required />
              </label>
              <button type="submit" className="login-modal-btn">Sign In to Dashboard</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function IncoTermsPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const incoterms = [
    { term: 'EXW', loadingTruck: 'Buyer', exportCustoms: 'Buyer', cartagePOE: 'Buyer', unloadingPOE: 'Buyer', loadingChargesPOE: 'Buyer', oceanFreight: 'Buyer', cartagePOI: 'Buyer', unloadingPOI: 'Buyer', loadingTruckPOI: 'Buyer', cartageDest: 'Buyer', insurance: 'Buyer', importCustoms: 'Buyer', importTaxes: 'Buyer' },
    { term: 'FCA', loadingTruck: 'Seller', exportCustoms: 'Seller', cartagePOE: 'Buyer', unloadingPOE: 'Buyer', loadingChargesPOE: 'Buyer', oceanFreight: 'Buyer', cartagePOI: 'Buyer', unloadingPOI: 'Buyer', loadingTruckPOI: 'Buyer', cartageDest: 'Buyer', insurance: 'Buyer', importCustoms: 'Buyer', importTaxes: 'Buyer' },
    { term: 'FAS', loadingTruck: 'Seller', exportCustoms: 'Seller', cartagePOE: 'Seller', unloadingPOE: 'Seller', loadingChargesPOE: 'Buyer', oceanFreight: 'Buyer', cartagePOI: 'Buyer', unloadingPOI: 'Buyer', loadingTruckPOI: 'Buyer', cartageDest: 'Buyer', insurance: 'Buyer', importCustoms: 'Buyer', importTaxes: 'Buyer' },
    { term: 'FOB', loadingTruck: 'Seller', exportCustoms: 'Seller', cartagePOE: 'Seller', unloadingPOE: 'Seller', loadingChargesPOE: 'Seller', oceanFreight: 'Buyer', cartagePOI: 'Buyer', unloadingPOI: 'Buyer', loadingTruckPOI: 'Buyer', cartageDest: 'Buyer', insurance: 'Buyer', importCustoms: 'Buyer', importTaxes: 'Buyer' },
    { term: 'CPT', loadingTruck: 'Seller', exportCustoms: 'Seller', cartagePOE: 'Seller', unloadingPOE: 'Seller', loadingChargesPOE: 'Seller', oceanFreight: 'Seller', cartagePOI: 'Seller', unloadingPOI: 'Buyer', loadingTruckPOI: 'Buyer', cartageDest: 'Buyer', insurance: 'Buyer', importCustoms: 'Buyer', importTaxes: 'Buyer' },
    { term: 'CIF', loadingTruck: 'Seller', exportCustoms: 'Seller', cartagePOE: 'Seller', unloadingPOE: 'Seller', loadingChargesPOE: 'Seller', oceanFreight: 'Seller', cartagePOI: 'Buyer', unloadingPOI: 'Buyer', loadingTruckPOI: 'Buyer', cartageDest: 'Buyer', insurance: 'Seller', importCustoms: 'Buyer', importTaxes: 'Buyer' },
    { term: 'DAT', loadingTruck: 'Seller', exportCustoms: 'Seller', cartagePOE: 'Seller', unloadingPOE: 'Seller', loadingChargesPOE: 'Seller', oceanFreight: 'Seller', cartagePOI: 'Seller', unloadingPOI: 'Seller', loadingTruckPOI: 'Buyer', cartageDest: 'Buyer', insurance: 'Buyer', importCustoms: 'Buyer', importTaxes: 'Buyer' },
    { term: 'DPT', loadingTruck: 'Seller', exportCustoms: 'Seller', cartagePOE: 'Seller', unloadingPOE: 'Seller', loadingChargesPOE: 'Seller', oceanFreight: 'Seller', cartagePOI: 'Seller', unloadingPOI: 'Seller', loadingTruckPOI: 'Seller', cartageDest: 'Buyer', insurance: 'Seller', importCustoms: 'Buyer', importTaxes: 'Buyer' },
    { term: 'DAP', loadingTruck: 'Seller', exportCustoms: 'Seller', cartagePOE: 'Seller', unloadingPOE: 'Seller', loadingChargesPOE: 'Seller', oceanFreight: 'Seller', cartagePOI: 'Seller', unloadingPOI: 'Seller', loadingTruckPOI: 'Seller', cartageDest: 'Seller', insurance: 'Seller', importCustoms: 'Buyer', importTaxes: 'Buyer' },
    { term: 'CIP', loadingTruck: 'Seller', exportCustoms: 'Seller', cartagePOE: 'Seller', unloadingPOE: 'Seller', loadingChargesPOE: 'Seller', oceanFreight: 'Seller', cartagePOI: 'Seller', unloadingPOI: 'Seller', loadingTruckPOI: 'Seller', cartageDest: 'Seller', insurance: 'Seller', importCustoms: 'Buyer', importTaxes: 'Buyer' },
    { term: 'DDP', loadingTruck: 'Seller', exportCustoms: 'Seller', cartagePOE: 'Seller', unloadingPOE: 'Seller', loadingChargesPOE: 'Seller', oceanFreight: 'Seller', cartagePOI: 'Seller', unloadingPOI: 'Seller', loadingTruckPOI: 'Seller', cartageDest: 'Seller', insurance: 'Seller', importCustoms: 'Seller', importTaxes: 'Seller' },
  ]

  const columns = [
    { key: 'term', label: 'Incoterms 2023' },
    { key: 'loadingTruck', label: 'Loading on truck (carrier)' },
    { key: 'exportCustoms', label: 'Export Customs declaration' },
    { key: 'cartagePOE', label: 'Carriage to port of export' },
    { key: 'unloadingPOE', label: 'Unloading of truck in port of export' },
    { key: 'loadingChargesPOE', label: 'Loading charges in port of export' },
    { key: 'oceanFreight', label: 'Ocean Freight' },
    { key: 'cartagePOI', label: 'Carriage to port of Import' },
    { key: 'unloadingPOI', label: 'Unloading charges in port of Import' },
    { key: 'loadingTruckPOI', label: 'Loading on truck in port of Import' },
    { key: 'cartageDest', label: 'Carriage to place of destination' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'importCustoms', label: 'Import Customs Clearance' },
    { key: 'importTaxes', label: 'Import Taxes' },
  ]

  return (
    <div className="inco-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15}/></a>
        </div>
      </header>

      <main>
        {/* Masthead — same stripe pattern as other service pages */}
        <section className="inco-masthead">
          <div className="inco-masthead-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Inco Terms,<br /><em>made clear.</em></h1>
            <p>Incoterms® 2023 rules define the responsibilities of buyers and sellers for the delivery of goods under sales contracts.</p>
          </div>
        </section>

        {/* Legend + table section */}
        <section className="inco-table-section section-shell">
          <div className="inco-table-header">
            <div>
              <span className="eyebrow light"><span /> Responsibility matrix</span>
              <h2>Incoterms 2023</h2>
              <p>Each cell shows who bears the cost and risk at each stage of the journey.</p>
            </div>
            <div className="inco-legend">
              <span className="inco-legend-buyer">Buyer</span>
              <span className="inco-legend-seller">Seller</span>
            </div>
          </div>

          <div className="inco-table-wrap">
            <table className="inco-table" aria-label="Incoterms 2023 responsibility matrix">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incoterms.map(row => (
                  <tr key={row.term}>
                    {columns.map(col => {
                      const val = row[col.key as keyof typeof row]
                      if (col.key === 'term') return <td key={col.key} className="inco-term-label">{val}</td>
                      return (
                        <td key={col.key} className={val === 'Buyer' ? 'inco-buyer' : 'inco-seller'}>
                          {val}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
      </div>
      <div className="footer-bottom section-shell">
        <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
      </div>
    </footer>
    </div>
  )
}

const containerTypes = [
  {
    name: "20' Standard",
    imgBg: '#2563a8',
    rows: [
      { label: 'Inside Length', ext: "19'4\"", int: '5,898m' },
      { label: 'Inside Width', ext: "7'8\"", int: '2,352m' },
      { label: 'Inside Height', ext: "7'10\"", int: '2,385m' },
      { label: 'Door Width', ext: "7'8\"", int: '2,340m' },
      { label: 'Door Height', ext: "7'5\"", int: '2,274m' },
      { label: 'Capacity', ext: '', int: '33.2 CBM' },
      { label: 'Tare Weight', ext: '', int: '2,200 kgs' },
      { label: 'Max Cargo', ext: '', int: '28,280 kgs' },
    ]
  },
  {
    name: "40' Standard",
    imgBg: '#2563a8',
    rows: [
      { label: 'Inside Length', ext: "39'5\"", int: '12,032m' },
      { label: 'Inside Width', ext: "7'8\"", int: '2,352m' },
      { label: 'Inside Height', ext: "7'10\"", int: '2,385m' },
      { label: 'Door Width', ext: "7'8\"", int: '2,340m' },
      { label: 'Door Height', ext: "7'5\"", int: '2,274m' },
      { label: 'Capacity', ext: '', int: '67.7 CBM' },
      { label: 'Tare Weight', ext: '', int: '3,750 kgs' },
      { label: 'Max Cargo', ext: '', int: '26,730 kgs' },
    ]
  },
  {
    name: "40' High Cube",
    imgBg: '#1e4d8c',
    rows: [
      { label: 'Inside Length', ext: "39'5\"", int: '12,032m' },
      { label: 'Inside Width', ext: "7'8\"", int: '2,352m' },
      { label: 'Inside Height', ext: "8'10\"", int: '2,698m' },
      { label: 'Door Width', ext: "7'8\"", int: '2,340m' },
      { label: 'Door Height', ext: "8'5\"", int: '2,585m' },
      { label: 'Capacity', ext: '', int: '76.3 CBM' },
      { label: 'Tare Weight', ext: '', int: '3,900 kgs' },
      { label: 'Max Cargo', ext: '', int: '26,580 kgs' },
    ]
  },
  {
    name: "20' Open Top",
    imgBg: '#3a6ea8',
    rows: [
      { label: 'Inside Length', ext: "19'4\"", int: '5,898m' },
      { label: 'Inside Width', ext: "7'8\"", int: '2,352m' },
      { label: 'Inside Height', ext: "7'5\"", int: '2,350m' },
      { label: 'Door Width', ext: "7'8\"", int: '2,340m' },
      { label: 'Door Height', ext: "6'11\"", int: '2,090m' },
      { label: 'Capacity', ext: '', int: '32.7 CBM' },
      { label: 'Tare Weight', ext: '', int: '2,350 kgs' },
      { label: 'Max Cargo', ext: '', int: '28,130 kgs' },
    ]
  },
  {
    name: "40' Open Top",
    imgBg: '#3a6ea8',
    rows: [
      { label: 'Inside Length', ext: "39'5\"", int: '12,032m' },
      { label: 'Inside Width', ext: "7'8\"", int: '2,352m' },
      { label: 'Inside Height', ext: "7'5\"", int: '2,350m' },
      { label: 'Door Width', ext: "7'8\"", int: '2,340m' },
      { label: 'Door Height', ext: "6'11\"", int: '2,090m' },
      { label: 'Capacity', ext: '', int: '66.4 CBM' },
      { label: 'Tare Weight', ext: '', int: '4,100 kgs' },
      { label: 'Max Cargo', ext: '', int: '40,900 kgs' },
    ]
  },
  {
    name: "Flat Rack 20'",
    imgBg: '#4a7c9e',
    rows: [
      { label: 'Inside Length', ext: "18'5\"", int: '5,620m' },
      { label: 'Inside Width', ext: "8'0\"", int: '2,438m' },
      { label: 'Inside Height', ext: '—', int: '—' },
      { label: 'Door Width', ext: '—', int: '—' },
      { label: 'Door Height', ext: '—', int: '—' },
      { label: 'Capacity', ext: '', int: '—' },
      { label: 'Tare Weight', ext: '', int: '2,700 kgs' },
      { label: 'Max Cargo', ext: '', int: '45,000 kgs' },
    ]
  },
  {
    name: "Flat Rack 40'",
    imgBg: '#4a7c9e',
    rows: [
      { label: 'Inside Length', ext: "39'5\"", int: '12,000m' },
      { label: 'Inside Width', ext: "8'0\"", int: '2,438m' },
      { label: 'Inside Height', ext: '—', int: '—' },
      { label: 'Door Width', ext: '—', int: '—' },
      { label: 'Door Height', ext: '—', int: '—' },
      { label: 'Capacity', ext: '', int: '—' },
      { label: 'Tare Weight', ext: '', int: '5,000 kgs' },
      { label: 'Max Cargo', ext: '', int: '40,000 kgs' },
    ]
  },
  {
    name: "Tank Container 20'",
    imgBg: '#6b8fa8',
    rows: [
      { label: 'Inside Length', ext: '—', int: '6,058m' },
      { label: 'Inside Width', ext: '—', int: '2,438m' },
      { label: 'Inside Height', ext: '—', int: '2,591m' },
      { label: 'Door Width', ext: '—', int: '—' },
      { label: 'Door Height', ext: '—', int: '—' },
      { label: 'Capacity', ext: '', int: '21,000 L' },
      { label: 'Tare Weight', ext: '', int: '3,500 kgs' },
      { label: 'Max Cargo', ext: '', int: '26,000 kgs' },
    ]
  },
  {
    name: "Platform 20'",
    imgBg: '#5a7a8c',
    rows: [
      { label: 'Inside Length', ext: "19'5\"", int: '5,920m' },
      { label: 'Inside Width', ext: "8'0\"", int: '2,438m' },
      { label: 'Inside Height', ext: '—', int: '—' },
      { label: 'Door Width', ext: '—', int: '—' },
      { label: 'Door Height', ext: '—', int: '—' },
      { label: 'Capacity', ext: '', int: '—' },
      { label: 'Tare Weight', ext: '', int: '2,700 kgs' },
      { label: 'Max Cargo', ext: '', int: '30,480 kgs' },
    ]
  },
  {
    name: "Platform 40'",
    imgBg: '#5a7a8c',
    rows: [
      { label: 'Inside Length', ext: "39'5\"", int: '12,000m' },
      { label: 'Inside Width', ext: "8'0\"", int: '2,438m' },
      { label: 'Inside Height', ext: '—', int: '—' },
      { label: 'Door Width', ext: '—', int: '—' },
      { label: 'Door Height', ext: '—', int: '—' },
      { label: 'Capacity', ext: '', int: '—' },
      { label: 'Tare Weight', ext: '', int: '5,200 kgs' },
      { label: 'Max Cargo', ext: '', int: '40,000 kgs' },
    ]
  },
]

const flatRackExtendable = [
  { name: "Flat Rack Extended 20'", length: 'Overall Length: 6,058m', maxCargo: '45,000 kgs', tare: '2,700 kgs' },
  { name: "Flat Rack Extended 40'", length: 'Overall Length: 12,192m', maxCargo: '40,000 kgs', tare: '5,000 kgs' },
  { name: "Flat Rack Collapsible 20'", length: 'Overall Length: 6,058m', maxCargo: '45,000 kgs', tare: '2,800 kgs' },
  { name: "Flat Rack Collapsible 40'", length: 'Overall Length: 12,192m', maxCargo: '40,000 kgs', tare: '5,100 kgs' },
]

function ContainerSpecPage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const specCols = ['Inside Length', 'Inside Width', 'Inside Height', 'Door Width', 'Door Height', 'Capacity', 'Tare Weight', 'Max Cargo']

  return (
    <div className="cspec-page">
      <header className="about-header">
        <div className="about-header-inner">
          <Logo href="/" />
          <nav aria-label="Primary navigation">
            <a href="/" onClick={event => onNavigate(event, '/')}>Home</a>
            <a href="/#services" onClick={event => onNavigate(event, '/#services')}>Services</a>
            <a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a>
            <a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a>
            <a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a>
          </nav>
          <a className="industries-quote" href="/#quote">Get a Quote <ArrowUpRight size={15}/></a>
        </div>
      </header>

      <main>
        {/* Masthead */}
        <section className="cspec-masthead">
          <div className="cspec-masthead-card">
            <span className="eyebrow light"><span /> LARA SHIPPING LINE</span>
            <h1>Container Specification,<br /><em>every detail.</em></h1>
            <p>Technical dimensions, capacities, and weight limits for all standard ISO shipping containers.</p>
          </div>
        </section>

        {/* Main spec table */}
        <section className="cspec-table-section section-shell">
          <div className="cspec-table-header">
            <div>
              <span className="eyebrow light"><span /> Technical reference</span>
              <h2>Container Specification</h2>
              <p>All measurements shown in imperial and metric. Max Cargo = Gross Weight minus Tare Weight.</p>
            </div>
          </div>

          <div className="cspec-table-wrap">
            <table className="cspec-table" aria-label="Container specification table">
              <thead>
                <tr>
                  <th className="cspec-th-container">Container Type</th>
                  {specCols.map(col => <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {containerTypes.map(ct => (
                  <tr key={ct.name}>
                    <td className="cspec-name-cell">
                      <div className="cspec-img" style={{ background: ct.imgBg }} aria-hidden="true">
                        <div className="cspec-img-inner" />
                      </div>
                      <span>{ct.name}</span>
                    </td>
                    {ct.rows.map(r => (
                      <td key={r.label} className="cspec-data-cell">
                        <span className="cspec-ext">{r.ext || '—'}</span>
                        <span className="cspec-int">{r.int}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Flat Rack / Extendable secondary table */}
          <div className="cspec-ext-section">
            <h3>Flat Rack &amp; Collapsible — Extendable Dimensions</h3>
            <div className="cspec-ext-grid">
              {flatRackExtendable.map(fr => (
                <div className="cspec-ext-card" key={fr.name}>
                  <div className="cspec-ext-img" aria-hidden="true">
                    <div className="cspec-ext-img-inner" />
                  </div>
                  <div className="cspec-ext-info">
                    <strong>{fr.name}</strong>
                    <span>{fr.length}</span>
                    <div className="cspec-ext-vals">
                      <span>Tare: {fr.tare}</span>
                      <span>Max Cargo: {fr.maxCargo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>
          <FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']} />
          <FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight (FCL)', 'Ocean Freight (LCL)', 'Rail Freight', 'Road Freight']} />
          <FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']} />
      </div>
      <div className="footer-bottom section-shell">
        <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
      </div>
    </footer>
    </div>
  )
}

export default App

function GetQuotePage({ onNavigate }: { onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const submitQuote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return <div className="contact-page">
    <header className="about-header"><div className="about-header-inner"><Logo href="/" /><nav aria-label="Primary navigation"><a href="/" onClick={event => onNavigate(event, '/')}>Home</a><a href="/about" onClick={event => onNavigate(event, '/about')}>About Us</a><a href="/#services" onClick={event => onNavigate(event, '/#services')}>Services</a><a href="/industries" onClick={event => onNavigate(event, '/industries')}>Industries</a><a href="/contact" onClick={event => onNavigate(event, '/contact')}>Contact Us</a></nav><a className="industries-quote" href="/quote" onClick={e => onNavigate(e, '/quote')}>Get a Quote <ArrowUpRight size={15}/></a></div></header>
    <main className="contact-main section-shell">
      <section className="contact-details">
        <span className="eyebrow light"><span /> Get a Quote</span>
        <h1>Request a <em>Quote.</em></h1>
        <p className="contact-company">Lara Shipping Line</p>
        <p style={{color:'#b3c7cf', maxWidth:'400px', lineHeight:'1.7', marginTop:'30px'}}>Tell us about your requirements, select the services you need, and our dedicated team will work with you to provide an accurate and competitive quote.</p>
      </section>
      <section className="contact-form-wrap">
        <div className="contact-form-heading">
          <span className="eyebrow light"><span /> Shipment details</span>
          <h2>Submit Details</h2>
          <p>Provide your cargo and contact details below.</p>
          <div className="contact-response-note"><span><i /> Typically replies within one business day</span><span>Secure &amp; confidential</span></div>
        </div>
        <form className="contact-form" onSubmit={submitQuote}>
          {submitted ? <div className="contact-success" role="status"><Check size={22}/><div><strong>Request received</strong><p>Thank you. Our team will review your quote request and respond shortly.</p></div><button type="button" onClick={() => setSubmitted(false)}>Submit another</button></div> : <>
            <div className="contact-form-row">
              <label>Your Name<input name="name" autoComplete="name" placeholder="Your full name" required /></label>
              <label>Company Name<input name="company" placeholder="Company name" /></label>
            </div>
            <div className="contact-form-row">
              <label>Email Id <b>*</b><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label>
              <label>Contact No <b>*</b><input name="contact" type="tel" placeholder="Phone number" required /></label>
            </div>
            <div className="contact-form-row">
              <label>Select Service <b>*</b>
                <div style={{position:'relative'}}>
                  <select name="service" required defaultValue="" style={{width:'100%', height:'46px', padding:'0 16px', border:'1px solid #527586', background:'rgba(255,255,255,.96)', borderRadius:'2px', color:'#000', outline:'none', appearance:'none', fontSize:'13px', boxShadow:'inset 0 1px rgba(3,25,36,.08)'}}>
                    <option value="" disabled>Select Service</option>
                    <optgroup label="Freight Forwarding Services">
                      {services.filter(s => s.sector === 'Freight Forwarding Services').map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </optgroup>
                    <optgroup label="Customer Solution">
                      {services.filter(s => s.sector === 'Customer Solution').map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </optgroup>
                  </select>
                  <ChevronDown size={14} style={{position:'absolute', right:'16px', top:'16px', color:'#527586', pointerEvents:'none'}} />
                </div>
              </label>
              <label>Commodity <b>*</b><input name="commodity" placeholder="Cargo type" required /></label>
            </div>
            <div className="contact-form-row">
              <label>Origin <b>*</b><input name="origin" placeholder="City or Port" required /></label>
              <label>Destination <b>*</b><input name="destination" placeholder="City or Port" required /></label>
            </div>
            <label>Remarks<textarea name="remarks" rows={4} placeholder="Any specific requirements, weight, volume, or details..." style={{minHeight:'90px'}} /></label>
            <div className="contact-form-footer">
              <small>By submitting, you agree to be contacted by our logistics team.</small>
              <button className="contact-submit" type="submit">Get Quote <ArrowRight size={16}/></button>
            </div>
          </>}
        </form>
      </section>
    </main>
    <footer className="industries-footer"><div className="industries-footer-inner section-shell"><div className="industries-footer-brand"><Logo /><p>LARA SHIPPING LINE PVT LTD</p><span>Connect With Us</span><div><a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a><a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a><a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a><a href="#x" aria-label="X">𝕏</a></div></div><FooterColumn title="Useful Links" items={['Home', 'About Us', 'Services', 'Industries', 'Contact Us']}/><FooterColumn title="Services" items={['Air Freight', 'Cargo Insurance', 'Ocean Freight(FCL)', 'Multi Modal', 'Ocean Freight(LCL)', 'Rail Freight', 'Road Freight', 'Social, Weighting and Filling']}/><FooterColumn title="Customer Solutions" items={['Contract Logistics', 'Cross Border E-Commerce', 'Customs Brokerage', 'Green Solution', 'Technology & Customer Services']}/></div><div className="footer-bottom section-shell"><span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span></div></footer>
  </div>
}




