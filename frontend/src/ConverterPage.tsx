import React, { useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { Calculator, RotateCcw, ArrowRight, ArrowUpRight, Box, Layers, Scale, Droplets, Ruler } from 'lucide-react'

interface ConverterPageProps {
  onNavigate: (event: ReactMouseEvent<HTMLElement>, path: string) => void
}

type LengthKey = 'mm' | 'cm' | 'm' | 'inch' | 'feet' | 'yard' | 'mile' | 'nauticalMile'
type WeightKey = 'gram' | 'kg' | 'ton' | 'ounce' | 'pound'
type LiquidKey = 'litre' | 'flOz' | 'quart' | 'gallon' | 'impGallon'

const LENGTH_TO_METER: Record<LengthKey, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  inch: 0.0254,
  feet: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
  nauticalMile: 1852,
}

const WEIGHT_TO_KG: Record<WeightKey, number> = {
  gram: 0.001,
  kg: 1,
  ton: 1000,
  ounce: 0.028349523125,
  pound: 0.45359237,
}

const LIQUID_TO_LITRE: Record<LiquidKey, number> = {
  litre: 1,
  flOz: 0.0295735295625,
  quart: 0.946352946,
  gallon: 3.785411784,
  impGallon: 4.54609,
}

const VOLUME_TO_CBM: Record<string, number> = {
  'Cubic Cm': 0.000001,
  'Cubic Meter': 1,
  'Cubic Inch': 0.000016387064,
  'Cubic Feet': 0.028316846592,
  'Cubic Yard': 0.764554857984,
  'Litre': 0.001,
}

function formatResult(val: number): string {
  if (isNaN(val) || !isFinite(val)) return ''
  if (val === 0) return '0'
  if (Math.abs(val) >= 100000 || (Math.abs(val) < 0.0001 && val !== 0)) {
    return val.toExponential(4)
  }
  const str = val.toFixed(4)
  return str.replace(/\.?0+$/, '')
}

export function ConverterPage({ onNavigate }: ConverterPageProps) {
  // 1. Length state
  const [lengthValues, setLengthValues] = useState<Record<LengthKey, string>>({
    mm: '',
    cm: '',
    m: '',
    inch: '',
    feet: '',
    yard: '',
    mile: '',
    nauticalMile: '',
  })
  const [lastEditedLength, setLastEditedLength] = useState<LengthKey | null>(null)

  const handleLengthChange = (key: LengthKey, val: string) => {
    setLastEditedLength(key)
    setLengthValues(prev => ({ ...prev, [key]: val }))
  }

  const calculateLength = () => {
    let sourceKey: LengthKey | null = lastEditedLength
    if (!sourceKey || !lengthValues[sourceKey]) {
      sourceKey = (Object.keys(lengthValues) as LengthKey[]).find(k => lengthValues[k].trim() !== '') || null
    }
    if (!sourceKey || !lengthValues[sourceKey]) return

    const num = parseFloat(lengthValues[sourceKey])
    if (isNaN(num)) return

    const meters = num * LENGTH_TO_METER[sourceKey]
    const updated: Record<LengthKey, string> = { ...lengthValues }
    ;(Object.keys(LENGTH_TO_METER) as LengthKey[]).forEach(k => {
      if (k === sourceKey) return
      const converted = meters / LENGTH_TO_METER[k]
      updated[k] = formatResult(converted)
    })
    setLengthValues(updated)
  }

  const clearLength = () => {
    setLengthValues({
      mm: '',
      cm: '',
      m: '',
      inch: '',
      feet: '',
      yard: '',
      mile: '',
      nauticalMile: '',
    })
    setLastEditedLength(null)
  }

  // 2. Cubic Meter state
  const [cbmLength, setCbmLength] = useState('')
  const [cbmWidth, setCbmWidth] = useState('')
  const [cbmHeight, setCbmHeight] = useState('')
  const [cbmQuantity, setCbmQuantity] = useState('1')
  const [cbmUnit, setCbmUnit] = useState('Centimeter')
  const [cbmResult, setCbmResult] = useState('')
  const [cbmVolumeWeight, setCbmVolumeWeight] = useState('')

  const calculateCbm = () => {
    const l = parseFloat(cbmLength)
    const w = parseFloat(cbmWidth)
    const h = parseFloat(cbmHeight)
    const qty = parseFloat(cbmQuantity) || 1

    if (isNaN(l) || isNaN(w) || isNaN(h)) return

    let factor = 1
    if (cbmUnit === 'Centimeter') factor = 0.01
    else if (cbmUnit === 'Meter') factor = 1
    else if (cbmUnit === 'Inch') factor = 0.0254
    else if (cbmUnit === 'Feet') factor = 0.3048
    else if (cbmUnit === 'MM') factor = 0.001

    const lM = l * factor
    const wM = w * factor
    const hM = h * factor

    const totalCbm = lM * wM * hM * qty
    const volWeightKg = totalCbm * (1000 / 6) // Standard Air Freight 1:6000

    setCbmResult(totalCbm >= 0.0001 ? totalCbm.toFixed(4) : totalCbm.toString())
    setCbmVolumeWeight(`${volWeightKg.toFixed(2)} Kg`)
  }

  const clearCbm = () => {
    setCbmLength('')
    setCbmWidth('')
    setCbmHeight('')
    setCbmQuantity('1')
    setCbmUnit('Centimeter')
    setCbmResult('')
    setCbmVolumeWeight('')
  }

  // 3. Weight state
  const [weightValues, setWeightValues] = useState<Record<WeightKey, string>>({
    gram: '',
    kg: '',
    ton: '',
    ounce: '',
    pound: '',
  })
  const [lastEditedWeight, setLastEditedWeight] = useState<WeightKey | null>(null)

  const handleWeightChange = (key: WeightKey, val: string) => {
    setLastEditedWeight(key)
    setWeightValues(prev => ({ ...prev, [key]: val }))
  }

  const calculateWeight = () => {
    let sourceKey: WeightKey | null = lastEditedWeight
    if (!sourceKey || !weightValues[sourceKey]) {
      sourceKey = (Object.keys(weightValues) as WeightKey[]).find(k => weightValues[k].trim() !== '') || null
    }
    if (!sourceKey || !weightValues[sourceKey]) return

    const num = parseFloat(weightValues[sourceKey])
    if (isNaN(num)) return

    const kg = num * WEIGHT_TO_KG[sourceKey]
    const updated: Record<WeightKey, string> = { ...weightValues }
    ;(Object.keys(WEIGHT_TO_KG) as WeightKey[]).forEach(k => {
      if (k === sourceKey) return
      const converted = kg / WEIGHT_TO_KG[k]
      updated[k] = formatResult(converted)
    })
    setWeightValues(updated)
  }

  const clearWeight = () => {
    setWeightValues({
      gram: '',
      kg: '',
      ton: '',
      ounce: '',
      pound: '',
    })
    setLastEditedWeight(null)
  }

  // 4. Liquid Volume state
  const [liquidValues, setLiquidValues] = useState<Record<LiquidKey, string>>({
    litre: '',
    flOz: '',
    quart: '',
    gallon: '',
    impGallon: '',
  })
  const [lastEditedLiquid, setLastEditedLiquid] = useState<LiquidKey | null>(null)

  const handleLiquidChange = (key: LiquidKey, val: string) => {
    setLastEditedLiquid(key)
    setLiquidValues(prev => ({ ...prev, [key]: val }))
  }

  const calculateLiquid = () => {
    let sourceKey: LiquidKey | null = lastEditedLiquid
    if (!sourceKey || !liquidValues[sourceKey]) {
      sourceKey = (Object.keys(liquidValues) as LiquidKey[]).find(k => liquidValues[k].trim() !== '') || null
    }
    if (!sourceKey || !liquidValues[sourceKey]) return

    const num = parseFloat(liquidValues[sourceKey])
    if (isNaN(num)) return

    const litres = num * LIQUID_TO_LITRE[sourceKey]
    const updated: Record<LiquidKey, string> = { ...liquidValues }
    ;(Object.keys(LIQUID_TO_LITRE) as LiquidKey[]).forEach(k => {
      if (k === sourceKey) return
      const converted = litres / LIQUID_TO_LITRE[k]
      updated[k] = formatResult(converted)
    })
    setLiquidValues(updated)
  }

  const clearLiquid = () => {
    setLiquidValues({
      litre: '',
      flOz: '',
      quart: '',
      gallon: '',
      impGallon: '',
    })
    setLastEditedLiquid(null)
  }

  // 5. Volume state
  const [volInputUnit, setVolInputUnit] = useState('Cubic Cm')
  const [volValue, setVolValue] = useState('')
  const [volOutputUnit, setVolOutputUnit] = useState('Cubic Cm')
  const [volResult, setVolResult] = useState('')

  const calculateVolume = () => {
    const val = parseFloat(volValue)
    if (isNaN(val)) return

    const inFactor = VOLUME_TO_CBM[volInputUnit] || 1
    const outFactor = VOLUME_TO_CBM[volOutputUnit] || 1

    const cbm = val * inFactor
    const res = cbm / outFactor
    setVolResult(formatResult(res))
  }

  const clearVolume = () => {
    setVolInputUnit('Cubic Cm')
    setVolValue('')
    setVolOutputUnit('Cubic Cm')
    setVolResult('')
  }

  return (
    <div className="industries-page converter-page-theme">
      {/* Top Header matching all other pages (About, Industries, Contact, etc.) */}
      <header className="about-header">
        <div className="about-header-inner">
          <a className="logo" href="/" onClick={(e) => onNavigate(e, '/')} aria-label="Lara Shipping home">
            <img src="/logo.png" alt="LARA Shipping Logo" style={{ height: '45px', width: 'auto', display: 'block' }} />
          </a>
          <nav aria-label="Primary navigation">
            <a href="/" onClick={(e) => onNavigate(e, '/')}>Home</a>
            <a href="/#services" onClick={(e) => onNavigate(e, '/#services')}>Services</a>
            <a href="/industries" onClick={(e) => onNavigate(e, '/industries')}>Industries</a>
            <a className="active" href="/cbm-calculator" onClick={(e) => onNavigate(e, '/cbm-calculator')}>CBM Calculator</a>
            <a href="/about" onClick={(e) => onNavigate(e, '/about')}>About Us</a>
            <a href="/contact" onClick={(e) => onNavigate(e, '/contact')}>Contact Us</a>
          </nav>
          <a className="industries-quote" href="/quote" onClick={(e) => onNavigate(e, '/quote')}>
            Get a Quote <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <main>
        {/* Masthead Banner matching Lara Shipping aesthetic */}
        <section className="industries-masthead">
          <div className="industries-company-card">
            <span className="eyebrow light">
              <span /> LARA SHIPPING LINE · CONVERTER TOOLS
            </span>
            <h1>
              Cargo Volume &amp;<br />
              <em>Unit Converter.</em>
            </h1>
            <p>
              Accurate freight conversion for Length, Cubic Meter (CBM), Weight, Liquid Volume, and Volumetric Density tailored for international ocean and air transport.
            </p>
          </div>
        </section>

        {/* 5-Card Converter Dashboard in Lara Shipping Theme */}
        <section className="converter-section-wrap section-shell">
          {/* Top Row: Length (left) & Cubic Meter (right) */}
          <div className="converter-grid-row top-row">
            {/* Card 1: Length */}
            <div className="converter-card length-card">
              <div className="converter-card-header">
                <div className="converter-header-title">
                  <Ruler size={18} className="converter-title-icon" />
                  <h3>Length</h3>
                </div>
                <div className="converter-card-actions">
                  <button
                    type="button"
                    className="converter-btn btn-calculate"
                    onClick={calculateLength}
                  >
                    <Calculator size={14} />
                    <span>Calculate</span>
                  </button>
                  <button
                    type="button"
                    className="converter-btn btn-clear"
                    onClick={clearLength}
                  >
                    <RotateCcw size={13} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              <div className="converter-card-body">
                <div className="converter-field-row">
                  <label htmlFor="length-mm">MM</label>
                  <input
                    id="length-mm"
                    type="number"
                    step="any"
                    value={lengthValues.mm}
                    onChange={(e) => handleLengthChange('mm', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLength()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="length-cm">Centimeter</label>
                  <input
                    id="length-cm"
                    type="number"
                    step="any"
                    value={lengthValues.cm}
                    onChange={(e) => handleLengthChange('cm', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLength()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="length-m">Meter</label>
                  <input
                    id="length-m"
                    type="number"
                    step="any"
                    value={lengthValues.m}
                    onChange={(e) => handleLengthChange('m', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLength()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="length-inch">Inch</label>
                  <input
                    id="length-inch"
                    type="number"
                    step="any"
                    value={lengthValues.inch}
                    onChange={(e) => handleLengthChange('inch', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLength()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="length-feet">Feet</label>
                  <input
                    id="length-feet"
                    type="number"
                    step="any"
                    value={lengthValues.feet}
                    onChange={(e) => handleLengthChange('feet', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLength()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="length-yard">Yard</label>
                  <input
                    id="length-yard"
                    type="number"
                    step="any"
                    value={lengthValues.yard}
                    onChange={(e) => handleLengthChange('yard', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLength()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="length-mile">Mile</label>
                  <input
                    id="length-mile"
                    type="number"
                    step="any"
                    value={lengthValues.mile}
                    onChange={(e) => handleLengthChange('mile', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLength()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="length-nautical">Nautical Mile</label>
                  <input
                    id="length-nautical"
                    type="number"
                    step="any"
                    value={lengthValues.nauticalMile}
                    onChange={(e) => handleLengthChange('nauticalMile', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLength()}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Cubic Meter */}
            <div className="converter-card cbm-card">
              <div className="converter-card-header">
                <div className="converter-header-title">
                  <Box size={18} className="converter-title-icon" />
                  <h3>Cubic Meter</h3>
                </div>
                <div className="converter-card-actions">
                  <button
                    type="button"
                    className="converter-btn btn-calculate"
                    onClick={calculateCbm}
                  >
                    <Calculator size={14} />
                    <span>Calculate</span>
                  </button>
                  <button
                    type="button"
                    className="converter-btn btn-clear"
                    onClick={clearCbm}
                  >
                    <RotateCcw size={13} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              <div className="converter-card-body">
                <div className="converter-field-row">
                  <label htmlFor="cbm-length">Length</label>
                  <input
                    id="cbm-length"
                    type="number"
                    step="any"
                    value={cbmLength}
                    onChange={(e) => setCbmLength(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateCbm()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="cbm-width">Width</label>
                  <input
                    id="cbm-width"
                    type="number"
                    step="any"
                    value={cbmWidth}
                    onChange={(e) => setCbmWidth(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateCbm()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="cbm-height">Height</label>
                  <input
                    id="cbm-height"
                    type="number"
                    step="any"
                    value={cbmHeight}
                    onChange={(e) => setCbmHeight(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateCbm()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="cbm-qty">Quantity</label>
                  <input
                    id="cbm-qty"
                    type="number"
                    step="1"
                    min="1"
                    value={cbmQuantity}
                    onChange={(e) => setCbmQuantity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateCbm()}
                    placeholder="1"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="cbm-unit">Unit</label>
                  <div className="converter-select-wrap">
                    <select
                      id="cbm-unit"
                      value={cbmUnit}
                      onChange={(e) => setCbmUnit(e.target.value)}
                    >
                      <option value="Centimeter">Centimeter</option>
                      <option value="Meter">Meter</option>
                      <option value="Inch">Inch</option>
                      <option value="Feet">Feet</option>
                      <option value="MM">MM</option>
                    </select>
                  </div>
                </div>

                <div className="converter-field-row output-row">
                  <label htmlFor="cbm-result">Cubic Meter</label>
                  <input
                    id="cbm-result"
                    type="text"
                    readOnly
                    value={cbmResult}
                    placeholder="0.0000"
                    className="converter-result-input"
                  />
                </div>

                <div className="converter-field-row output-row">
                  <label htmlFor="cbm-vol-weight">Volume Weight</label>
                  <input
                    id="cbm-vol-weight"
                    type="text"
                    readOnly
                    value={cbmVolumeWeight}
                    placeholder="0.00 Kg"
                    className="converter-result-input"
                  />
                </div>

                {/* Instant Cargo Quote Prompt */}
                {cbmResult && parseFloat(cbmResult) > 0 && (
                  <div className="cbm-quote-prompt">
                    <div className="cbm-quote-info">
                      <span>Calculated Volume: <b>{cbmResult} CBM</b> ({cbmVolumeWeight})</span>
                    </div>
                    <button
                      type="button"
                      className="cbm-quote-btn"
                      onClick={(e) => onNavigate(e, '/quote')}
                    >
                      <span>Request Quote for this Cargo</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row: Weight (left), Liquid Volume (middle), Volume (right) */}
          <div className="converter-grid-row bottom-row">
            {/* Card 3: Weight */}
            <div className="converter-card weight-card">
              <div className="converter-card-header">
                <div className="converter-header-title">
                  <Scale size={18} className="converter-title-icon" />
                  <h3>Weight</h3>
                </div>
                <div className="converter-card-actions">
                  <button
                    type="button"
                    className="converter-btn btn-calculate"
                    onClick={calculateWeight}
                  >
                    <Calculator size={14} />
                    <span>Calculate</span>
                  </button>
                  <button
                    type="button"
                    className="converter-btn btn-clear"
                    onClick={clearWeight}
                  >
                    <RotateCcw size={13} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              <div className="converter-card-body">
                <div className="converter-field-row">
                  <label htmlFor="wt-gram">Gram</label>
                  <input
                    id="wt-gram"
                    type="number"
                    step="any"
                    value={weightValues.gram}
                    onChange={(e) => handleWeightChange('gram', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateWeight()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="wt-kg">Kilogram</label>
                  <input
                    id="wt-kg"
                    type="number"
                    step="any"
                    value={weightValues.kg}
                    onChange={(e) => handleWeightChange('kg', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateWeight()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="wt-ton">Ton</label>
                  <input
                    id="wt-ton"
                    type="number"
                    step="any"
                    value={weightValues.ton}
                    onChange={(e) => handleWeightChange('ton', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateWeight()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="wt-ounce">Ounce</label>
                  <input
                    id="wt-ounce"
                    type="number"
                    step="any"
                    value={weightValues.ounce}
                    onChange={(e) => handleWeightChange('ounce', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateWeight()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="wt-pound">Pound</label>
                  <input
                    id="wt-pound"
                    type="number"
                    step="any"
                    value={weightValues.pound}
                    onChange={(e) => handleWeightChange('pound', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateWeight()}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Liquid Volume */}
            <div className="converter-card liquid-card">
              <div className="converter-card-header">
                <div className="converter-header-title">
                  <Droplets size={18} className="converter-title-icon" />
                  <h3>Liquid Volume</h3>
                </div>
                <div className="converter-card-actions">
                  <button
                    type="button"
                    className="converter-btn btn-calculate"
                    onClick={calculateLiquid}
                  >
                    <Calculator size={14} />
                    <span>Calculate</span>
                  </button>
                  <button
                    type="button"
                    className="converter-btn btn-clear"
                    onClick={clearLiquid}
                  >
                    <RotateCcw size={13} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              <div className="converter-card-body">
                <div className="converter-field-row">
                  <label htmlFor="liq-litre">Litre</label>
                  <input
                    id="liq-litre"
                    type="number"
                    step="any"
                    value={liquidValues.litre}
                    onChange={(e) => handleLiquidChange('litre', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLiquid()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="liq-floz">Fluid Ounces</label>
                  <input
                    id="liq-floz"
                    type="number"
                    step="any"
                    value={liquidValues.flOz}
                    onChange={(e) => handleLiquidChange('flOz', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLiquid()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="liq-quart">Quart</label>
                  <input
                    id="liq-quart"
                    type="number"
                    step="any"
                    value={liquidValues.quart}
                    onChange={(e) => handleLiquidChange('quart', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLiquid()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="liq-gallon">Gallon</label>
                  <input
                    id="liq-gallon"
                    type="number"
                    step="any"
                    value={liquidValues.gallon}
                    onChange={(e) => handleLiquidChange('gallon', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLiquid()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="liq-impgallon">Imperial Gallon</label>
                  <input
                    id="liq-impgallon"
                    type="number"
                    step="any"
                    value={liquidValues.impGallon}
                    onChange={(e) => handleLiquidChange('impGallon', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateLiquid()}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Card 5: Volume */}
            <div className="converter-card volume-card">
              <div className="converter-card-header">
                <div className="converter-header-title">
                  <Layers size={18} className="converter-title-icon" />
                  <h3>Volume</h3>
                </div>
                <div className="converter-card-actions">
                  <button
                    type="button"
                    className="converter-btn btn-calculate"
                    onClick={calculateVolume}
                  >
                    <Calculator size={14} />
                    <span>Calculate</span>
                  </button>
                  <button
                    type="button"
                    className="converter-btn btn-clear"
                    onClick={clearVolume}
                  >
                    <RotateCcw size={13} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              <div className="converter-card-body">
                <div className="converter-field-row">
                  <label htmlFor="vol-in-unit">Input Unit</label>
                  <div className="converter-select-wrap">
                    <select
                      id="vol-in-unit"
                      value={volInputUnit}
                      onChange={(e) => setVolInputUnit(e.target.value)}
                    >
                      <option value="Cubic Cm">Cubic Cm</option>
                      <option value="Cubic Meter">Cubic Meter</option>
                      <option value="Cubic Inch">Cubic Inch</option>
                      <option value="Cubic Feet">Cubic Feet</option>
                      <option value="Cubic Yard">Cubic Yard</option>
                      <option value="Litre">Litre</option>
                    </select>
                  </div>
                </div>

                <div className="converter-field-row">
                  <label htmlFor="vol-val">Value</label>
                  <input
                    id="vol-val"
                    type="number"
                    step="any"
                    value={volValue}
                    onChange={(e) => setVolValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateVolume()}
                    placeholder="0"
                  />
                </div>

                <div className="converter-field-row">
                  <label htmlFor="vol-out-unit">Output Unit</label>
                  <div className="converter-select-wrap">
                    <select
                      id="vol-out-unit"
                      value={volOutputUnit}
                      onChange={(e) => setVolOutputUnit(e.target.value)}
                    >
                      <option value="Cubic Cm">Cubic Cm</option>
                      <option value="Cubic Meter">Cubic Meter</option>
                      <option value="Cubic Inch">Cubic Inch</option>
                      <option value="Cubic Feet">Cubic Feet</option>
                      <option value="Cubic Yard">Cubic Yard</option>
                      <option value="Litre">Litre</option>
                    </select>
                  </div>
                </div>

                <div className="converter-field-row output-row">
                  <label htmlFor="vol-res">Result</label>
                  <input
                    id="vol-res"
                    type="text"
                    readOnly
                    value={volResult}
                    placeholder="0.0000"
                    className="converter-result-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick CTA banner */}
          <div className="converter-cta-banner">
            <div className="converter-cta-text">
              <h3>Need Freight Rates for your Cargo?</h3>
              <p>Submit your calculated dimensions or speak directly with our worldwide ocean &amp; air dispatchers.</p>
            </div>
            <div className="converter-cta-buttons">
              <button
                type="button"
                className="converter-cta-quote-btn"
                onClick={(e) => onNavigate(e, '/quote')}
              >
                <span>Request a Quote</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="converter-cta-home-btn"
                onClick={(e) => onNavigate(e, '/')}
              >
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Global Lara Shipping Footer matching all other pages */}
      <footer className="industries-footer">
        <div className="industries-footer-inner section-shell">
          <div className="industries-footer-brand">
            <a className="logo" href="/" onClick={(e) => onNavigate(e, '/')} aria-label="Lara Shipping home">
              <img src="/logo.png" alt="LARA Shipping Logo" style={{ height: '45px', width: 'auto', display: 'block' }} />
            </a>
            <p>LARA SHIPPING LINE PVT LTD</p>
            <span>Connect With Us</span>
            <div>
              <a href="https://www.facebook.com/people/Lara-shipping-line-pvt-ltd/61559639342106/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/larashippingline?igsh=bDRicTA2M3lpbXR" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              <a href="https://www.linkedin.com/company/lara-shipping-line-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="#x" aria-label="X">𝕏</a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Useful Links</h3>
            <a href="/" onClick={(e) => onNavigate(e, '/')}>Home</a>
            <a href="/about" onClick={(e) => onNavigate(e, '/about')}>About Us</a>
            <a href="/#services" onClick={(e) => onNavigate(e, '/#services')}>Services</a>
            <a href="/industries" onClick={(e) => onNavigate(e, '/industries')}>Industries</a>
            <a href="/contact" onClick={(e) => onNavigate(e, '/contact')}>Contact Us</a>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <a href="/air-freight" onClick={(e) => onNavigate(e, '/air-freight')}>Air Freight</a>
            <a href="/cargo-insurance" onClick={(e) => onNavigate(e, '/cargo-insurance')}>Cargo Insurance</a>
            <a href="/ocean-freight-fcl" onClick={(e) => onNavigate(e, '/ocean-freight-fcl')}>Ocean Freight(FCL)</a>
            <a href="/ocean-freight-lcl" onClick={(e) => onNavigate(e, '/ocean-freight-lcl')}>Ocean Freight(LCL)</a>
            <a href="/rail-freight" onClick={(e) => onNavigate(e, '/rail-freight')}>Rail Freight</a>
            <a href="/road-freight" onClick={(e) => onNavigate(e, '/road-freight')}>Road Freight</a>
          </div>

          <div className="footer-column">
            <h3>Customer Solutions</h3>
            <a href="/contract-logistics" onClick={(e) => onNavigate(e, '/contract-logistics')}>Contract Logistics</a>
            <a href="/cross-border" onClick={(e) => onNavigate(e, '/cross-border')}>Cross Border E-Commerce</a>
            <a href="/customs-brokerage" onClick={(e) => onNavigate(e, '/customs-brokerage')}>Customs Brokerage</a>
            <a href="/green-solution" onClick={(e) => onNavigate(e, '/green-solution')}>Green Solution</a>
            <a href="/technology-customer-solution" onClick={(e) => onNavigate(e, '/technology-customer-solution')}>Technology &amp; Customer Services</a>
          </div>
        </div>

        <div className="footer-bottom section-shell">
          <span>© 2026 All Rights Reserved by Lara Shipping Line Pvt Ltd</span>
        </div>
      </footer>
    </div>
  )
}
