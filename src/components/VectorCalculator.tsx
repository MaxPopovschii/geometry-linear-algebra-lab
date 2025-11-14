import { useState } from 'react'
import { Vector } from '../utils/Vector'

type VectorOperation = 'add' | 'subtract' | 'dot' | 'cross' | 'magnitude' | 'normalize' | 'angle' | 'distance' | 'scalar'

const VectorCalculator = () => {
  const [vectorA, setVectorA] = useState<number[]>([1, 2, 3])
  const [vectorB, setVectorB] = useState<number[]>([4, 5, 6])
  const [scalar, setScalar] = useState<number>(2)
  const [dimension, setDimension] = useState<number>(3)
  const [operation, setOperation] = useState<VectorOperation>('add')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  const updateDimension = (newDim: number) => {
	setDimension(newDim)
	
	// Adjust vectors to new dimension
	const newVectorA = Array(newDim).fill(0).map((_, i) => vectorA[i] || 0)
	const newVectorB = Array(newDim).fill(0).map((_, i) => vectorB[i] || 0)
	
	setVectorA(newVectorA)
	setVectorB(newVectorB)
  }

  const updateVectorValue = (vector: 'A' | 'B', index: number, value: string) => {
	const numValue = parseFloat(value) || 0
	
	if (vector === 'A') {
	  const newVector = [...vectorA]
	  newVector[index] = numValue
	  setVectorA(newVector)
	} else {
	  const newVector = [...vectorB]
	  newVector[index] = numValue
	  setVectorB(newVector)
	}
  }

  const renderVectorInput = (vector: number[], vectorName: 'A' | 'B') => {
	return (
	  <div className="input-group">
		<label>Vettore {vectorName}</label>
		<div 
		  className="input-grid"
		  style={{ 
			gridTemplateColumns: `repeat(${Math.min(dimension, 4)}, 1fr)`,
			gap: '0.5rem'
		  }}
		>
		  {vector.map((value, index) => (
			<div key={index}>
			  <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
				{vectorName}{index + 1}
			  </label>
			  <input
				type="number"
				step="any"
				className="matrix-input"
				value={value}
				onChange={(e) => updateVectorValue(vectorName, index, e.target.value)}
			  />
			</div>
		  ))}
		</div>
	  </div>
	)
  }

  const calculate = () => {
	try {
	  setError('')
	  const vA = new Vector(vectorA)
	  const vB = new Vector(vectorB)
	  let resultText = ''

	  switch (operation) {
		case 'add':
		  const sum = vA.add(vB)
		  resultText = `A + B = ${sum.toString()}`
		  break
		
		case 'subtract':
		  const diff = vA.subtract(vB)
		  resultText = `A - B = ${diff.toString()}`
		  break
		
		case 'dot':
		  const dotProduct = vA.dot(vB)
		  resultText = `A · B = ${dotProduct.toFixed(6)}`
		  break
		
		case 'cross':
		  if (dimension !== 3) {
			throw new Error('Il prodotto vettoriale è definito solo per vettori 3D')
		  }
		  const crossProduct = vA.cross(vB)
		  resultText = `A × B = ${crossProduct.toString()}`
		  break
		
		case 'magnitude':
		  const magA = vA.magnitude()
		  const magB = vB.magnitude()
		  resultText = `|A| = ${magA.toFixed(6)}\n|B| = ${magB.toFixed(6)}`
		  break
		
		case 'normalize':
		  const normA = vA.normalize()
		  const normB = vB.normalize()
		  resultText = `Â = ${normA.toString()}\nB̂ = ${normB.toString()}`
		  break
		
		case 'angle':
		  const angleRad = vA.angleTo(vB)
		  const angleDeg = (angleRad * 180) / Math.PI
		  resultText = `Angolo tra A e B:\n${angleRad.toFixed(6)} radianti\n${angleDeg.toFixed(6)} gradi`
		  break
		
		case 'distance':
		  const distance = vA.distanceTo(vB)
		  resultText = `Distanza tra A e B = ${distance.toFixed(6)}`
		  break
		
		case 'scalar':
		  const scalarMultA = vA.multiplyScalar(scalar)
		  resultText = `${scalar} × A = ${scalarMultA.toString()}`
		  break
		
		default:
		  throw new Error('Operazione non supportata')
	  }

	  setResult(resultText)
	} catch (err) {
	  setError(err instanceof Error ? err.message : 'Errore sconosciuto')
	  setResult('')
	}
  }

  const checkProperties = () => {
	try {
	  const vA = new Vector(vectorA)
	  const vB = new Vector(vectorB)
	  
	  let properties = '🔍 Proprietà dei vettori:\n\n'
	  
	  // Magnitudes
	  properties += `Magnitudo A: ${vA.magnitude().toFixed(6)}\n`
	  properties += `Magnitudo B: ${vB.magnitude().toFixed(6)}\n\n`
	  
	  // Check if parallel
	  properties += `Paralleli: ${vA.isParallelTo(vB) ? 'Sì' : 'No'}\n`
	  
	  // Check if orthogonal
	  properties += `Ortogonali: ${vA.isOrthogonalTo(vB) ? 'Sì' : 'No'}\n\n`
	  
	  // Angle
	  const angle = vA.angleTo(vB)
	  properties += `Angolo: ${angle.toFixed(6)} rad (${(angle * 180 / Math.PI).toFixed(6)}°)\n\n`
	  
	  // Dot product
	  properties += `Prodotto scalare: ${vA.dot(vB).toFixed(6)}\n`
	  
	  // Distance
	  properties += `Distanza: ${vA.distanceTo(vB).toFixed(6)}\n`
	  
	  // Cross product (if 3D)
	  if (dimension === 3) {
		const cross = vA.cross(vB)
		properties += `\nProdotto vettoriale: ${cross.toString()}\n`
		properties += `Magnitudo prodotto vettoriale: ${cross.magnitude().toFixed(6)}`
	  }
	  
	  setResult(properties)
	  setError('')
	} catch (err) {
	  setError(err instanceof Error ? err.message : 'Errore sconosciuto')
	  setResult('')
	}
  }

  const needsVectorB = ['add', 'subtract', 'dot', 'cross', 'angle', 'distance'].includes(operation)
  const needsScalar = operation === 'scalar'

  return (
	<div className="calculator-container">
	  <h2 className="calculator-title">🎯 Calcolatore di Vettori</h2>
	  
	  <div className="input-group">
		<label>Dimensione dei vettori</label>
		<select 
		  value={dimension} 
		  onChange={(e) => updateDimension(parseInt(e.target.value))}
		>
		  <option value={2}>2D</option>
		  <option value={3}>3D</option>
		  <option value={4}>4D</option>
		  <option value={5}>5D</option>
		</select>
	  </div>
	  
	  <div className="input-group">
		<label>Operazione</label>
		<select 
		  value={operation} 
		  onChange={(e) => setOperation(e.target.value as VectorOperation)}
		>
		  <option value="add">Addizione (A + B)</option>
		  <option value="subtract">Sottrazione (A - B)</option>
		  <option value="dot">Prodotto scalare (A · B)</option>
		  {dimension === 3 && <option value="cross">Prodotto vettoriale (A × B)</option>}
		  <option value="magnitude">Magnitudo |A|, |B|</option>
		  <option value="normalize">Normalizzazione</option>
		  <option value="angle">Angolo tra vettori</option>
		  <option value="distance">Distanza tra vettori</option>
		  <option value="scalar">Moltiplicazione scalare</option>
		</select>
	  </div>

	  <div style={{ display: 'grid', gridTemplateColumns: needsVectorB ? '1fr 1fr' : '1fr', gap: '2rem' }}>
		{renderVectorInput(vectorA, 'A')}
		{needsVectorB && renderVectorInput(vectorB, 'B')}
	  </div>

	  {needsScalar && (
		<div className="input-group">
		  <label>Scalare</label>
		  <input
			type="number"
			step="any"
			value={scalar}
			onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
		  />
		</div>
	  )}

	  <div className="btn-group">
		<button className="btn btn-primary" onClick={calculate}>
		  Calcola
		</button>
		<button className="btn btn-success" onClick={checkProperties}>
		  Analizza Proprietà
		</button>
		<button 
		  className="btn btn-secondary" 
		  onClick={() => {
			setVectorA([1, 2, 3].slice(0, dimension).concat(Array(Math.max(0, dimension - 3)).fill(0)))
			setVectorB([4, 5, 6].slice(0, dimension).concat(Array(Math.max(0, dimension - 3)).fill(0)))
			setResult('')
			setError('')
		  }}
		>
		  Reset
		</button>
	  </div>

	  {error && (
		<div className="error">
		  <strong>Errore:</strong> {error}
		</div>
	  )}

	  {result && (
		<div className="result-section">
		  <h3 className="result-title">Risultato</h3>
		  <div className="result-vector">
			<pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
		  </div>
		</div>
	  )}
	  
	  <div style={{ marginTop: '2rem', padding: '1rem', background: '#e8f5e8', borderRadius: '6px', fontSize: '0.9rem' }}>
		<h4 style={{ marginBottom: '1rem', color: '#2e7d32' }}>🎯 Operazioni Vettoriali</h4>
		<ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
		  <li><strong>Prodotto scalare:</strong> A · B = |A||B|cos(θ)</li>
		  <li><strong>Prodotto vettoriale:</strong> |A × B| = |A||B|sin(θ) (solo 3D)</li>
		  <li><strong>Normalizzazione:</strong> Â = A/|A| (vettore unitario)</li>
		  <li><strong>Angolo:</strong> θ = arccos((A·B)/(|A||B|))</li>
		</ul>
	  </div>
	</div>
  )
}

export default VectorCalculator