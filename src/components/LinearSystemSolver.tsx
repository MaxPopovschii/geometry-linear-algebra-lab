import { useState } from 'react'
import { LinearAlgebra, type LinearSystemSolution } from '../utils/LinearAlgebra'

const LinearSystemSolver = () => {
  const [systemSize, setSystemSize] = useState(3)
  const [coefficients, setCoefficients] = useState<number[][]>([
	[2, 1, -1],
	[-3, -1, 2],
	[-2, 1, 2]
  ])
  const [constants, setConstants] = useState<number[]>([8, -11, -3])
  const [solution, setSolution] = useState<LinearSystemSolution | null>(null)
  const [showSteps, setShowSteps] = useState(false)

  const updateSystemSize = (size: number) => {
	setSystemSize(size)
	
	// Update coefficients matrix
	const newCoefficients = Array(size).fill(0).map((_, i) => 
	  Array(size).fill(0).map((_, j) => coefficients[i]?.[j] || 0)
	)
	setCoefficients(newCoefficients)
	
	// Update constants vector
	const newConstants = Array(size).fill(0).map((_, i) => constants[i] || 0)
	setConstants(newConstants)
  }

  const updateCoefficient = (row: number, col: number, value: string) => {
	const numValue = parseFloat(value) || 0
	const newCoefficients = [...coefficients]
	newCoefficients[row][col] = numValue
	setCoefficients(newCoefficients)
  }

  const updateConstant = (index: number, value: string) => {
	const numValue = parseFloat(value) || 0
	const newConstants = [...constants]
	newConstants[index] = numValue
	setConstants(newConstants)
  }

  const solve = () => {
	try {
	  const result = LinearAlgebra.gaussianElimination(coefficients, constants)
	  setSolution(result)
	} catch (error) {
	  setSolution({
		isUnique: false,
		hasInfiniteSolutions: false,
		hasNoSolution: true,
		steps: [error instanceof Error ? error.message : 'Errore sconosciuto']
	  })
	}
  }

  const renderSystemInput = () => {
	return (
	  <div className="input-group">
		<label>Sistema di Equazioni Lineari</label>
		<div style={{ marginBottom: '1rem' }}>
		  <label>
			Dimensione sistema: 
			<select 
			  value={systemSize} 
			  onChange={(e) => updateSystemSize(parseInt(e.target.value))}
			  style={{ marginLeft: '0.5rem', width: '60px' }}
			>
			  {[2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
			</select>
		  </label>
		</div>
		
		<div style={{ overflowX: 'auto' }}>
		  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0.5rem' }}>
			<thead>
			  <tr>
				{Array(systemSize).fill(0).map((_, i) => (
				  <th key={i} style={{ textAlign: 'center' }}>x{i + 1}</th>
				))}
				<th></th>
				<th>b</th>
			  </tr>
			</thead>
			<tbody>
			  {coefficients.map((row, i) => (
				<tr key={i}>
				  {row.map((value, j) => (
					<td key={j}>
					  <input
						type="number"
						step="any"
						className="matrix-input"
						value={value}
						onChange={(e) => updateCoefficient(i, j, e.target.value)}
						style={{ width: '80px' }}
					  />
					</td>
				  ))}
				  <td style={{ textAlign: 'center', fontSize: '1.2rem' }}>=</td>
				  <td>
					<input
					  type="number"
					  step="any"
					  className="matrix-input"
					  value={constants[i]}
					  onChange={(e) => updateConstant(i, e.target.value)}
					  style={{ width: '80px' }}
					/>
				  </td>
				</tr>
			  ))}
			</tbody>
		  </table>
		</div>
	  </div>
	)
  }

  const renderSolution = () => {
	if (!solution) return null

	return (
	  <div className="result-section">
		<h3 className="result-title">Soluzione del Sistema</h3>
		
		{solution.hasNoSolution && (
		  <div className="error">
			<strong>Sistema inconsistente:</strong> Non esistono soluzioni.
		  </div>
		)}
		
		{solution.hasInfiniteSolutions && (
		  <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
			<strong>Sistema indeterminato:</strong> Infinite soluzioni.
		  </div>
		)}
		
		{solution.isUnique && solution.solution && (
		  <div>
			<h4>Soluzione unica:</h4>
			<div className="result-vector">
			  {solution.solution.map((value, index) => (
				<div key={index} style={{ marginBottom: '0.5rem' }}>
				  <strong>x{index + 1} = {value.toFixed(6)}</strong>
				</div>
			  ))}
			</div>
		  </div>
		)}
		
		<div style={{ marginTop: '1rem' }}>
		  <label style={{ display: 'flex', alignItems: 'center' }}>
			<input
			  type="checkbox"
			  checked={showSteps}
			  onChange={(e) => setShowSteps(e.target.checked)}
			  style={{ marginRight: '0.5rem' }}
			/>
			Mostra passaggi dettagliati
		  </label>
		</div>
		
		{showSteps && solution.steps.length > 0 && (
		  <div className="steps-container" style={{ marginTop: '1rem' }}>
			<h4>Passaggi della risoluzione (MEG):</h4>
			{solution.steps.map((step, index) => (
			  <div key={index} className="step">
				<div style={{ marginBottom: '0.5rem' }}>
				  <strong>Passo {index + 1}:</strong>
				</div>
				<pre style={{ 
				  whiteSpace: 'pre-wrap', 
				  fontFamily: 'Courier New, monospace', 
				  background: '#f8f9fa', 
				  padding: '0.5rem', 
				  borderRadius: '4px',
				  fontSize: '0.9rem'
				}}>
				  {step}
				</pre>
			  </div>
			))}
		  </div>
		)}
	  </div>
	)
  }

  return (
	<div className="calculator-container">
	  <h2 className="calculator-title">⚖️ Risolutore di Sistemi Lineari</h2>
	  <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
		Risolve sistemi di equazioni lineari usando il Metodo di Eliminazione di Gauss (MEG)
	  </p>
	  
	  {renderSystemInput()}

	  <div className="btn-group" style={{ marginTop: '1.5rem' }}>
		<button className="btn btn-primary" onClick={solve}>
		  Risolvi Sistema
		</button>
		<button 
		  className="btn btn-secondary" 
		  onClick={() => {
			updateSystemSize(3)
			setCoefficients([
			  [2, 1, -1],
			  [-3, -1, 2],
			  [-2, 1, 2]
			])
			setConstants([8, -11, -3])
			setSolution(null)
			setShowSteps(false)
		  }}
		>
		  Esempio
		</button>
		<button 
		  className="btn btn-danger" 
		  onClick={() => {
			setSolution(null)
			setShowSteps(false)
		  }}
		>
		  Pulisci Risultati
		</button>
	  </div>

	  {renderSolution()}
	  
	  <div style={{ marginTop: '2rem', padding: '1rem', background: '#e3f2fd', borderRadius: '6px', fontSize: '0.9rem' }}>
		<h4 style={{ marginBottom: '1rem', color: '#1976d2' }}>ℹ️ Informazioni sul MEG</h4>
		<p><strong>Metodo di Eliminazione di Gauss:</strong></p>
		<ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
		  <li>Trasforma il sistema in forma triangolare superiore</li>
		  <li>Usa la sostituzione all'indietro per trovare le soluzioni</li>
		  <li>Rileva automaticamente sistemi inconsistenti o indeterminati</li>
		  <li>Mostra tutti i passaggi della risoluzione</li>
		</ul>
	  </div>
	</div>
  )
}

export default LinearSystemSolver