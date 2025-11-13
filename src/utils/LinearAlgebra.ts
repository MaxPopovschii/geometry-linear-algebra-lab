import { Matrix } from './Matrix';

export interface LinearSystemSolution {
  solution?: number[];
  isUnique: boolean;
  hasInfiniteSolutions: boolean;
  hasNoSolution: boolean;
  steps: string[];
}

export class LinearAlgebra {
  // Gaussian elimination with partial pivoting
  static gaussianElimination(coefficients: number[][], constants: number[]): LinearSystemSolution {
    const n = coefficients.length;
    const steps: string[] = [];
    
    // Create augmented matrix
    const augmented: number[][] = coefficients.map((row, i) => [...row, constants[i]]);
    
    steps.push(`Matrice aumentata iniziale:\n${this.formatMatrix(augmented)}`);

    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }

      // Swap rows if needed
      if (maxRow !== i) {
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
        steps.push(`Scambio righe ${i + 1} e ${maxRow + 1}:\n${this.formatMatrix(augmented)}`);
      }

      // Check for zero pivot
      if (Math.abs(augmented[i][i]) < 1e-10) {
        steps.push(`Pivot nullo nella posizione [${i + 1}, ${i + 1}]`);
        continue;
      }

      // Make pivot = 1
      const pivot = augmented[i][i];
      for (let j = 0; j <= n; j++) {
        augmented[i][j] /= pivot;
      }
      steps.push(`Normalizzazione riga ${i + 1} (divide per ${pivot.toFixed(3)}):\n${this.formatMatrix(augmented)}`);

      // Eliminate column
      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i];
        if (Math.abs(factor) > 1e-10) {
          for (let j = 0; j <= n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
          steps.push(`Eliminazione: R${k + 1} = R${k + 1} - ${factor.toFixed(3)} * R${i + 1}:\n${this.formatMatrix(augmented)}`);
        }
      }
    }

    // Check for inconsistency or infinite solutions
    for (let i = n - 1; i >= 0; i--) {
      let allZero = true;
      for (let j = 0; j < n; j++) {
        if (Math.abs(augmented[i][j]) > 1e-10) {
          allZero = false;
          break;
        }
      }
      
      if (allZero) {
        if (Math.abs(augmented[i][n]) > 1e-10) {
          return {
            isUnique: false,
            hasInfiniteSolutions: false,
            hasNoSolution: true,
            steps: [...steps, 'Sistema inconsistente: 0 = ' + augmented[i][n].toFixed(3)]
          };
        } else {
          return {
            isUnique: false,
            hasInfiniteSolutions: true,
            hasNoSolution: false,
            steps: [...steps, 'Sistema con infinite soluzioni']
          };
        }
      }
    }

    // Back substitution
    const solution: number[] = new Array(n).fill(0);
    
    for (let i = n - 1; i >= 0; i--) {
      solution[i] = augmented[i][n];
      for (let j = i + 1; j < n; j++) {
        solution[i] -= augmented[i][j] * solution[j];
      }
      steps.push(`x${i + 1} = ${solution[i].toFixed(6)}`);
    }

    return {
      solution,
      isUnique: true,
      hasInfiniteSolutions: false,
      hasNoSolution: false,
      steps
    };
  }

  // LU Decomposition
  static luDecomposition(matrix: Matrix): { L: Matrix; U: Matrix; P?: Matrix } {
    if (matrix.rows !== matrix.cols) {
      throw new Error('LU decomposition requires a square matrix');
    }

    const n = matrix.rows;
    const L = Matrix.identity(n);
    const U = matrix.clone();

    // Gaussian elimination to form U, store multipliers in L
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(U.get(i, i)) < 1e-10) {
          throw new Error('Matrix requires pivoting for LU decomposition');
        }
        
        const factor = U.get(j, i) / U.get(i, i);
        L.set(j, i, factor);
        
        for (let k = i; k < n; k++) {
          U.set(j, k, U.get(j, k) - factor * U.get(i, k));
        }
      }
    }

    return { L, U };
  }

  // QR Decomposition using Gram-Schmidt
  static qrDecomposition(matrix: Matrix): { Q: Matrix; R: Matrix } {
    const m = matrix.rows;
    const n = matrix.cols;
    
    const Q = new Matrix(m, n);
    const R = new Matrix(n, n);

    for (let j = 0; j < n; j++) {
      // Get column j
      let v = matrix.getColumn(j);
      
      // Orthogonalization
      for (let i = 0; i < j; i++) {
        const qi = Q.getColumn(i);
        const projection = this.vectorDot(qi, v);
        R.set(i, j, projection);
        
        for (let k = 0; k < m; k++) {
          v[k] -= projection * qi[k];
        }
      }
      
      // Normalization
      const norm = Math.sqrt(this.vectorDot(v, v));
      R.set(j, j, norm);
      
      if (norm > 1e-10) {
        for (let k = 0; k < m; k++) {
          Q.set(k, j, v[k] / norm);
        }
      }
    }

    return { Q, R };
  }

  // Eigenvalues using power iteration (for dominant eigenvalue)
  static powerIteration(matrix: Matrix, maxIterations = 1000, tolerance = 1e-10): { eigenvalue: number; eigenvector: number[] } {
    if (matrix.rows !== matrix.cols) {
      throw new Error('Eigenvalue calculation requires a square matrix');
    }

    const n = matrix.rows;
    let x = Array(n).fill(1); // Initial vector
    let eigenvalue = 0;

    for (let iter = 0; iter < maxIterations; iter++) {
      // Matrix-vector multiplication: y = A * x
      const y: number[] = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          y[i] += matrix.get(i, j) * x[j];
        }
      }

      // Find the largest component (in absolute value)
      const newEigenvalue = y.reduce((max, val) => Math.abs(val) > Math.abs(max) ? val : max, y[0]);
      
      // Normalize
      for (let i = 0; i < n; i++) {
        y[i] /= newEigenvalue;
      }

      // Check convergence
      if (Math.abs(newEigenvalue - eigenvalue) < tolerance) {
        return { eigenvalue: newEigenvalue, eigenvector: y };
      }

      eigenvalue = newEigenvalue;
      x = y;
    }

    throw new Error('Power iteration did not converge');
  }

  // Helper method for vector dot product
  private static vectorDot(v1: number[], v2: number[]): number {
    return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  }

  // Format matrix for display
  private static formatMatrix(matrix: number[][]): string {
    return matrix.map(row => 
      '[' + row.map(val => val.toFixed(3).padStart(8)).join(' ') + ']'
    ).join('\n');
  }

  // Calculate matrix rank
  static rank(matrix: Matrix): number {
    const m = matrix.rows;
    const n = matrix.cols;
    const mat = matrix.clone();
    
    let rank = 0;
    const tolerance = 1e-10;

    for (let col = 0, row = 0; col < n && row < m; col++) {
      // Find pivot
      let pivotRow = row;
      for (let i = row + 1; i < m; i++) {
        if (Math.abs(mat.get(i, col)) > Math.abs(mat.get(pivotRow, col))) {
          pivotRow = i;
        }
      }

      if (Math.abs(mat.get(pivotRow, col)) < tolerance) {
        continue; // Skip this column
      }

      // Swap rows
      if (pivotRow !== row) {
        for (let j = 0; j < n; j++) {
          const temp = mat.get(row, j);
          mat.set(row, j, mat.get(pivotRow, j));
          mat.set(pivotRow, j, temp);
        }
      }

      // Eliminate
      for (let i = row + 1; i < m; i++) {
        const factor = mat.get(i, col) / mat.get(row, col);
        for (let j = col; j < n; j++) {
          mat.set(i, j, mat.get(i, j) - factor * mat.get(row, j));
        }
      }

      rank++;
      row++;
    }

    return rank;
  }
}