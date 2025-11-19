/**
 * Type Definitions Index
 * Central export point for all type definitions
 */

// Tube types
export type {
  TubeType,
  Vector3,
  Rotation,
  TubeParameters,
  Tube,
} from './tube';
export {
  DEFAULT_TUBE_PARAMETERS,
  DEFAULT_TUBE,
  createTube,
  validateTubeParameters,
} from './tube';

// Joint types
export type {
  JointType,
  Joint,
  JointPreview,
  IntersectionData,
  JointCalculationResult,
  StandardAngle,
} from './joint';
export {
  DEFAULT_JOINT,
  createJoint,
  STANDARD_JOINT_ANGLES,
} from './joint';

// View types
export type {
  ViewMode,
  CameraMode,
  ViewSettings,
  CameraSettings,
  ZoomLevel,
} from './view';
export {
  DEFAULT_VIEW_SETTINGS,
  DEFAULT_CAMERA_SETTINGS,
} from './view';

// State types
export type { AppState } from './state';
export { DEFAULT_APP_STATE } from './state';

// Action types
export type {
  Action,
  BaseAction,
  AddTubeAction,
  RemoveTubeAction,
  UpdateTubeAction,
  MoveTubeAction,
  RotateTubeAction,
  SelectTubeAction,
  DeselectTubeAction,
  AddJointAction,
  RemoveJointAction,
  UpdateJointAction,
  SelectJointAction,
  DeselectJointAction,
  UpdateViewSettingsAction,
  UpdateCameraSettingsAction,
  ResetViewAction,
  ClearWorkspaceAction,
  SnapToAngleAction,
  BatchUpdateAction,
} from './actions';
export { ActionType, ActionCreators } from './actions';

// Geometry types
export type {
  BoundingBox,
  Plane,
  Ray,
  RaycastHit,
  Matrix4,
  Quaternion,
  LineSegment,
  IntersectionResult,
  DistanceResult,
  TubeGeometry,
} from './geometry';

