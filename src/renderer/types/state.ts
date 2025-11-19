/**
 * Application State Type Definitions
 * Defines the main application state structure
 */

import type { Tube } from './tube';
import type { Joint } from './joint';
import type { ViewSettings, CameraSettings } from './view';

/**
 * Application state interface
 * Main state container for the entire application
 */
export interface AppState {
  /** Array of all tubes in the scene */
  tubes: Tube[];
  /** Array of all joints between tubes */
  joints: Joint[];
  /** Currently selected tube ID (if any) */
  selectedTubeId: string | null;
  /** Currently selected joint ID (if any) */
  selectedJointId: string | null;
  /** View settings */
  viewSettings: ViewSettings;
  /** Camera settings */
  cameraSettings: CameraSettings;
  /** Whether angle snapping is enabled */
  snapToAngle: boolean;
  /** Snapping threshold in degrees */
  snapThreshold: number;
}

/**
 * Default application state
 */
export const DEFAULT_APP_STATE: AppState = {
  tubes: [],
  joints: [],
  selectedTubeId: null,
  selectedJointId: null,
  viewSettings: {
    viewMode: 'solid',
    showGrid: true,
    showAxes: true,
    showJointHighlights: true,
    backgroundColor: '#1a1a1a',
    showDimensions: false,
  },
  cameraSettings: {
    position: [300, 300, 300],
    target: [0, 0, 0],
    fov: 50,
    near: 0.1,
    far: 2000,
    mode: 'orbit',
  },
  snapToAngle: true,
  snapThreshold: 5, // degrees
};

