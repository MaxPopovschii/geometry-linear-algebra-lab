import { useState } from 'react'
import { Matrix } from '../utils/Matrix'

type MatrixOperation = 'multiply' | 'add' | 'subtract' | 'inverse' | 'determinant' | 'transpose' | 'scalar'

const MatrixCalculator = () => {
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 2], [3, 4]])
  const [matrixB, setMatrixB] = useState<number[][]>([[5, 6], [7, 8]])
  const [scalar, setScalar] = useState<number>(2)
  const [operation, setOperation] = useState<MatrixOperation>('multiply')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [dimensionsA, setDimensionsA] = useState({ rows: 2, cols: 2 })
  const [dimensionsB, setDimensionsB] = useState({ rows: 2, cols: 2 })

  const updateMatrixDimensions = (matrix: 'A' | 'B', rows: number, cols: number) => {
    if (matrix === 'A') {
      setDimensionsA({ rows, cols })
      const newMatrix = Array(rows).fill(0).map((_, i) => 
        Array(cols).fill(0).map((_, j) => matrixA[i]?.[j] || 0)
      )
      setMatrixA(newMatrix)
    } else {
      setDimensionsB({ rows, cols })
      const newMatrix = Array(rows).fill(0).map((_, i) => 
        Array(cols).fill(0).map((_, j) => matrixB[i]?.[j] || 0)
      )
      setMatrixB(newMatrix)
    }
  }

  const updateMatrixValue = (matrix: 'A' | 'B', row: number, col: number, value: string) => {
    const numValue = parseFloat(value) || 0
    
    if (matrix === 'A') {
      const newMatrix = [...matrixA]
      newMatrix[row][col] = numValue
      setMatrixA(newMatrix)
    } else {
      const newMatrix = [...matrixB]
      newMatrix[row][col] = numValue
      setMatrixB(newMatrix)
    }
  }

  const renderMatrixInput = (matrix: number[][], matrixName: 'A' | 'B') => {
    const dimensions = matrixName === 'A' ? dimensionsA : dimensionsB
    
    return (
      <div className="input-group">
        <label>Matrice {matrixName}</label>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>
            Righe: 
            <select 
              value={dimensions.rows} 
              onChange={(e) => updateMatrixDimensions(matrixName, parseInt(e.target.value), dimensions.cols)}
              style={{ marginLeft: '0.5rem', width: '60px' }}
            >
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label>
            Colonne: 
            <select 
              value={dimensions.cols} 
              onChange={(e) => updateMatrixDimensions(matrixName, dimensions.rows, parseInt(e.target.value))}
              style={{ marginLeft: '0.5rem', width: '60px' }}
            >
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
        <div 
          className="input-grid"
          style={{ 
            gridTemplateColumns: `repeat(${dimensions.cols}, 1fr)`,
            gap: '0.5rem'
          }}
        >
          {matrix.map((row, i) => 
            row.map((value, j) => (
              <input
                key={`${i}-${j}`}
                type="number"
                step="any"
                className="matrix-input"
                value={value}
                onChange={(e) => updateMatrixValue(matrixName, i, j, e.target.value)}
              />
            ))
          )}
        </div>
      </div>
    )
  }

  const calculate = () => {
    try {
      setError('')
      const A = new Matrix(matrixA)
      const B = new Matrix(matrixB)
      let resultMatrix: Matrix | number
      let resultText = ''

      switch (operation) {
        case 'multiply':
          resultMatrix = A.multiply(B)
          resultText = `A × B =\n${resultMatrix.toString()}`
          break
        
        case 'add':
          resultMatrix = A.add(B)
          resultText = `A + B =\n${resultMatrix.toString()}`
          break
        
        case 'subtract':
          resultMatrix = A.subtract(B)
          resultText = `A - B =\n${resultMatrix.toString()}`
          break
        
        case 'inverse':
          resultMatrix = A.inverse()
          resultText = `A⁻¹ =\n${resultMatrix.toString()}`
          break
        
        case 'determinant':
          resultMatrix = A.determinant()
          resultText = `det(A) = ${resultMatrix.toFixed(6)}`
          break
        
        case 'transpose':
          resultMatrix = A.transpose()
          resultText = `Aᵀ =\n${resultMatrix.toString()}`
          break
        
        case 'scalar':
          resultMatrix = A.multiplyScalar(scalar)
          resultText = `${scalar} × A =\n${resultMatrix.toString()}`
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

  const needsMatrixB = ['multiply', 'add', 'subtract'].includes(operation)
  const needsScalar = operation === 'scalar'

  return (
    <div className="calculator-container">
      <h2 className="calculator-title">📊 Calcolatore di Matrici</h2>
      
      <div className="input-group">
        <label>Operazione</label>
        <select 
          value={operation} 
          onChange={(e) => setOperation(e.target.value as MatrixOperation)}
        >
          <option value="multiply">Moltiplicazione (A × B)</option>
          <option value="add">Addizione (A + B)</option>
          <option value="subtract">Sottrazione (A - B)</option>
          <option value="scalar">Moltiplicazione scalare</option>
          <option value="inverse">Inversa (A⁻¹)</option>
          <option value="determinant">Determinante</option>
          <option value="transpose">Trasposta (Aᵀ)</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: needsMatrixB ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        {renderMatrixInput(matrixA, 'A')}
        {needsMatrixB && renderMatrixInput(matrixB, 'B')}
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
        <button 
          className="btn btn-secondary" 
          onClick={() => {
            setMatrixA([[1, 2], [3, 4]])
            setMatrixB([[5, 6], [7, 8]])
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
          <div className="result-matrix">{result}</div>
        </div>
      )}
    </div>
  )
}

export default MatrixCalculator