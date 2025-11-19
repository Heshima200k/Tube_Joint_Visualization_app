/**
 * Action Type Definitions
 * Defines actions for state management and undo/redo system
 */

import type { Tube } from './tube';
import type { Joint } from './joint';
import type { ViewSettings, CameraSettings } from './view';
import type { Vector3, Rotation } from './tube';

/**
 * Action type enum
 * Types of actions that can be performed
 */
export enum ActionType {
  // Tube actions
  ADD_TUBE = 'ADD_TUBE',
  REMOVE_TUBE = 'REMOVE_TUBE',
  UPDATE_TUBE = 'UPDATE_TUBE',
  MOVE_TUBE = 'MOVE_TUBE',
  ROTATE_TUBE = 'ROTATE_TUBE',
  SELECT_TUBE = 'SELECT_TUBE',
  DESELECT_TUBE = 'DESELECT_TUBE',

  // Joint actions
  ADD_JOINT = 'ADD_JOINT',
  REMOVE_JOINT = 'REMOVE_JOINT',
  UPDATE_JOINT = 'UPDATE_JOINT',
  SELECT_JOINT = 'SELECT_JOINT',
  DESELECT_JOINT = 'DESELECT_JOINT',

  // View actions
  UPDATE_VIEW_SETTINGS = 'UPDATE_VIEW_SETTINGS',
  UPDATE_CAMERA_SETTINGS = 'UPDATE_CAMERA_SETTINGS',
  RESET_VIEW = 'RESET_VIEW',

  // Workspace actions
  CLEAR_WORKSPACE = 'CLEAR_WORKSPACE',
  SNAP_TO_ANGLE = 'SNAP_TO_ANGLE',

  // Batch actions
  BATCH_UPDATE = 'BATCH_UPDATE',
}

/**
 * Base action interface
 */
export interface BaseAction {
  type: ActionType;
  timestamp: number;
}

/**
 * Add tube action
 */
export interface AddTubeAction extends BaseAction {
  type: ActionType.ADD_TUBE;
  tube: Tube;
}

/**
 * Remove tube action
 */
export interface RemoveTubeAction extends BaseAction {
  type: ActionType.REMOVE_TUBE;
  tubeId: string;
}

/**
 * Update tube action
 */
export interface UpdateTubeAction extends BaseAction {
  type: ActionType.UPDATE_TUBE;
  tubeId: string;
  updates: Partial<Tube>;
}

/**
 * Move tube action
 */
export interface MoveTubeAction extends BaseAction {
  type: ActionType.MOVE_TUBE;
  tubeId: string;
  position: Vector3;
  previousPosition: Vector3;
}

/**
 * Rotate tube action
 */
export interface RotateTubeAction extends BaseAction {
  type: ActionType.ROTATE_TUBE;
  tubeId: string;
  rotation: Rotation;
  previousRotation: Rotation;
}

/**
 * Select tube action
 */
export interface SelectTubeAction extends BaseAction {
  type: ActionType.SELECT_TUBE;
  tubeId: string;
}

/**
 * Deselect tube action
 */
export interface DeselectTubeAction extends BaseAction {
  type: ActionType.DESELECT_TUBE;
}

/**
 * Add joint action
 */
export interface AddJointAction extends BaseAction {
  type: ActionType.ADD_JOINT;
  joint: Joint;
}

/**
 * Remove joint action
 */
export interface RemoveJointAction extends BaseAction {
  type: ActionType.REMOVE_JOINT;
  jointId: string;
}

/**
 * Update joint action
 */
export interface UpdateJointAction extends BaseAction {
  type: ActionType.UPDATE_JOINT;
  jointId: string;
  updates: Partial<Joint>;
}

/**
 * Select joint action
 */
export interface SelectJointAction extends BaseAction {
  type: ActionType.SELECT_JOINT;
  jointId: string;
}

/**
 * Deselect joint action
 */
export interface DeselectJointAction extends BaseAction {
  type: ActionType.DESELECT_JOINT;
}

/**
 * Update view settings action
 */
export interface UpdateViewSettingsAction extends BaseAction {
  type: ActionType.UPDATE_VIEW_SETTINGS;
  settings: Partial<ViewSettings>;
}

/**
 * Update camera settings action
 */
export interface UpdateCameraSettingsAction extends BaseAction {
  type: ActionType.UPDATE_CAMERA_SETTINGS;
  settings: Partial<CameraSettings>;
}

/**
 * Reset view action
 */
export interface ResetViewAction extends BaseAction {
  type: ActionType.RESET_VIEW;
}

/**
 * Clear workspace action
 */
export interface ClearWorkspaceAction extends BaseAction {
  type: ActionType.CLEAR_WORKSPACE;
}

/**
 * Snap to angle action
 */
export interface SnapToAngleAction extends BaseAction {
  type: ActionType.SNAP_TO_ANGLE;
  enabled: boolean;
}

/**
 * Batch update action
 * Groups multiple actions together
 */
export interface BatchUpdateAction extends BaseAction {
  type: ActionType.BATCH_UPDATE;
  actions: Action[];
}

/**
 * Union type of all actions
 */
export type Action =
  | AddTubeAction
  | RemoveTubeAction
  | UpdateTubeAction
  | MoveTubeAction
  | RotateTubeAction
  | SelectTubeAction
  | DeselectTubeAction
  | AddJointAction
  | RemoveJointAction
  | UpdateJointAction
  | SelectJointAction
  | DeselectJointAction
  | UpdateViewSettingsAction
  | UpdateCameraSettingsAction
  | ResetViewAction
  | ClearWorkspaceAction
  | SnapToAngleAction
  | BatchUpdateAction;

/**
 * Action creator helper functions
 */
export const ActionCreators = {
  addTube: (tube: Tube): AddTubeAction => ({
    type: ActionType.ADD_TUBE,
    tube,
    timestamp: Date.now(),
  }),

  removeTube: (tubeId: string): RemoveTubeAction => ({
    type: ActionType.REMOVE_TUBE,
    tubeId,
    timestamp: Date.now(),
  }),

  updateTube: (tubeId: string, updates: Partial<Tube>): UpdateTubeAction => ({
    type: ActionType.UPDATE_TUBE,
    tubeId,
    updates,
    timestamp: Date.now(),
  }),

  moveTube: (
    tubeId: string,
    position: Vector3,
    previousPosition: Vector3
  ): MoveTubeAction => ({
    type: ActionType.MOVE_TUBE,
    tubeId,
    position,
    previousPosition,
    timestamp: Date.now(),
  }),

  rotateTube: (
    tubeId: string,
    rotation: Rotation,
    previousRotation: Rotation
  ): RotateTubeAction => ({
    type: ActionType.ROTATE_TUBE,
    tubeId,
    rotation,
    previousRotation,
    timestamp: Date.now(),
  }),

  selectTube: (tubeId: string): SelectTubeAction => ({
    type: ActionType.SELECT_TUBE,
    tubeId,
    timestamp: Date.now(),
  }),

  deselectTube: (): DeselectTubeAction => ({
    type: ActionType.DESELECT_TUBE,
    timestamp: Date.now(),
  }),

  addJoint: (joint: Joint): AddJointAction => ({
    type: ActionType.ADD_JOINT,
    joint,
    timestamp: Date.now(),
  }),

  removeJoint: (jointId: string): RemoveJointAction => ({
    type: ActionType.REMOVE_JOINT,
    jointId,
    timestamp: Date.now(),
  }),

  updateJoint: (jointId: string, updates: Partial<Joint>): UpdateJointAction => ({
    type: ActionType.UPDATE_JOINT,
    jointId,
    updates,
    timestamp: Date.now(),
  }),

  selectJoint: (jointId: string): SelectJointAction => ({
    type: ActionType.SELECT_JOINT,
    jointId,
    timestamp: Date.now(),
  }),

  deselectJoint: (): DeselectJointAction => ({
    type: ActionType.DESELECT_JOINT,
    timestamp: Date.now(),
  }),

  updateViewSettings: (settings: Partial<ViewSettings>): UpdateViewSettingsAction => ({
    type: ActionType.UPDATE_VIEW_SETTINGS,
    settings,
    timestamp: Date.now(),
  }),

  updateCameraSettings: (
    settings: Partial<CameraSettings>
  ): UpdateCameraSettingsAction => ({
    type: ActionType.UPDATE_CAMERA_SETTINGS,
    settings,
    timestamp: Date.now(),
  }),

  resetView: (): ResetViewAction => ({
    type: ActionType.RESET_VIEW,
    timestamp: Date.now(),
  }),

  clearWorkspace: (): ClearWorkspaceAction => ({
    type: ActionType.CLEAR_WORKSPACE,
    timestamp: Date.now(),
  }),

  snapToAngle: (enabled: boolean): SnapToAngleAction => ({
    type: ActionType.SNAP_TO_ANGLE,
    enabled,
    timestamp: Date.now(),
  }),

  batchUpdate: (actions: Action[]): BatchUpdateAction => ({
    type: ActionType.BATCH_UPDATE,
    actions,
    timestamp: Date.now(),
  }),
};

