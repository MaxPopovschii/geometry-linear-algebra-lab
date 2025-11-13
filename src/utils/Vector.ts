export class Vector {
  private data: number[];

  constructor(data: number[] | number) {
    if (typeof data === 'number') {
      this.data = Array(data).fill(0);
    } else {
      this.data = [...data]; // deep copy
    }
  }

  static fromArray(data: number[]): Vector {
    return new Vector(data);
  }

  static zero(dimension: number): Vector {
    return new Vector(dimension);
  }

  static unit(dimension: number, index: number): Vector {
    const vector = Vector.zero(dimension);
    vector.set(index, 1);
    return vector;
  }

  get length(): number {
    return this.data.length;
  }

  get(index: number): number {
    return this.data[index];
  }

  set(index: number, value: number): void {
    this.data[index] = value;
  }

  // Vector addition
  add(other: Vector): Vector {
    if (this.length !== other.length) {
      throw new Error('Vectors must have the same dimension for addition');
    }

    const result = new Vector(this.length);
    for (let i = 0; i < this.length; i++) {
      result.set(i, this.get(i) + other.get(i));
    }
    return result;
  }

  // Vector subtraction
  subtract(other: Vector): Vector {
    if (this.length !== other.length) {
      throw new Error('Vectors must have the same dimension for subtraction');
    }

    const result = new Vector(this.length);
    for (let i = 0; i < this.length; i++) {
      result.set(i, this.get(i) - other.get(i));
    }
    return result;
  }

  // Scalar multiplication
  multiplyScalar(scalar: number): Vector {
    const result = new Vector(this.length);
    for (let i = 0; i < this.length; i++) {
      result.set(i, this.get(i) * scalar);
    }
    return result;
  }

  // Dot product
  dot(other: Vector): number {
    if (this.length !== other.length) {
      throw new Error('Vectors must have the same dimension for dot product');
    }

    let sum = 0;
    for (let i = 0; i < this.length; i++) {
      sum += this.get(i) * other.get(i);
    }
    return sum;
  }

  // Cross product (only for 3D vectors)
  cross(other: Vector): Vector {
    if (this.length !== 3 || other.length !== 3) {
      throw new Error('Cross product is only defined for 3D vectors');
    }

    const result = new Vector(3);
    result.set(0, this.get(1) * other.get(2) - this.get(2) * other.get(1));
    result.set(1, this.get(2) * other.get(0) - this.get(0) * other.get(2));
    result.set(2, this.get(0) * other.get(1) - this.get(1) * other.get(0));

    return result;
  }

  // Vector magnitude (norm)
  magnitude(): number {
    return Math.sqrt(this.dot(this));
  }

  // Normalize vector
  normalize(): Vector {
    const mag = this.magnitude();
    if (mag === 0) {
      throw new Error('Cannot normalize zero vector');
    }
    return this.multiplyScalar(1 / mag);
  }

  // Distance to another vector
  distanceTo(other: Vector): number {
    return this.subtract(other).magnitude();
  }

  // Angle between vectors (in radians)
  angleTo(other: Vector): number {
    const dot = this.dot(other);
    const mag1 = this.magnitude();
    const mag2 = other.magnitude();
    
    if (mag1 === 0 || mag2 === 0) {
      throw new Error('Cannot calculate angle with zero vector');
    }

    const cosTheta = dot / (mag1 * mag2);
    // Clamp to avoid numerical errors
    const clampedCos = Math.max(-1, Math.min(1, cosTheta));
    return Math.acos(clampedCos);
  }

  // Check if vectors are parallel
  isParallelTo(other: Vector): boolean {
    if (this.length !== other.length) {
      return false;
    }

    const thisNorm = this.normalize();
    const otherNorm = other.normalize();
    const dot = Math.abs(thisNorm.dot(otherNorm));
    
    return Math.abs(dot - 1) < 1e-10;
  }

  // Check if vectors are orthogonal
  isOrthogonalTo(other: Vector): boolean {
    return Math.abs(this.dot(other)) < 1e-10;
  }

  // Project this vector onto another vector
  projectOnto(other: Vector): Vector {
    const otherMagSquared = other.dot(other);
    if (otherMagSquared === 0) {
      throw new Error('Cannot project onto zero vector');
    }

    const scalar = this.dot(other) / otherMagSquared;
    return other.multiplyScalar(scalar);
  }

  // Convert to array
  toArray(): number[] {
    return [...this.data];
  }

  // String representation
  toString(): string {
    return '[' + this.data.map(val => val.toFixed(3)).join(', ') + ']';
  }

  // Clone vector
  clone(): Vector {
    return new Vector(this.data);
  }
}