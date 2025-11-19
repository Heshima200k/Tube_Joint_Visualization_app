/**
 * Geometry Utilities
 * 3D geometry calculation functions
 */

import type { Tube, Vector3 as Vec3, BoundingBox, DistanceResult } from '../types';

/**
 * Calculate bounding box for a tube
 */
export function calculateTubeBoundingBox(tube: Tube): BoundingBox {
  const { parameters, position } = tube;
  const { width, height, length } = parameters;
  
  const halfW = width / 2;
  const halfH = height / 2;
  const halfL = length / 2;
  
  // Calculate corners of the box (simplified - doesn't account for rotation)
  const corners = [
    [-halfW, -halfH, -halfL],
    [halfW, -halfH, -halfL],
    [-halfW, halfH, -halfL],
    [halfW, halfH, -halfL],
    [-halfW, -halfH, halfL],
    [halfW, -halfH, halfL],
    [-halfW, halfH, halfL],
    [halfW, halfH, halfL],
  ];
  
  // Transform corners by position and rotation (simplified)
  const transformedCorners = corners.map(([x, y, z]) => {
    // Apply rotation (simplified - would need proper matrix multiplication)
    // For now, just add position
    return [
      x + position[0],
      y + position[1],
      z + position[2],
    ] as Vec3;
  });
  
  // Find min/max
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  
  for (const [x, y, z] of transformedCorners) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }
  
  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
  };
}

/**
 * Calculate distance between two tubes
 */
export function calculateTubeDistance(
  tube1: Tube,
  tube2: Tube
): DistanceResult {
  const bbox1 = calculateTubeBoundingBox(tube1);
  const bbox2 = calculateTubeBoundingBox(tube2);
  
  // Calculate closest points between bounding boxes
  const p1: Vec3 = [
    Math.max(bbox1.min[0], Math.min(bbox2.max[0], bbox1.max[0])),
    Math.max(bbox1.min[1], Math.min(bbox2.max[1], bbox1.max[1])),
    Math.max(bbox1.min[2], Math.min(bbox2.max[2], bbox1.max[2])),
  ];
  
  const p2: Vec3 = [
    Math.max(bbox2.min[0], Math.min(bbox1.max[0], bbox2.max[0])),
    Math.max(bbox2.min[1], Math.min(bbox1.max[1], bbox2.max[1])),
    Math.max(bbox2.min[2], Math.min(bbox1.max[2], bbox2.max[2])),
  ];
  
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  return {
    distance,
    point1: p1,
    point2: p2,
  };
}

/**
 * Check if two tubes are intersecting or close
 */
export function areTubesClose(
  tube1: Tube,
  tube2: Tube,
  threshold: number = 10
): boolean {
  const distance = calculateTubeDistance(tube1, tube2);
  return distance.distance < threshold;
}

/**
 * Calculate intersection point between two tubes
 * Simplified version - returns midpoint of closest points
 */
export function calculateTubeIntersection(
  tube1: Tube,
  tube2: Tube
): Vec3 | null {
  const distance = calculateTubeDistance(tube1, tube2);
  
  if (distance.distance < 0.1) {
    // Tubes are very close, return midpoint
    return [
      (distance.point1[0] + distance.point2[0]) / 2,
      (distance.point1[1] + distance.point2[1]) / 2,
      (distance.point1[2] + distance.point2[2]) / 2,
    ];
  }
  
  return null;
}

