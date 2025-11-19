/**
 * View and Visualization Type Definitions
 * Defines types for view modes, camera settings, and visualization options
 */

/**
 * View mode for rendering
 */
export type ViewMode = 'solid' | 'wireframe' | 'both';

/**
 * Camera control mode
 */
export type CameraMode = 'orbit' | 'first-person' | 'top-down';

/**
 * View settings interface
 * Controls how the 3D scene is rendered and displayed
 */
export interface ViewSettings {
  /** Current view mode */
  viewMode: ViewMode;
  /** Whether to show grid/helpers */
  showGrid: boolean;
  /** Whether to show axes */
  showAxes: boolean;
  /** Whether to show joint highlights */
  showJointHighlights: boolean;
  /** Background color (hex string) */
  backgroundColor: string;
  /** Whether to show dimensions */
  showDimensions: boolean;
}

/**
 * Camera settings interface
 */
export interface CameraSettings {
  /** Camera position [x, y, z] */
  position: [number, number, number];
  /** Camera target/look-at point [x, y, z] */
  target: [number, number, number];
  /** Field of view in degrees */
  fov: number;
  /** Near clipping plane */
  near: number;
  /** Far clipping plane */
  far: number;
  /** Camera control mode */
  mode: CameraMode;
}

/**
 * Zoom level type
 */
export type ZoomLevel = number;

/**
 * Default view settings
 */
export const DEFAULT_VIEW_SETTINGS: ViewSettings = {
  viewMode: 'solid',
  showGrid: true,
  showAxes: true,
  showJointHighlights: true,
  backgroundColor: '#1a1a1a',
  showDimensions: false,
};

/**
 * Default camera settings
 */
export const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
  position: [300, 300, 300],
  target: [0, 0, 0],
  fov: 50,
  near: 0.1,
  far: 2000,
  mode: 'orbit',
};

