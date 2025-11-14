import { useState } from 'react'
import { Geometry } from '../utils/Geometry'
import type { Point, Line2D, Line3D, Plane } from '../utils/Geometry'
import { Vector } from '../utils/Vector'

type GeometryOperation = 'point-distance' | 'point-line-2d' | 'point-line-3d' | 'point-plane' | 'triangle-area' | 'tetrahedron-volume' | 'angle-vectors' | 'line-intersection' | 'line-plane-intersection'

const GeometryCalculator = () => {
  const [operation, setOperation] = useState<GeometryOperation>('point-distance')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  
  // Points
  const [point1, setPoint1] = useState<Point>({ x: 0, y: 0, z: 0 })
  const [point2, setPoint2] = useState<Point>({ x: 3, y: 4, z: 0 })
  const [point3, setPoint3] = useState<Point>({ x: 6, y: 0, z: 0 })
  const [point4, setPoint4] = useState<Point>({ x: 0, y: 0, z: 5 })
  
  // Lines
  const [line2D, setLine2D] = useState<Line2D>({
	point: { x: 0, y: 0 },
	direction: new Vector([1, 1])
  })
  
  const [line3D, setLine3D] = useState<Line3D>({
	point: { x: 0, y: 0, z: 0 },
	direction: new Vector([1, 1, 1])
  })
  
  const [line2_2D, setLine2_2D] = useState<Line2D>({
	point: { x: 2, y: 0 },
	direction: new Vector([0, 1])
  })
  
  // Plane
  const [plane, setPlane] = useState<Plane>({
	point: { x: 0, y: 0, z: 0 },
	normal: new Vector([0, 0, 1])
  })
  
  // Vectors for angle calculation
  const [vector1, setVector1] = useState<number[]>([1, 0, 0])
  const [vector2, setVector2] = useState<number[]>([0, 1, 0])

  const updatePoint = (pointSetter: React.Dispatch<React.SetStateAction<Point>>, coord: 'x' | 'y' | 'z', value: string) => {
	const numValue = parseFloat(value) || 0
	pointSetter(prev => ({ ...prev, [coord]: numValue }))
  }

  const updateLinePoint = (lineSetter: React.Dispatch<React.SetStateAction<Line2D | Line3D>>, coord: 'x' | 'y' | 'z', value: string) => {
	const numValue = parseFloat(value) || 0
	lineSetter(prev => ({ 
	  ...prev, 
	  point: { ...prev.point, [coord]: numValue }
	}))
  }

  const updateLineDirection = (lineSetter: React.Dispatch<React.SetStateAction<Line2D | Line3D>>, index: number, value: string, is3D = false) => {
	const numValue = parseFloat(value) || 0
	lineSetter(prev => {
	  const newDirection = [...prev.direction.toArray()]
	  newDirection[index] = numValue
	  return {
		...prev,
		direction: new Vector(newDirection)
	  }
	})
  }

  const updateVector = (vectorSetter: React.Dispatch<React.SetStateAction<number[]>>, index: number, value: string) => {
	const numValue = parseFloat(value) || 0
	vectorSetter(prev => {
	  const newVector = [...prev]
	  newVector[index] = numValue
	  return newVector
	})
  }

  const calculate = () => {
	try {
	  setError('')
	  let resultText = ''

	  switch (operation) {
		case 'point-distance':
		  const distance = Geometry.distancePoints(point1, point2)
		  resultText = `Distanza tra P1(${point1.x}, ${point1.y}${point1.z !== undefined ? ', ' + point1.z : ''}) e P2(${point2.x}, ${point2.y}${point2.z !== undefined ? ', ' + point2.z : ''}):
${distance.toFixed(6)}`
		  break
		
		case 'point-line-2d':
		  const dist2D = Geometry.distancePointToLine2D(point1, line2D)
		  resultText = `Distanza da punto P(${point1.x}, ${point1.y}) alla retta 2D:
${dist2D.toFixed(6)}`
		  break
		
		case 'point-line-3d':
		  const dist3D = Geometry.distancePointToLine3D(point1, line3D)
		  resultText = `Distanza da punto P(${point1.x}, ${point1.y}, ${point1.z}) alla retta 3D:
${dist3D.toFixed(6)}`
		  break
		
		case 'point-plane':
		  const distPlane = Geometry.distancePointToPlane(point1, plane)
		  resultText = `Distanza da punto P(${point1.x}, ${point1.y}, ${point1.z}) al piano:
${distPlane.toFixed(6)}`
		  break
		
		case 'triangle-area':
		  const area = Geometry.triangleArea(point1, point2, point3)
		  resultText = `Area del triangolo con vertici:
P1(${point1.x}, ${point1.y}${point1.z !== undefined ? ', ' + point1.z : ''})
P2(${point2.x}, ${point2.y}${point2.z !== undefined ? ', ' + point2.z : ''})
P3(${point3.x}, ${point3.y}${point3.z !== undefined ? ', ' + point3.z : ''})

Area = ${area.toFixed(6)}`
		  break
		
		case 'tetrahedron-volume':
		  const volume = Geometry.tetrahedronVolume(point1, point2, point3, point4)
		  resultText = `Volume del tetraedro con vertici:
P1(${point1.x}, ${point1.y}, ${point1.z})
P2(${point2.x}, ${point2.y}, ${point2.z})
P3(${point3.x}, ${point3.y}, ${point3.z})
P4(${point4.x}, ${point4.y}, ${point4.z})

Volume = ${volume.toFixed(6)}`
		  break
		
		case 'angle-vectors':
		  const v1 = new Vector(vector1)
		  const v2 = new Vector(vector2)
		  const angleRad = v1.angleTo(v2)
		  const angleDeg = Geometry.angleBetweenVectors(v1, v2)
		  resultText = `Angolo tra vettori:
V1 = ${v1.toString()}
V2 = ${v2.toString()}

Angolo = ${angleRad.toFixed(6)} radianti = ${angleDeg.toFixed(6)}°`
		  break
		
		case 'line-intersection':
		  const intersection = Geometry.intersectLines2D(line2D, line2_2D)
		  if (intersection) {
			resultText = `Intersezione delle rette 2D:
Punto di intersezione: (${intersection.x.toFixed(6)}, ${intersection.y.toFixed(6)})`
		  } else {
			resultText = 'Le rette sono parallele - non si intersecano'
		  }
		  break
		
		case 'line-plane-intersection':
		  const intersectionLP = Geometry.intersectLinePlane(line3D, plane)
		  if (intersectionLP) {
			resultText = `Intersezione retta-piano:
Punto di intersezione: (${intersectionLP.x.toFixed(6)}, ${intersectionLP.y.toFixed(6)}, ${intersectionLP.z?.toFixed(6)})`
		  } else {
			resultText = 'La retta è parallela al piano - non si intersecano'
		  }
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

  const renderPointInput = (point: Point, setter: React.Dispatch<React.SetStateAction<Point>>, label: string, include3D = true) => {
	return (
	  <div className="input-group">
		<label>{label}</label>
		<div className="input-grid" style={{ gridTemplateColumns: include3D ? '1fr 1fr 1fr' : '1fr 1fr', gap: '0.5rem' }}>
		  <div>
			<label style={{ fontSize: '0.8rem' }}>x</label>
			<input
			  type="number"
			  step="any"
			  value={point.x}
			  onChange={(e) => updatePoint(setter, 'x', e.target.value)}
			/>
		  </div>
		  <div>
			<label style={{ fontSize: '0.8rem' }}>y</label>
			<input
			  type="number"
			  step="any"
			  value={point.y}
			  onChange={(e) => updatePoint(setter, 'y', e.target.value)}
			/>
		  </div>
		  {include3D && (
			<div>
			  <label style={{ fontSize: '0.8rem' }}>z</label>
			  <input
				type="number"
				step="any"
				value={point.z || 0}
				onChange={(e) => updatePoint(setter, 'z', e.target.value)}
			  />
			</div>
		  )}
		</div>
	  </div>
	)
  }

  const renderLineInput = (line: Line2D | Line3D, setter: any, label: string, is3D = false) => {
	return (
	  <div className="input-group">
		<label>{label}</label>
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
		  <div>
			<label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Punto sulla retta</label>
			<div className="input-grid" style={{ gridTemplateColumns: is3D ? '1fr 1fr 1fr' : '1fr 1fr', gap: '0.3rem' }}>
			  <input type="number" step="any" value={line.point.x} onChange={(e) => updateLinePoint(setter, 'x', e.target.value)} />
			  <input type="number" step="any" value={line.point.y} onChange={(e) => updateLinePoint(setter, 'y', e.target.value)} />
			  {is3D && <input type="number" step="any" value={line.point.z || 0} onChange={(e) => updateLinePoint(setter, 'z', e.target.value)} />}
			</div>
		  </div>
		  <div>
			<label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Vettore direzione</label>
			<div className="input-grid" style={{ gridTemplateColumns: is3D ? '1fr 1fr 1fr' : '1fr 1fr', gap: '0.3rem' }}>
			  <input type="number" step="any" value={line.direction.get(0)} onChange={(e) => updateLineDirection(setter, 0, e.target.value, is3D)} />
			  <input type="number" step="any" value={line.direction.get(1)} onChange={(e) => updateLineDirection(setter, 1, e.target.value, is3D)} />
			  {is3D && <input type="number" step="any" value={line.direction.get(2)} onChange={(e) => updateLineDirection(setter, 2, e.target.value, is3D)} />}
			</div>
		  </div>
		</div>
	  </div>
	)
  }

  const renderVectorInput = (vector: number[], setter: React.Dispatch<React.SetStateAction<number[]>>, label: string) => {
	return (
	  <div className="input-group">
		<label>{label}</label>
		<div className="input-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
		  {vector.map((value, index) => (
			<div key={index}>
			  <label style={{ fontSize: '0.8rem' }}>{['x', 'y', 'z'][index]}</label>
			  <input
				type="number"
				step="any"
				value={value}
				onChange={(e) => updateVector(setter, index, e.target.value)}
			  />
			</div>
		  ))}
		</div>
	  </div>
	)
  }

  return (
	<div className="calculator-container">
	  <h2 className="calculator-title">📐 Calcolatore di Geometria</h2>
	  
	  <div className="input-group">
		<label>Calcolo geometrico</label>
		<select 
		  value={operation} 
		  onChange={(e) => setOperation(e.target.value as GeometryOperation)}
		>
		  <option value="point-distance">Distanza tra punti</option>
		  <option value="point-line-2d">Distanza punto-retta (2D)</option>
		  <option value="point-line-3d">Distanza punto-retta (3D)</option>
		  <option value="point-plane">Distanza punto-piano</option>
		  <option value="triangle-area">Area del triangolo</option>
		  <option value="tetrahedron-volume">Volume del tetraedro</option>
		  <option value="angle-vectors">Angolo tra vettori</option>
		  <option value="line-intersection">Intersezione rette (2D)</option>
		  <option value="line-plane-intersection">Intersezione retta-piano</option>
		</select>
	  </div>

	  {/* Render inputs based on operation */}
	  {operation === 'point-distance' && (
		<>
		  {renderPointInput(point1, setPoint1, 'Punto 1', true)}
		  {renderPointInput(point2, setPoint2, 'Punto 2', true)}
		</>
	  )}

	  {operation === 'point-line-2d' && (
		<>
		  {renderPointInput(point1, setPoint1, 'Punto', false)}
		  {renderLineInput(line2D, setLine2D, 'Retta 2D', false)}
		</>
	  )}

	  {operation === 'point-line-3d' && (
		<>
		  {renderPointInput(point1, setPoint1, 'Punto', true)}
		  {renderLineInput(line3D, setLine3D, 'Retta 3D', true)}
		</>
	  )}

	  {operation === 'point-plane' && (
		<>
		  {renderPointInput(point1, setPoint1, 'Punto', true)}
		  <div className="input-group">
			<label>Piano</label>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
			  <div>
				<label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Punto sul piano</label>
				<div className="input-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem' }}>
				  <input type="number" step="any" value={plane.point.x} onChange={(e) => setPlane(p => ({ ...p, point: { ...p.point, x: parseFloat(e.target.value) || 0 } }))} />
				  <input type="number" step="any" value={plane.point.y} onChange={(e) => setPlane(p => ({ ...p, point: { ...p.point, y: parseFloat(e.target.value) || 0 } }))} />
				  <input type="number" step="any" value={plane.point.z || 0} onChange={(e) => setPlane(p => ({ ...p, point: { ...p.point, z: parseFloat(e.target.value) || 0 } }))} />
				</div>
			  </div>
			  <div>
				<label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Vettore normale</label>
				<div className="input-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem' }}>
				  <input type="number" step="any" value={plane.normal.get(0)} onChange={(e) => setPlane(p => ({ ...p, normal: new Vector([parseFloat(e.target.value) || 0, p.normal.get(1), p.normal.get(2)]) }))} />
				  <input type="number" step="any" value={plane.normal.get(1)} onChange={(e) => setPlane(p => ({ ...p, normal: new Vector([p.normal.get(0), parseFloat(e.target.value) || 0, p.normal.get(2)]) }))} />
				  <input type="number" step="any" value={plane.normal.get(2)} onChange={(e) => setPlane(p => ({ ...p, normal: new Vector([p.normal.get(0), p.normal.get(1), parseFloat(e.target.value) || 0]) }))} />
				</div>
			  </div>
			</div>
		  </div>
		</>
	  )}

	  {operation === 'triangle-area' && (
		<>
		  {renderPointInput(point1, setPoint1, 'Vertice 1', true)}
		  {renderPointInput(point2, setPoint2, 'Vertice 2', true)}
		  {renderPointInput(point3, setPoint3, 'Vertice 3', true)}
		</>
	  )}

	  {operation === 'tetrahedron-volume' && (
		<>
		  {renderPointInput(point1, setPoint1, 'Vertice 1', true)}
		  {renderPointInput(point2, setPoint2, 'Vertice 2', true)}
		  {renderPointInput(point3, setPoint3, 'Vertice 3', true)}
		  {renderPointInput(point4, setPoint4, 'Vertice 4', true)}
		</>
	  )}

	  {operation === 'angle-vectors' && (
		<>
		  {renderVectorInput(vector1, setVector1, 'Vettore 1')}
		  {renderVectorInput(vector2, setVector2, 'Vettore 2')}
		</>
	  )}

	  {operation === 'line-intersection' && (
		<>
		  {renderLineInput(line2D, setLine2D, 'Retta 1', false)}
		  {renderLineInput(line2_2D, setLine2_2D, 'Retta 2', false)}
		</>
	  )}

	  {operation === 'line-plane-intersection' && (
		<>
		  {renderLineInput(line3D, setLine3D, 'Retta 3D', true)}
		  <div className="input-group">
			<label>Piano</label>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
			  <div>
				<label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Punto sul piano</label>
				<div className="input-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem' }}>
				  <input type="number" step="any" value={plane.point.x} onChange={(e) => setPlane(p => ({ ...p, point: { ...p.point, x: parseFloat(e.target.value) || 0 } }))} />
				  <input type="number" step="any" value={plane.point.y} onChange={(e) => setPlane(p => ({ ...p, point: { ...p.point, y: parseFloat(e.target.value) || 0 } }))} />
				  <input type="number" step="any" value={plane.point.z || 0} onChange={(e) => setPlane(p => ({ ...p, point: { ...p.point, z: parseFloat(e.target.value) || 0 } }))} />
				</div>
			  </div>
			  <div>
				<label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Vettore normale</label>
				<div className="input-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem' }}>
				  <input type="number" step="any" value={plane.normal.get(0)} onChange={(e) => setPlane(p => ({ ...p, normal: new Vector([parseFloat(e.target.value) || 0, p.normal.get(1), p.normal.get(2)]) }))} />
				  <input type="number" step="any" value={plane.normal.get(1)} onChange={(e) => setPlane(p => ({ ...p, normal: new Vector([p.normal.get(0), parseFloat(e.target.value) || 0, p.normal.get(2)]) }))} />
				  <input type="number" step="any" value={plane.normal.get(2)} onChange={(e) => setPlane(p => ({ ...p, normal: new Vector([p.normal.get(0), p.normal.get(1), parseFloat(e.target.value) || 0]) }))} />
				</div>
			  </div>
			</div>
		  </div>
		</>
	  )}

	  <div className="btn-group">
		<button className="btn btn-primary" onClick={calculate}>
		  Calcola
		</button>
		<button 
		  className="btn btn-secondary" 
		  onClick={() => {
			setResult('')
			setError('')
		  }}
		>
		  Pulisci
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
	  
	  <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3e0', borderRadius: '6px', fontSize: '0.9rem' }}>
		<h4 style={{ marginBottom: '1rem', color: '#f57c00' }}>📐 Formule Geometriche</h4>
		<ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
		  <li><strong>Distanza punti:</strong> d = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]</li>
		  <li><strong>Area triangolo:</strong> A = ½|v₁ × v₂| (prodotto vettoriale)</li>
		  <li><strong>Volume tetraedro:</strong> V = ⅙|v₁ · (v₂ × v₃)| (prodotto misto)</li>
		  <li><strong>Distanza punto-piano:</strong> d = |ax₀ + by₀ + cz₀ + d|/√(a² + b² + c²)</li>
		</ul>
	  </div>
	</div>
  )
}

export default GeometryCalculator