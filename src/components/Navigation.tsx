import type { CalculatorType } from '../App'

interface NavigationProps {
  activeCalculator: CalculatorType
  onCalculatorChange: (calculator: CalculatorType) => void
}

const Navigation = ({ activeCalculator, onCalculatorChange }: NavigationProps) => {
  const calculators = [
    { id: 'matrix' as CalculatorType, label: '📊 Matrici', description: 'Calcoli con matrici' },
    { id: 'vector' as CalculatorType, label: '🎯 Vettori', description: 'Operazioni vettoriali' },
    { id: 'linear-system' as CalculatorType, label: '⚖️ Sistemi Lineari', description: 'MEG e risoluzione' },
    { id: 'geometry' as CalculatorType, label: '📐 Geometria', description: 'Calcoli geometrici' }
  ]

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-buttons">
          {calculators.map((calc) => (
            <button
              key={calc.id}
              className={`nav-btn ${activeCalculator === calc.id ? 'active' : ''}`}
              onClick={() => onCalculatorChange(calc.id)}
              title={calc.description}
            >
              {calc.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation