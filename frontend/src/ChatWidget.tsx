import React, { useState, useEffect, useRef, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react'
import {
  MessageSquare, MessageCircle, X, Send, Bot, Phone, ExternalLink,
  RotateCcw, Sparkles, Check, ChevronRight, PackageCheck, FileText, ArrowRight
} from 'lucide-react'

export interface ChatMessage {
  id: string
  sender: 'bot' | 'user'
  text: string
  time: string
  options?: {
    label: string
    action: string
    url?: string
    path?: string
  }[]
}

interface ChatWidgetProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void
}

const WHATSAPP_NUMBER = '918148114238'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello LARA Shipping Line, I would like to inquire about freight shipping and logistics services.')}`
const SUPPORT_PHONE = '+91 81481 14238'
const SUPPORT_EMAIL = 'sales@larashippingline.com'

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: '👋 Welcome to **LARA Shipping Line** support desk!\n\nHow can our logistics specialists assist your global freight needs today?',
    time: 'Just now',
    options: [
      { label: '📦 Track a Shipment', action: 'track' },
      { label: '📐 CBM Calculator', action: 'cbm' },
      { label: '💰 Request Freight Quote', action: 'quote' },
      { label: '🚢 Explore Shipping Services', action: 'services' },
      { label: '💬 Chat on WhatsApp', action: 'whatsapp', url: WHATSAPP_URL },
      { label: '📞 Direct Office Contacts', action: 'contact' },
    ]
  }
]

export default function ChatWidget({ isOpen, setIsOpen, onNavigate }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(1)
  const [showTeaser, setShowTeaser] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
      setShowTeaser(false)
      setTimeout(() => {
        scrollToBottom()
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isTyping])

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleAction = (action: string, label?: string, url?: string, path?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }

    if (path) {
      setIsOpen(false)
      const fakeEvent = { preventDefault: () => {} } as ReactMouseEvent<HTMLAnchorElement>
      onNavigate(fakeEvent, path)
      return
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: label || action,
      time: getCurrentTime(),
    }

    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      let botResponse: ChatMessage

      switch (action) {
        case 'track':
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: '🔍 **Shipment Visibility & Tracking**\n\nEnter your **Container No.** or **Bill of Lading / Booking No.** below to check live status.\n\n*Or try our demo tracking number: `LARA8492041`*',
            time: getCurrentTime(),
            options: [
              { label: '🚀 Test Demo ID: LARA8492041', action: 'track_demo' },
              { label: '🌐 Open Full Live Tracker', action: 'open_tracker', path: '/#tracking' },
            ]
          }
          break

        case 'track_demo':
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: '✅ **Tracking Result for #LARA8492041**\n\n• **Status:** In Transit (Sea Freight)\n• **Vessel:** LARA HORIZON (Voyage 408W)\n• **Origin:** Shanghai, CN (Departed 28 Aug)\n• **Destination:** Rotterdam, NL\n• **ETA:** 08 Sep 2026 (On schedule)\n• **Progress:** 68% completed\n\nNeed customs clearance or delivery documentation?',
            time: getCurrentTime(),
            options: [
              { label: '💰 Request a Freight Quote', action: 'quote' },
              { label: '💬 Talk to Dispatcher on WhatsApp', action: 'whatsapp', url: WHATSAPP_URL },
            ]
          }
          break

        case 'open_tracker':
          setIsOpen(false)
          setTimeout(() => {
            document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' })
          }, 150)
          return

        case 'cbm':
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: '📐 **LARA CBM & Cargo Volume Calculator**\n\nCalculate your exact CBM, CFT, volumetric weight (Air / Sea), and container load capacity (20ft, 40ft, 40ft HC) on our home page interactive tool.',
            time: getCurrentTime(),
            options: [
              { label: '🚀 Open CBM Calculator', action: 'open_cbm', path: '/cbm-calculator' },
              { label: '💰 Request a Freight Quote', action: 'quote' }
            ]
          }
          break

        case 'open_cbm':
          setIsOpen(false)
          if (path) {
            const e = { preventDefault: () => {} } as ReactMouseEvent<HTMLAnchorElement>
            onNavigate(e, path)
          }
          return

        case 'quote':
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: '💼 **Instant Freight Quote Consultation**\n\nWe provide competitive rates across Ocean (FCL/LCL), Air Freight, Rail, and Road routes.\n\nHow would you prefer to get your customized quote?',
            time: getCurrentTime(),
            options: [
              { label: '📝 Fill Out Quote Request Form', action: 'open_quote_form', path: '/quote' },
              { label: '🟢 Instant Rate on WhatsApp', action: 'whatsapp', url: WHATSAPP_URL },
              { label: '📞 Call Logistics Desk: +91 81481 14238', action: 'contact' },
            ]
          }
          break

        case 'open_quote_form':
          setIsOpen(false)
          const evt = { preventDefault: () => {} } as ReactMouseEvent<HTMLAnchorElement>
          onNavigate(evt, '/quote')
          return

        case 'services':
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: '🚢 **LARA Shipping Line Core Services:**\n\n1. **Ocean Freight (FCL/LCL)** — Dependable global container shipping\n2. **Air Freight** — Swift, temperature-controlled cargo\n3. **Customs Brokerage** — Smooth import/export clearances\n4. **Rail & Road Logistics** — First & last mile inland transport\n5. **Contract Logistics & Warehousing**\n\nSelect a service to view full details:',
            time: getCurrentTime(),
            options: [
              { label: '⚓ Ocean Freight (FCL)', action: 'nav_service', path: '/ocean-freight-fcl' },
              { label: '📦 Ocean Freight (LCL)', action: 'nav_service', path: '/ocean-freight-lcl' },
              { label: '✈️ Air Freight', action: 'nav_service', path: '/air-freight' },
              { label: '📑 Customs Brokerage', action: 'nav_service', path: '/customs-brokerage' },
              { label: '📐 Container Specifications', action: 'nav_service', path: '/container-spec' },
            ]
          }
          break

        case 'nav_service':
          setIsOpen(false)
          if (path) {
            const e = { preventDefault: () => {} } as ReactMouseEvent<HTMLAnchorElement>
            onNavigate(e, path)
          }
          return

        case 'contact':
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: '📍 **LARA Shipping Global Contacts:**\n\n• **Head Office (Coimbatore, India):**\n  Vivaan Arcade, Sowripalayam Post\n  📞 +91 81481 14238 / +91 81481 14279\n\n• **Mumbai Branch Office:**\n  Haware Fantasia Business Park, Vashi\n  📞 +91 22 45773828\n\n• **Dubai Branch Office (UAE):**\n  Hamsa A Wing, Al Karama, Dubai\n  📞 +971 56 542 0228\n\n✉️ **Email:** sales@larashippingline.com',
            time: getCurrentTime(),
            options: [
              { label: '🟢 Chat on WhatsApp', action: 'whatsapp', url: WHATSAPP_URL },
              { label: '🗺️ View Contact Page & Map', action: 'open_contact_page', path: '/contact' },
            ]
          }
          break

        case 'open_contact_page':
          setIsOpen(false)
          const fakeE = { preventDefault: () => {} } as ReactMouseEvent<HTMLAnchorElement>
          onNavigate(fakeE, '/contact')
          return

        default:
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: 'Thank you for your message! Our team is ready to assist. You can submit an inquiry, track a shipment, or reach our live representative immediately via WhatsApp.',
            time: getCurrentTime(),
            options: [
              { label: '🟢 Connect on WhatsApp', action: 'whatsapp', url: WHATSAPP_URL },
              { label: '📝 Request a Quote', action: 'quote' },
              { label: '📦 Track Shipment', action: 'track' }
            ]
          }
          break
      }

      setIsTyping(false)
      setMessages(prev => [...prev, botResponse])
    }, 450)
  }

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    const text = inputValue.trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: getCurrentTime(),
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    const lower = text.toLowerCase()

    setTimeout(() => {
      let botResponse: ChatMessage

      if (lower.includes('track') || lower.includes('container') || lower.includes('status') || lower.includes('where')) {
        const potentialId = text.match(/[A-Za-z0-9]{6,12}/)?.[0]
        if (potentialId) {
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `🔎 **Searching LARA Logistics Network for #${potentialId.toUpperCase()}**...\n\n• **Status:** In Transit • Carrier: LARA Shipping Line\n• **Departure:** Origin Hub (Port cleared)\n• **Estimated Arrival:** On Schedule\n• **Customs Clearance:** Pre-lodged\n\nWould you like our support team to verify the real-time manifest on WhatsApp?`,
            time: getCurrentTime(),
            options: [
              { label: '💬 Verify on WhatsApp', action: 'whatsapp', url: WHATSAPP_URL },
              { label: '🌐 Open Full Live Tracker', action: 'open_tracker', path: '/#tracking' }
            ]
          }
        } else {
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: 'Please enter your **Container Number** or **Booking ID** (e.g. `LARA8492041`), or jump straight to our live interactive tracking dashboard:',
            time: getCurrentTime(),
            options: [
              { label: '🚀 Test Demo ID: LARA8492041', action: 'track_demo' },
              { label: '🌐 Go to Live Tracker', action: 'open_tracker', path: '/#tracking' }
            ]
          }
        }
      } else if (lower.includes('cbm') || lower.includes('volume') || lower.includes('dimension') || lower.includes('cubic') || lower.includes('calculator')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: '📐 **Interactive CBM (Cubic Meter) Calculator**\n\nCalculate volume (m³, ft³), air freight volumetric weight (1:6000), sea LCL billing weight, and see exact container capacity utilization (20\', 40\', 40\' HC) with our interactive calculator!',
          time: getCurrentTime(),
          options: [
            { label: '🚀 Open CBM Calculator', action: 'open_cbm', path: '/cbm-calculator' },
            { label: '📝 Request a Quote', action: 'open_quote_form', path: '/quote' }
          ]
        }
      } else if (lower.includes('quote') || lower.includes('rate') || lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('freight')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: '💼 **Freight Quotations & Pricing**\n\nWe provide tailored, competitive rates for sea freight (FCL/LCL), air cargo, and multimodal forwarding. Fill our quick quote form or chat directly with our pricing desk:',
          time: getCurrentTime(),
          options: [
            { label: '📝 Request a Quote Form', action: 'open_quote_form', path: '/quote' },
            { label: '🟢 Instant Quote on WhatsApp', action: 'whatsapp', url: WHATSAPP_URL }
          ]
        }
      } else if (lower.includes('phone') || lower.includes('call') || lower.includes('email') || lower.includes('contact') || lower.includes('address') || lower.includes('office') || lower.includes('dubai') || lower.includes('mumbai')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📞 **Contact LARA Shipping Line:**\n\n• **Head Office:** ${SUPPORT_PHONE}\n• **Dubai Office:** +971 56 542 0228\n• **Email:** ${SUPPORT_EMAIL}\n• **Hours:** 24/7 Logistics Support`,
          time: getCurrentTime(),
          options: [
            { label: '🟢 Chat on WhatsApp', action: 'whatsapp', url: WHATSAPP_URL },
            { label: '🗺️ View Contact Page', action: 'open_contact_page', path: '/contact' }
          ]
        }
      } else if (lower.includes('service') || lower.includes('air') || lower.includes('ocean') || lower.includes('ship') || lower.includes('fcl') || lower.includes('lcl') || lower.includes('customs')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: '🚢 We offer comprehensive worldwide logistics:\n• Ocean Freight (FCL & LCL)\n• Air Freight (Express & General)\n• Rail & Road Transport\n• Customs Clearance & Cargo Insurance\n\nWhich service can we assist you with?',
          time: getCurrentTime(),
          options: [
            { label: '⚓ Ocean Freight (FCL)', action: 'nav_service', path: '/ocean-freight-fcl' },
            { label: '✈️ Air Freight', action: 'nav_service', path: '/air-freight' },
            { label: '📑 Customs Brokerage', action: 'nav_service', path: '/customs-brokerage' }
          ]
        }
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('good morning') || lower.includes('good afternoon')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Hello! Great to connect with you. How can LARA Shipping Line assist with your shipment or cargo booking today?',
          time: getCurrentTime(),
          options: [
            { label: '📦 Track a Shipment', action: 'track' },
            { label: '💰 Request Freight Quote', action: 'quote' },
            { label: '💬 Chat on WhatsApp', action: 'whatsapp', url: WHATSAPP_URL }
          ]
        }
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Thank you for your message! Our logistics experts are available to provide immediate support.\n\nWould you like to connect directly on WhatsApp or submit a formal quote request?`,
          time: getCurrentTime(),
          options: [
            { label: '🟢 Chat with Agent on WhatsApp', action: 'whatsapp', url: WHATSAPP_URL },
            { label: '📝 Request a Quote', action: 'open_quote_form', path: '/quote' },
            { label: '📞 Call: ' + SUPPORT_PHONE, action: 'contact' }
          ]
        }
      }

      setIsTyping(false)
      setMessages(prev => [...prev, botResponse])
    }, 450)
  }

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES)
    setIsTyping(false)
  }

  return (
    <>
      {/* Floating Chat Launcher Button & Teaser Bubble */}
      <div className="lara-chat-launcher-wrap">
        {!isOpen && showTeaser && (
          <div className="lara-chat-teaser" onClick={() => setIsOpen(true)}>
            <div className="lara-chat-teaser-dot" />
            <div className="lara-chat-teaser-text">
              <span>Have questions?</span>
              <strong>Chat with us</strong>
            </div>
            <button
              type="button"
              className="lara-chat-teaser-close"
              aria-label="Close teaser"
              onClick={(e) => {
                e.stopPropagation()
                setShowTeaser(false)
              }}
            >
              <X size={12} />
            </button>
          </div>
        )}

        <button
          type="button"
          className={`lara-chat-trigger-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close chat' : 'Open live chat with LARA Shipping'}
          title="Chat with Us"
        >
          {isOpen ? (
            <X size={24} className="lara-chat-icon-rotate" />
          ) : (
            <>
              <MessageCircle size={26} strokeWidth={2.2} />
              {unreadCount > 0 && <span className="lara-chat-badge">{unreadCount}</span>}
              <span className="lara-chat-ping" />
            </>
          )}
        </button>
      </div>

      {/* Live Chat Modal Dialog */}
      {isOpen && (
        <div className="lara-chat-window" role="dialog" aria-modal="true" aria-label="LARA Shipping Support Chat">
          {/* Header */}
          <div className="lara-chat-header">
            <div className="lara-chat-header-info">
              <div className="lara-chat-avatar">
                <Bot size={20} />
                <span className="lara-chat-online-dot" />
              </div>
              <div>
                <div className="lara-chat-title">
                  <strong>LARA Support Desk</strong>
                  <span className="lara-chat-status">● Online</span>
                </div>
                <p className="lara-chat-subtitle">Global Shipping & Logistics Support</p>
              </div>
            </div>

            <div className="lara-chat-header-actions">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lara-chat-header-btn whatsapp-btn"
                title="Open WhatsApp Chat (+91 81481 14238)"
                aria-label="WhatsApp"
              >
                <MessageSquare size={16} />
              </a>
              <button
                type="button"
                className="lara-chat-header-btn"
                onClick={handleResetChat}
                title="Restart conversation"
                aria-label="Restart chat"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                className="lara-chat-header-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Banner */}
          <div className="lara-chat-quick-banner">
            <div className="lara-chat-quick-banner-text">
              <span>Fastest response:</span> <b>WhatsApp Support Desk</b>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="lara-chat-wa-pill"
            >
              <span>Connect</span>
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Messages Stream */}
          <div className="lara-chat-body">
            {messages.map(msg => (
              <div key={msg.id} className={`lara-chat-msg-row ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="lara-chat-msg-avatar">
                    <Bot size={14} />
                  </div>
                )}
                <div className="lara-chat-bubble-wrap">
                  <div className="lara-chat-bubble">
                    <div className="lara-chat-text">
                      {msg.text.split('\n').map((line, idx) => {
                        if (!line.trim()) return <br key={idx} />
                        // Simple markdown bold formatting
                        const parts = line.split(/(\*\*.*?\*\*|\`.*?\`)/g)
                        return (
                          <p key={idx} className="lara-chat-paragraph">
                            {parts.map((p, pIdx) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                return <strong key={pIdx}>{p.slice(2, -2)}</strong>
                              }
                              if (p.startsWith('`') && p.endsWith('`')) {
                                return <code key={pIdx} className="lara-chat-code">{p.slice(1, -1)}</code>
                              }
                              return p
                            })}
                          </p>
                        )
                      })}
                    </div>
                    <span className="lara-chat-time">{msg.time}</span>
                  </div>

                  {/* Quick Action Suggestion Chips */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="lara-chat-options">
                      {msg.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          type="button"
                          className="lara-chat-option-btn"
                          onClick={() => handleAction(opt.action, opt.label, opt.url, opt.path)}
                        >
                          <span>{opt.label}</span>
                          <ChevronRight size={13} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="lara-chat-msg-row bot">
                <div className="lara-chat-msg-avatar">
                  <Bot size={14} />
                </div>
                <div className="lara-chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form className="lara-chat-footer" onSubmit={handleSendMessage}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your question or tracking #..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="lara-chat-send-btn"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
