/**
 * Geometry Type Definitions
 * Defines types for 3D geometry calculations and transformations
 */

import type { Vector3 } from './tube';

/**
 * 3D Bounding box
 */
export interface BoundingBox {
  min: Vector3;
  max: Vector3;
}

/**
 * Plane definition
 */
export interface Plane {
  /** Point on the plane */
  point: Vector3;
  /** Normal vector of the plane */
  normal: Vector3;
}

/**
 * Ray definition for raycasting
 */
export interface Ray {
  /** Origin point of the ray */
  origin: Vector3;
  /** Direction vector of the ray (normalized) */
  direction: Vector3;
}

/**
 * Raycast hit result
 */
export interface RaycastHit {
  /** Distance from ray origin to hit point */
  distance: number;
  /** Hit point in world space */
  point: Vector3;
  /** Normal at hit point */
  normal: Vector3;
  /** ID of the hit object (tube ID) */
  objectId: string;
}

/**
 * Transformation matrix (4x4)
 */
export type Matrix4 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

/**
 * Quaternion for rotation (x, y, z, w)
 */
export type Quaternion = [number, number, number, number];

/**
 * Line segment
 */
export interface LineSegment {
  start: Vector3;
  end: Vector3;
}

/**
 * Intersection result between two geometric objects
 */
export interface IntersectionResult {
  /** Whether intersection exists */
  intersects: boolean;
  /** Intersection points */
  points: Vector3[];
  /** Intersection region (if applicable) */
  region?: Vector3[];
}

/**
 * Distance calculation result
 */
export interface DistanceResult {
  /** Distance between objects */
  distance: number;
  /** Closest point on first object */
  point1: Vector3;
  /** Closest point on second object */
  point2: Vector3;
}

/**
 * Tube geometry data
 * Contains calculated geometry for a tube
 */
export interface TubeGeometry {
  /** Vertices of the tube mesh */
  vertices: Vector3[];
  /** Face indices */
  faces: number[][];
  /** Edge indices */
  edges: number[][];
  /** Bounding box */
  boundingBox: BoundingBox;
  /** Center point */
  center: Vector3;
}

