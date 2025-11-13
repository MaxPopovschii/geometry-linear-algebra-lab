import { Vector } from './Vector';

export interface Point {
  x: number;
  y: number;
  z?: number;
}

export interface Line2D {
  point: Point;
  direction: Vector;
}

export interface Line3D {
  point: Point;
  direction: Vector;
}

export interface Plane {
  point: Point;
  normal: Vector;
}

export class Geometry {
  // Distance between two points
  static distancePoints(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = (p2.z || 0) - (p1.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // Distance from point to line in 2D
  static distancePointToLine2D(point: Point, line: Line2D): number {
    const { point: linePoint, direction } = line;
    
    // Vector from line point to given point
    const pointVector = new Vector([point.x - linePoint.x, point.y - linePoint.y]);
    
    // Project pointVector onto direction
    const projection = pointVector.projectOnto(direction);
    
    // Distance is the magnitude of the perpendicular component
    return pointVector.subtract(projection).magnitude();
  }

  // Distance from point to line in 3D
  static distancePointToLine3D(point: Point, line: Line3D): number {
    const { point: linePoint, direction } = line;
    
    // Vector from line point to given point
    const pointVector = new Vector([
      point.x - linePoint.x, 
      point.y - linePoint.y, 
      (point.z || 0) - (linePoint.z || 0)
    ]);
    
    // Cross product gives area of parallelogram
    const cross = pointVector.cross(direction);
    
    // Distance = area / base = |cross| / |direction|
    return cross.magnitude() / direction.magnitude();
  }

  // Distance from point to plane
  static distancePointToPlane(point: Point, plane: Plane): number {
    const { point: planePoint, normal } = plane;
    
    // Vector from plane point to given point
    const pointVector = new Vector([
      point.x - planePoint.x,
      point.y - planePoint.y,
      (point.z || 0) - (planePoint.z || 0)
    ]);
    
    // Distance is absolute value of projection onto normal
    const normalizedNormal = normal.normalize();
    return Math.abs(pointVector.dot(normalizedNormal));
  }

  // Angle between two vectors (in degrees)
  static angleBetweenVectors(v1: Vector, v2: Vector): number {
    const radians = v1.angleTo(v2);
    return (radians * 180) / Math.PI;
  }

  // Area of triangle given three points
  static triangleArea(p1: Point, p2: Point, p3: Point): number {
    if (p1.z !== undefined || p2.z !== undefined || p3.z !== undefined) {
      // 3D case
      const v1 = new Vector([p2.x - p1.x, p2.y - p1.y, (p2.z || 0) - (p1.z || 0)]);
      const v2 = new Vector([p3.x - p1.x, p3.y - p1.y, (p3.z || 0) - (p1.z || 0)]);
      return 0.5 * v1.cross(v2).magnitude();
    } else {
      // 2D case
      return 0.5 * Math.abs(
        (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y)
      );
    }
  }

  // Volume of tetrahedron given four points
  static tetrahedronVolume(p1: Point, p2: Point, p3: Point, p4: Point): number {
    const v1 = new Vector([p2.x - p1.x, p2.y - p1.y, (p2.z || 0) - (p1.z || 0)]);
    const v2 = new Vector([p3.x - p1.x, p3.y - p1.y, (p3.z || 0) - (p1.z || 0)]);
    const v3 = new Vector([p4.x - p1.x, p4.y - p1.y, (p4.z || 0) - (p1.z || 0)]);
    
    // Volume = |v1 · (v2 × v3)| / 6
    const cross = v2.cross(v3);
    return Math.abs(v1.dot(cross)) / 6;
  }

  // Check if three points are collinear
  static areCollinear(p1: Point, p2: Point, p3: Point): boolean {
    const v1 = new Vector([p2.x - p1.x, p2.y - p1.y, (p2.z || 0) - (p1.z || 0)]);
    const v2 = new Vector([p3.x - p1.x, p3.y - p1.y, (p3.z || 0) - (p1.z || 0)]);
    
    if (v1.length === 2) {
      // 2D case: check if cross product is zero
      return Math.abs((p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y)) < 1e-10;
    } else {
      // 3D case: check if cross product magnitude is zero
      return v1.cross(v2).magnitude() < 1e-10;
    }
  }

  // Find intersection of two lines in 2D
  static intersectLines2D(line1: Line2D, line2: Line2D): Point | null {
    const { point: p1, direction: d1 } = line1;
    const { point: p2, direction: d2 } = line2;
    
    // Check if lines are parallel
    const det = d1.get(0) * d2.get(1) - d1.get(1) * d2.get(0);
    if (Math.abs(det) < 1e-10) {
      return null; // Lines are parallel
    }
    
    // Solve for intersection parameter
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    
    const t = (dx * d2.get(1) - dy * d2.get(0)) / det;
    
    return {
      x: p1.x + t * d1.get(0),
      y: p1.y + t * d1.get(1)
    };
  }

  // Find intersection of line and plane
  static intersectLinePlane(line: Line3D, plane: Plane): Point | null {
    const { point: linePoint, direction } = line;
    const { point: planePoint, normal } = plane;
    
    // Check if line is parallel to plane
    const denominator = direction.dot(normal);
    if (Math.abs(denominator) < 1e-10) {
      return null; // Line is parallel to plane
    }
    
    // Vector from line point to plane point
    const w = new Vector([
      planePoint.x - linePoint.x,
      planePoint.y - linePoint.y,
      (planePoint.z || 0) - (linePoint.z || 0)
    ]);
    
    // Calculate parameter t
    const t = w.dot(normal) / denominator;
    
    return {
      x: linePoint.x + t * direction.get(0),
      y: linePoint.y + t * direction.get(1),
      z: (linePoint.z || 0) + t * direction.get(2)
    };
  }

  // Check if point is inside triangle (2D)
  static isPointInTriangle2D(point: Point, p1: Point, p2: Point, p3: Point): boolean {
    // Use barycentric coordinates
    const denom = (p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y);
    
    if (Math.abs(denom) < 1e-10) {
      return false; // Degenerate triangle
    }
    
    const a = ((p2.y - p3.y) * (point.x - p3.x) + (p3.x - p2.x) * (point.y - p3.y)) / denom;
    const b = ((p3.y - p1.y) * (point.x - p3.x) + (p1.x - p3.x) * (point.y - p3.y)) / denom;
    const c = 1 - a - b;
    
    return a >= 0 && b >= 0 && c >= 0;
  }

  // Calculate circumcenter of triangle
  static circumcenter(p1: Point, p2: Point, p3: Point): Point {
    const ax = p1.x, ay = p1.y;
    const bx = p2.x, by = p2.y;
    const cx = p3.x, cy = p3.y;
    
    const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
    
    if (Math.abs(d) < 1e-10) {
      throw new Error('Points are collinear - no circumcenter exists');
    }
    
    const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
    const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
    
    return { x: ux, y: uy };
  }

  // Calculate centroid of triangle
  static centroid(p1: Point, p2: Point, p3: Point): Point {
    return {
      x: (p1.x + p2.x + p3.x) / 3,
      y: (p1.y + p2.y + p3.y) / 3,
      z: p1.z !== undefined ? ((p1.z || 0) + (p2.z || 0) + (p3.z || 0)) / 3 : undefined
    };
  }

  // Reflection of point across a line (2D)
  static reflectPointAcrossLine2D(point: Point, line: Line2D): Point {
    const { point: linePoint, direction } = line;
    
    // Get normal to the line
    const normal = new Vector([-direction.get(1), direction.get(0)]);
    const normalizedNormal = normal.normalize();
    
    // Vector from line point to given point
    const pointVector = new Vector([point.x - linePoint.x, point.y - linePoint.y]);
    
    // Distance from point to line (signed)
    const distance = pointVector.dot(normalizedNormal);
    
    // Reflect by moving twice the distance in the opposite direction
    const reflection = normalizedNormal.multiplyScalar(-2 * distance);
    
    return {
      x: point.x + reflection.get(0),
      y: point.y + reflection.get(1)
    };
  }

  // Rotation of point around origin (2D)
  static rotatePoint2D(point: Point, angle: number): Point {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    return {
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos
    };
  }
}