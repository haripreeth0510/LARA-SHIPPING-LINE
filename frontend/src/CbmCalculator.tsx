import React, { useState, useMemo, type MouseEvent as ReactMouseEvent } from 'react'
import {
  Calculator, Plus, Trash2, RotateCcw, ArrowRight, Box, Ship, Plane,
  Truck, Check, Copy, ExternalLink, HelpCircle, Info, Sparkles
} from 'lucide-react'

export interface CargoItem {
  id: string
  name: string
  length: number | ''
  width: number | ''
  height: number | ''
  unit: 'cm' | 'm' | 'in' | 'ft'
  quantity: number | ''
  weight: number | '' // Gross weight per unit
  weightUnit: 'kg' | 'lbs'
}

interface CbmCalculatorProps {
  onNavigate: (event?: ReactMouseEvent<HTMLElement>, path?: string) => void
  onOpenChat?: () => void
}

const DEFAULT_ITEM: CargoItem = {
  id: 'item-1',
  name: 'Standard Cartons',
  length: 50,
  width: 40,
  height: 30,
  unit: 'cm',
  quantity: 20,
  weight: 15,
  weightUnit: 'kg'
}

// Usable capacities in CBM
const CONTAINER_SPECS = {
  '20ft': { name: "20' Standard Container", maxCbm: 33.2, usableCbm: 28.0, maxPayloadKg: 28200 },
  '40ft': { name: "40' Standard Container", maxCbm: 67.7, usableCbm: 58.0, maxPayloadKg: 28800 },
  '40hc': { name: "40' High Cube Container", maxCbm: 76.3, usableCbm: 68.0, maxPayloadKg: 28600 },
}

export default function CbmCalculator({ onNavigate, onOpenChat }: CbmCalculatorProps) {
  const [items, setItems] = useState<CargoItem[]>([DEFAULT_ITEM])
  const [copied, setCopied] = useState(false)

  const addItem = () => {
    const newItem: CargoItem = {
      id: `item-${Date.now()}`,
      name: `Package ${items.length + 1}`,
      length: 60,
      width: 40,
      height: 40,
      unit: 'cm',
      quantity: 10,
      weight: 20,
      weightUnit: 'kg'
    }
    setItems(prev => [...prev, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length <= 1) return
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateItem = (id: string, field: keyof CargoItem, value: any) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const resetAll = () => {
    setItems([
      {
        ...DEFAULT_ITEM,
        id: `item-${Date.now()}`
      }
    ])
  }

  // Unit conversion helpers to meters and kilograms
  const toMeters = (val: number, unit: CargoItem['unit']): number => {
    if (unit === 'cm') return val / 100
    if (unit === 'm') return val
    if (unit === 'in') return val * 0.0254
    if (unit === 'ft') return val * 0.3048
    return val
  }

  const toKg = (val: number, unit: CargoItem['weightUnit']): number => {
    if (unit === 'lbs') return val * 0.453592
    return val
  }

  // Calculations
  const results = useMemo(() => {
    let totalCbm = 0
    let totalGrossWeightKg = 0
    let totalPackages = 0

    items.forEach(item => {
      const l = typeof item.length === 'number' ? item.length : 0
      const w = typeof item.width === 'number' ? item.width : 0
      const h = typeof item.height === 'number' ? item.height : 0
      const q = typeof item.quantity === 'number' ? item.quantity : 0
      const wt = typeof item.weight === 'number' ? item.weight : 0

      const lengthM = toMeters(l, item.unit)
      const widthM = toMeters(w, item.unit)
      const heightM = toMeters(h, item.unit)

      const singleCbm = lengthM * widthM * heightM
      const itemTotalCbm = singleCbm * q
      totalCbm += itemTotalCbm

      const singleWeightKg = toKg(wt, item.weightUnit)
      totalGrossWeightKg += singleWeightKg * q
      totalPackages += q
    })

    const totalCft = totalCbm * 35.3147
    const totalGrossWeightLbs = totalGrossWeightKg * 2.20462

    // Volumetric weights
    const airVolumetricKg = totalCbm * 166.67 // 1 CBM = 167 kg
    const seaVolumetricKg = totalCbm * 1000 // 1 CBM = 1,000 kg (1 Ton)
    const courierVolumetricKg = totalCbm * 200 // 1 CBM = 200 kg

    // Container utilization percentages
    const fill20 = (totalCbm / CONTAINER_SPECS['20ft'].usableCbm) * 100
    const fill40 = (totalCbm / CONTAINER_SPECS['40ft'].usableCbm) * 100
    const fill40hc = (totalCbm / CONTAINER_SPECS['40hc'].usableCbm) * 100

    // Recommendation
    let recommendation = ''
    let recommendedMode: 'LCL' | '20FT' | '40FT' | '40HC' = 'LCL'
    if (totalCbm <= 0) {
      recommendation = 'Enter cargo dimensions above to calculate logistics metrics.'
    } else if (totalCbm < 15) {
      recommendation = `Recommended: LCL Consolidation (Less than Container Load) or Air Freight. Your cargo is ${totalCbm.toFixed(2)} CBM, ideal for shared container shipping.`
      recommendedMode = 'LCL'
    } else if (totalCbm <= CONTAINER_SPECS['20ft'].usableCbm) {
      recommendation = `Recommended: 1 x 20' Standard FCL Container. Your cargo occupies ${fill20.toFixed(1)}% of a 20ft container.`
      recommendedMode = '20FT'
    } else if (totalCbm <= CONTAINER_SPECS['40ft'].usableCbm) {
      recommendation = `Recommended: 1 x 40' Standard FCL Container. Your cargo occupies ${fill40.toFixed(1)}% of a 40ft container.`
      recommendedMode = '40FT'
    } else {
      recommendation = `Recommended: 40' High Cube (HC) Container or Multiple Containers. Cargo volume is ${totalCbm.toFixed(2)} CBM.`
      recommendedMode = '40HC'
    }

    return {
      totalCbm,
      totalCft,
      totalGrossWeightKg,
      totalGrossWeightLbs,
      totalPackages,
      airVolumetricKg,
      seaVolumetricKg,
      courierVolumetricKg,
      fill20,
      fill40,
      fill40hc,
      recommendation,
      recommendedMode
    }
  }, [items])

  const copySummary = () => {
    const text = `LARA Shipping - Cargo CBM Calculation:
Total Volume: ${results.totalCbm.toFixed(3)} CBM (${results.totalCft.toFixed(1)} CFT)
Total Packages: ${results.totalPackages} pkgs
Total Gross Weight: ${results.totalGrossWeightKg.toFixed(1)} kg (${results.totalGrossWeightLbs.toFixed(1)} lbs)
Air Volumetric Weight: ${results.airVolumetricKg.toFixed(1)} kg
Sea LCL W/M (Weight/Measure): ${Math.max(results.totalCbm, results.totalGrossWeightKg / 1000).toFixed(2)} RT
Recommendation: ${results.recommendation}`

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const handleQuoteClick = (e: ReactMouseEvent<HTMLElement>) => {
    e.preventDefault()
    onNavigate(e, `/quote?cbm=${results.totalCbm.toFixed(2)}&weight=${results.totalGrossWeightKg.toFixed(1)}&packages=${results.totalPackages}`)
  }

  const whatsappInquiryUrl = `https://wa.me/918148114238?text=${encodeURIComponent(
    `Hello LARA Shipping Line! I used your CBM Calculator for my cargo:\n• Total Volume: ${results.totalCbm.toFixed(3)} CBM (${results.totalCft.toFixed(1)} CFT)\n• Packages: ${results.totalPackages} units\n• Weight: ${results.totalGrossWeightKg.toFixed(1)} kg\n• Mode: ${results.recommendedMode}\nPlease provide a freight quote for this shipment.`
  )}`

  return (
    <section className="cbm-section" id="cbm-calculator">
      <div className="section-shell">
        {/* Section Header */}
        <div className="cbm-header-wrap">
          <div className="cbm-header-copy">
            <span className="eyebrow light">
              <span /> Logistics Tools &amp; Intelligence
            </span>
            <h2>
              CBM <em>Calculator.</em>
            </h2>
            <p>
              Instantly calculate cargo volume (CBM / CFT), chargeable volumetric weight for air &amp; ocean freight, and container load utilization for global shipping.
            </p>
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="cbm-open-full-converter"
                onClick={(e) => onNavigate(e, '/cbm-calculator')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ea580c',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Calculator size={16} />
                <span>Open Dedicated Metric &amp; CBM Converter</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
          <div className="cbm-header-badge">
            <div className="cbm-badge-icon">
              <Calculator size={26} />
            </div>
            <div>
              <strong>Instant Freight Sizing</strong>
              <span>Ocean FCL / LCL &amp; Air Freight</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Input Table + Results Panel */}
        <div className="cbm-grid">
          {/* Left Column: Input Form & Packages */}
          <div className="cbm-input-card">
            <div className="cbm-card-top">
              <div className="cbm-card-title">
                <Box size={18} />
                <h3>Cargo Packages</h3>
                <span className="cbm-item-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
              </div>
              <button
                type="button"
                className="cbm-reset-btn"
                onClick={resetAll}
                title="Reset all fields"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            {/* Packages List */}
            <div className="cbm-items-list">
              {items.map((item, index) => (
                <div key={item.id} className="cbm-item-row">
                  <div className="cbm-item-header">
                    <span className="cbm-item-num">#{index + 1}</span>
                    <input
                      type="text"
                      className="cbm-item-name-input"
                      value={item.name}
                      onChange={e => updateItem(item.id, 'name', e.target.value)}
                      placeholder="e.g. Cartons, Pallets"
                      aria-label="Package description"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="cbm-remove-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        title="Remove package"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div className="cbm-fields-grid">
                    {/* Quantity */}
                    <div className="cbm-field">
                      <label>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1))}
                        placeholder="Qty"
                      />
                    </div>

                    {/* Dimensions & Unit */}
                    <div className="cbm-field">
                      <label>Length</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.length}
                        onChange={e => updateItem(item.id, 'length', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                        placeholder="L"
                      />
                    </div>

                    <div className="cbm-field">
                      <label>Width</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.width}
                        onChange={e => updateItem(item.id, 'width', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                        placeholder="W"
                      />
                    </div>

                    <div className="cbm-field">
                      <label>Height</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.height}
                        onChange={e => updateItem(item.id, 'height', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                        placeholder="H"
                      />
                    </div>

                    {/* Dimension Unit */}
                    <div className="cbm-field">
                      <label>Dim. Unit</label>
                      <select
                        value={item.unit}
                        onChange={e => updateItem(item.id, 'unit', e.target.value as any)}
                      >
                        <option value="cm">cm (Centimeter)</option>
                        <option value="m">m (Meter)</option>
                        <option value="in">in (Inch)</option>
                        <option value="ft">ft (Feet)</option>
                      </select>
                    </div>

                    {/* Weight Per Unit */}
                    <div className="cbm-field">
                      <label>Gross Wt / Pkg</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.weight}
                        onChange={e => updateItem(item.id, 'weight', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                        placeholder="Weight"
                      />
                    </div>

                    {/* Weight Unit */}
                    <div className="cbm-field">
                      <label>Wt. Unit</label>
                      <select
                        value={item.weightUnit}
                        onChange={e => updateItem(item.id, 'weightUnit', e.target.value as any)}
                      >
                        <option value="kg">kg (Kilogram)</option>
                        <option value="lbs">lbs (Pound)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item Button */}
            <div className="cbm-actions-bar">
              <button type="button" className="cbm-add-btn" onClick={addItem}>
                <Plus size={16} />
                <span>Add Another Package</span>
              </button>
            </div>
          </div>

          {/* Right Column: Results & Container Load Estimator */}
          <div className="cbm-results-card">
            {/* Primary Volume Highlights */}
            <div className="cbm-highlight-box">
              <div className="cbm-highlight-main">
                <span className="cbm-highlight-label">TOTAL CARGO VOLUME</span>
                <div className="cbm-highlight-value">
                  <strong>{results.totalCbm.toFixed(3)}</strong>
                  <span className="cbm-unit-tag">CBM (m³)</span>
                </div>
                <div className="cbm-highlight-sub">
                  <span>≈ <b>{results.totalCft.toFixed(2)}</b> CFT (Cubic Feet)</span>
                  <span>•</span>
                  <span><b>{results.totalPackages}</b> total packages</span>
                </div>
              </div>

              <div className="cbm-weight-summary">
                <div>
                  <small>TOTAL GROSS WEIGHT</small>
                  <strong>{results.totalGrossWeightKg.toFixed(1)} <small>KG</small></strong>
                  <span>({results.totalGrossWeightLbs.toFixed(1)} lbs)</span>
                </div>
              </div>
            </div>

            {/* Freight Volumetric Weights Table */}
            <div className="cbm-freight-modes">
              <div className="cbm-mode-card">
                <div className="cbm-mode-top">
                  <div className="cbm-mode-icon sea"><Ship size={18} /></div>
                  <div>
                    <strong>Ocean Freight (LCL)</strong>
                    <small>1 CBM = 1,000 kg (1 MT)</small>
                  </div>
                </div>
                <div className="cbm-mode-val">
                  <span>Chargeable W/M:</span>
                  <b>{Math.max(results.totalCbm, results.totalGrossWeightKg / 1000).toFixed(2)} RT</b>
                </div>
              </div>

              <div className="cbm-mode-card">
                <div className="cbm-mode-top">
                  <div className="cbm-mode-icon air"><Plane size={18} /></div>
                  <div>
                    <strong>Air Freight (IATA)</strong>
                    <small>1 CBM = 167 kg (1:6000)</small>
                  </div>
                </div>
                <div className="cbm-mode-val">
                  <span>Volumetric Weight:</span>
                  <b>{results.airVolumetricKg.toFixed(1)} kg</b>
                </div>
              </div>
            </div>

            {/* Container Load Utilization Progress Bars */}
            <div className="cbm-container-utilization">
              <div className="cbm-util-header">
                <h4>Container Load Utilization</h4>
                <small>Usable capacity estimation</small>
              </div>

              <div className="cbm-util-list">
                {/* 20ft */}
                <div className="cbm-util-item">
                  <div className="cbm-util-meta">
                    <span className="cbm-cnt-name">20' Standard Container (28 CBM)</span>
                    <span className={`cbm-cnt-pct ${results.fill20 > 100 ? 'overflow' : ''}`}>
                      {results.fill20 > 100 ? `Exceeds 1x 20ft (${Math.ceil(results.totalCbm / 28)} needed)` : `${results.fill20.toFixed(1)}% full`}
                    </span>
                  </div>
                  <div className="cbm-progress-track">
                    <div
                      className={`cbm-progress-fill ${results.fill20 > 100 ? 'overflow' : ''}`}
                      style={{ width: `${Math.min(100, results.fill20)}%` }}
                    />
                  </div>
                </div>

                {/* 40ft */}
                <div className="cbm-util-item">
                  <div className="cbm-util-meta">
                    <span className="cbm-cnt-name">40' Standard Container (58 CBM)</span>
                    <span className={`cbm-cnt-pct ${results.fill40 > 100 ? 'overflow' : ''}`}>
                      {results.fill40 > 100 ? `Exceeds 1x 40ft (${Math.ceil(results.totalCbm / 58)} needed)` : `${results.fill40.toFixed(1)}% full`}
                    </span>
                  </div>
                  <div className="cbm-progress-track">
                    <div
                      className={`cbm-progress-fill ${results.fill40 > 100 ? 'overflow' : ''}`}
                      style={{ width: `${Math.min(100, results.fill40)}%` }}
                    />
                  </div>
                </div>

                {/* 40ft HC */}
                <div className="cbm-util-item">
                  <div className="cbm-util-meta">
                    <span className="cbm-cnt-name">40' High Cube Container (68 CBM)</span>
                    <span className={`cbm-cnt-pct ${results.fill40hc > 100 ? 'overflow' : ''}`}>
                      {results.fill40hc > 100 ? `Exceeds 1x 40HC (${Math.ceil(results.totalCbm / 68)} needed)` : `${results.fill40hc.toFixed(1)}% full`}
                    </span>
                  </div>
                  <div className="cbm-progress-track">
                    <div
                      className={`cbm-progress-fill ${results.fill40hc > 100 ? 'overflow' : ''}`}
                      style={{ width: `${Math.min(100, results.fill40hc)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Recommendation */}
            <div className="cbm-recommendation">
              <div className="cbm-rec-icon">
                <Sparkles size={18} />
              </div>
              <p>{results.recommendation}</p>
            </div>

            {/* Actions: Request Quote + WhatsApp + Copy */}
            <div className="cbm-footer-actions">
              <a
                href="/quote"
                onClick={handleQuoteClick}
                className="button primary cbm-quote-btn"
              >
                <span>Request Quote for this CBM</span>
                <ArrowRight size={16} />
              </a>

              <div className="cbm-sub-actions">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cbm-wa-btn"
                  title="Inquire via WhatsApp"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink size={13} />
                </a>

                <button
                  type="button"
                  className="cbm-copy-btn"
                  onClick={copySummary}
                  title="Copy calculation summary"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="copied-icon" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
