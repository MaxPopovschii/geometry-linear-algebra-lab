import { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import MatrixCalculator from './components/MatrixCalculator'
import VectorCalculator from './components/VectorCalculator'
import LinearSystemSolver from './components/LinearSystemSolver'
import GeometryCalculator from './components/GeometryCalculator'

export type CalculatorType = 'matrix' | 'vector' | 'linear-system' | 'geometry'

function App() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('matrix')

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'matrix':
        return <MatrixCalculator />
      case 'vector':
        return <VectorCalculator />
      case 'linear-system':
        return <LinearSystemSolver />
      case 'geometry':
        return <GeometryCalculator />
      default:
        return <MatrixCalculator />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧮 Calcolatore di Geometria e Algebra Lineare</h1>
        <p>Strumenti avanzati per calcoli matematici</p>
      </header>
      
      <Navigation 
        activeCalculator={activeCalculator} 
        onCalculatorChange={setActiveCalculator} 
      />
      
      <main className="app-main">
        {renderCalculator()}
      </main>
      
      <footer className="app-footer">
        <p>© 2025 - Calcolatore Matematico Avanzato</p>
      </footer>
    </div>
  )
}

export default App
