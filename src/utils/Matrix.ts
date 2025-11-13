export class Matrix {
  private data: number[][];
  public rows: number;
  public cols: number;

  constructor(data: number[][] | number, cols?: number) {
    if (typeof data === 'number') {
      this.rows = data;
      this.cols = cols || data;
      this.data = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
    } else {
      this.data = data.map(row => [...row]); // deep copy
      this.rows = this.data.length;
      this.cols = this.data[0]?.length || 0;
    }
  }

  static identity(size: number): Matrix {
    const matrix = new Matrix(size, size);
    for (let i = 0; i < size; i++) {
      matrix.set(i, i, 1);
    }
    return matrix;
  }

  static fromArray(data: number[][]): Matrix {
    return new Matrix(data);
  }

  get(row: number, col: number): number {
    return this.data[row][col];
  }

  set(row: number, col: number, value: number): void {
    this.data[row][col] = value;
  }

  getRow(row: number): number[] {
    return [...this.data[row]];
  }

  getColumn(col: number): number[] {
    return this.data.map(row => row[col]);
  }

  // Matrix multiplication
  multiply(other: Matrix): Matrix {
    if (this.cols !== other.rows) {
      throw new Error(`Cannot multiply matrices: ${this.rows}x${this.cols} and ${other.rows}x${other.cols}`);
    }

    const result = new Matrix(this.rows, other.cols);
    
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < other.cols; j++) {
        let sum = 0;
        for (let k = 0; k < this.cols; k++) {
          sum += this.get(i, k) * other.get(k, j);
        }
        result.set(i, j, sum);
      }
    }

    return result;
  }

  // Matrix addition
  add(other: Matrix): Matrix {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error(`Cannot add matrices of different dimensions`);
    }

    const result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) + other.get(i, j));
      }
    }
    return result;
  }

  // Matrix subtraction
  subtract(other: Matrix): Matrix {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error(`Cannot subtract matrices of different dimensions`);
    }

    const result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) - other.get(i, j));
      }
    }
    return result;
  }

  // Scalar multiplication
  multiplyScalar(scalar: number): Matrix {
    const result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) * scalar);
      }
    }
    return result;
  }

  // Transpose
  transpose(): Matrix {
    const result = new Matrix(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(j, i, this.get(i, j));
      }
    }
    return result;
  }

  // Determinant (only for square matrices)
  determinant(): number {
    if (this.rows !== this.cols) {
      throw new Error('Determinant can only be calculated for square matrices');
    }

    if (this.rows === 1) {
      return this.get(0, 0);
    }

    if (this.rows === 2) {
      return this.get(0, 0) * this.get(1, 1) - this.get(0, 1) * this.get(1, 0);
    }

    let det = 0;
    for (let j = 0; j < this.cols; j++) {
      const minor = this.getMinor(0, j);
      const cofactor = Math.pow(-1, j) * this.get(0, j) * minor.determinant();
      det += cofactor;
    }

    return det;
  }

  // Get minor matrix (remove specified row and column)
  private getMinor(excludeRow: number, excludeCol: number): Matrix {
    const minorData: number[][] = [];
    
    for (let i = 0; i < this.rows; i++) {
      if (i === excludeRow) continue;
      
      const row: number[] = [];
      for (let j = 0; j < this.cols; j++) {
        if (j === excludeCol) continue;
        row.push(this.get(i, j));
      }
      minorData.push(row);
    }

    return new Matrix(minorData);
  }

  // Matrix inverse using Gauss-Jordan elimination
  inverse(): Matrix {
    if (this.rows !== this.cols) {
      throw new Error('Inverse can only be calculated for square matrices');
    }

    const n = this.rows;
    const det = this.determinant();
    
    if (Math.abs(det) < 1e-10) {
      throw new Error('Matrix is not invertible (determinant = 0)');
    }

    // Create augmented matrix [A | I]
    const augmented = new Matrix(n, 2 * n);
    
    // Copy original matrix to left side
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        augmented.set(i, j, this.get(i, j));
      }
    }
    
    // Add identity matrix to right side
    for (let i = 0; i < n; i++) {
      augmented.set(i, i + n, 1);
    }

    // Gauss-Jordan elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented.get(k, i)) > Math.abs(augmented.get(maxRow, i))) {
          maxRow = k;
        }
      }

      // Swap rows
      if (maxRow !== i) {
        for (let j = 0; j < 2 * n; j++) {
          const temp = augmented.get(i, j);
          augmented.set(i, j, augmented.get(maxRow, j));
          augmented.set(maxRow, j, temp);
        }
      }

      // Scale pivot row
      const pivot = augmented.get(i, i);
      for (let j = 0; j < 2 * n; j++) {
        augmented.set(i, j, augmented.get(i, j) / pivot);
      }

      // Eliminate column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented.get(k, i);
          for (let j = 0; j < 2 * n; j++) {
            augmented.set(k, j, augmented.get(k, j) - factor * augmented.get(i, j));
          }
        }
      }
    }

    // Extract inverse matrix from right side
    const inverse = new Matrix(n, n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        inverse.set(i, j, augmented.get(i, j + n));
      }
    }

    return inverse;
  }

  // Convert to array format
  toArray(): number[][] {
    return this.data.map(row => [...row]);
  }

  // String representation
  toString(): string {
    return this.data.map(row => 
      '[' + row.map(val => val.toFixed(3)).join(', ') + ']'
    ).join('\n');
  }

  // Clone matrix
  clone(): Matrix {
    return new Matrix(this.data);
  }
}