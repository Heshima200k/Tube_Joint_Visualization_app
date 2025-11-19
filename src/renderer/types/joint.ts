/**
 * Joint Type Definitions
 * Defines interfaces for joints between tubes
 */

import type { Vector3, Rotation } from './tube';

/**
 * Joint type - how tubes are connected
 */
export type JointType = 'butt' | 'miter' | 'custom';

/**
 * Joint interface
 * Represents a connection between two tubes
 */
export interface Joint {
  /** Unique identifier for the joint */
  id: string;
  /** ID of the first (parent) tube */
  tube1Id: string;
  /** ID of the second (child) tube */
  tube2Id: string;
  /** Type of joint */
  type: JointType;
  /** Angle between tubes in degrees */
  angle: number;
  /** Position where the joint occurs (in world space) */
  position: Vector3;
  /** Rotation/orientation of the joint */
  rotation: Rotation;
  /** Whether the joint is currently selected/highlighted */
  selected?: boolean;
  /** Whether the joint is visible */
  visible?: boolean;
  /** Optional: Custom joint parameters */
  customParams?: Record<string, unknown>;
}

/**
 * Joint preview interface
 * Used for previewing joints before they are created
 */
export interface JointPreview {
  /** ID of the parent tube */
  parentTubeId: string;
  /** Proposed position for the new tube */
  position: Vector3;
  /** Proposed rotation for the new tube */
  rotation: Rotation;
  /** Proposed angle between tubes */
  angle: number;
  /** Whether the preview is valid */
  valid: boolean;
  /** Optional: Intersection geometry data */
  intersectionData?: IntersectionData;
}

/**
 * Intersection data
 * Contains geometric information about where tubes intersect
 */
export interface IntersectionData {
  /** Points defining the intersection region */
  points: Vector3[];
  /** Normal vector of the intersection plane */
  normal: Vector3;
  /** Area of intersection */
  area?: number;
}

/**
 * Joint calculation result
 * Result of calculating joint geometry
 */
export interface JointCalculationResult {
  /** Whether the calculation was successful */
  success: boolean;
  /** Calculated joint data */
  joint?: Joint;
  /** Intersection data if available */
  intersectionData?: IntersectionData;
  /** Error message if calculation failed */
  error?: string;
}

/**
 * Default joint configuration
 */
export const DEFAULT_JOINT: Omit<Joint, 'id' | 'tube1Id' | 'tube2Id'> = {
  type: 'butt',
  angle: 90,
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  visible: true,
  selected: false,
};

/**
 * Helper function to create a new joint
 */
export function createJoint(
  tube1Id: string,
  tube2Id: string,
  overrides?: Partial<Joint>
): Joint {
  return {
    id: `joint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tube1Id,
    tube2Id,
    ...DEFAULT_JOINT,
    ...overrides,
  };
}

/**
 * Standard joint angles for snapping
 */
export const STANDARD_JOINT_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180] as const;

/**
 * Type for standard angles
 */
export type StandardAngle = (typeof STANDARD_JOINT_ANGLES)[number];

