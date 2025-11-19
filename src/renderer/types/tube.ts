/**
 * Tube Type Definitions
 * Defines interfaces and types for rectangular/square tubes and their properties
 */

/**
 * Type of tube cross-section
 */
export type TubeType = 'rectangular' | 'square';

/**
 * 3D Vector type (x, y, z)
 */
export type Vector3 = [number, number, number];

/**
 * Euler angles for rotation (x, y, z in radians)
 */
export type Rotation = [number, number, number];

/**
 * Tube parameters interface
 * Defines all configurable properties of a tube
 */
export interface TubeParameters {
  /** Width of the tube (outer dimension) */
  width: number;
  /** Height of the tube (outer dimension) */
  height: number;
  /** Wall thickness of the tube */
  thickness: number;
  /** Length of the tube */
  length: number;
}

/**
 * Tube interface
 * Represents a complete tube entity in the 3D scene
 */
export interface Tube {
  /** Unique identifier for the tube */
  id: string;
  /** Type of tube cross-section */
  type: TubeType;
  /** Tube dimensions and properties */
  parameters: TubeParameters;
  /** 3D position in world space [x, y, z] */
  position: Vector3;
  /** Rotation in radians [x, y, z] (Euler angles) */
  rotation: Rotation;
  /** Optional: Parent tube ID if this tube is connected to another */
  parentId?: string;
  /** Optional: Color for visualization (hex string) */
  color?: string;
  /** Whether the tube is currently selected */
  selected?: boolean;
  /** Whether the tube is visible */
  visible?: boolean;
}

/**
 * Default tube parameters
 */
export const DEFAULT_TUBE_PARAMETERS: TubeParameters = {
  width: 50,
  height: 50,
  thickness: 5,
  length: 200,
};

/**
 * Default tube configuration
 */
export const DEFAULT_TUBE: Omit<Tube, 'id'> = {
  type: 'rectangular',
  parameters: DEFAULT_TUBE_PARAMETERS,
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  visible: true,
  selected: false,
  color: '#4a90e2',
};

/**
 * Helper function to create a new tube with default values
 */
export function createTube(overrides?: Partial<Tube>): Tube {
  return {
    id: `tube-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...DEFAULT_TUBE,
    ...overrides,
    parameters: {
      ...DEFAULT_TUBE_PARAMETERS,
      ...overrides?.parameters,
    },
  };
}

/**
 * Helper function to validate tube parameters
 */
export function validateTubeParameters(params: TubeParameters): boolean {
  return (
    params.width > 0 &&
    params.height > 0 &&
    params.thickness > 0 &&
    params.length > 0 &&
    params.thickness < Math.min(params.width, params.height) / 2
  );
}
