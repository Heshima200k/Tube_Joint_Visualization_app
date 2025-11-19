/**
 * Angle Snapping Utilities
 * Functions for snapping angles to standard values
 */

import type { Rotation } from '../types';
import { STANDARD_JOINT_ANGLES } from '../types';

/**
 * Snap an angle to the nearest standard angle
 */
export function snapAngle(
  angle: number,
  threshold: number = 5
): number {
  // Normalize angle to 0-360 range
  let normalizedAngle = angle % 360;
  if (normalizedAngle < 0) normalizedAngle += 360;
  
  // Find the nearest standard angle
  let nearestAngle: number = STANDARD_JOINT_ANGLES[0];
  let minDiff = Math.abs(normalizedAngle - nearestAngle);
  
  for (const standardAngle of STANDARD_JOINT_ANGLES) {
    const diff = Math.abs(normalizedAngle - standardAngle);
    if (diff < minDiff) {
      minDiff = diff;
      nearestAngle = standardAngle;
    }
  }
  
  // Snap if within threshold
  if (minDiff <= threshold) {
    return nearestAngle;
  }
  
  return angle;
}

/**
 * Snap rotation to nearest standard angles
 */
export function snapRotation(
  rotation: Rotation,
  threshold: number = 5
): Rotation {
  const [x, y, z] = rotation;
  
  // Convert radians to degrees, snap, then convert back
  const snapX = (snapAngle((x * 180) / Math.PI, threshold) * Math.PI) / 180;
  const snapY = (snapAngle((y * 180) / Math.PI, threshold) * Math.PI) / 180;
  const snapZ = (snapAngle((z * 180) / Math.PI, threshold) * Math.PI) / 180;
  
  return [snapX, snapY, snapZ];
}

/**
 * Calculate angle between two rotations
 */
export function calculateAngleBetweenRotations(
  rot1: Rotation,
  rot2: Rotation
): number {
  // Simplified angle calculation
  // For more accurate calculation, use quaternions
  const diffX = Math.abs(rot1[0] - rot2[0]);
  const diffY = Math.abs(rot1[1] - rot2[1]);
  const diffZ = Math.abs(rot1[2] - rot2[2]);
  
  // Convert to degrees and calculate total difference
  const totalDiff = ((diffX + diffY + diffZ) * 180) / Math.PI;
  
  return totalDiff;
}

/**
 * Check if an angle is close to a standard angle
 */
export function isNearStandardAngle(
  angle: number,
  threshold: number = 5
): boolean {
  const snapped = snapAngle(angle, threshold);
  return Math.abs(angle - snapped) < threshold;
}

