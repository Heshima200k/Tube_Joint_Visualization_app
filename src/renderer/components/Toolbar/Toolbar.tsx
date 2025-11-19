/**
 * Toolbar Component
 * Main toolbar with view controls, zoom, pan, undo/redo
 */

import type { ViewMode } from '../../types';
import './Toolbar.css';

interface ToolbarProps {
  viewMode: ViewMode;
  snapToAngle: boolean;
  onViewModeChange?: (mode: ViewMode) => void;
  onSnapToAngleToggle?: (enabled: boolean) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onClearWorkspace?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

/**
 * Toolbar Component
 * Provides controls for view modes, zoom, and actions
 */
export default function Toolbar({
  viewMode,
  snapToAngle,
  onViewModeChange,
  onSnapToAngleToggle,
  onZoomIn,
  onZoomOut,
  onResetView,
  onUndo,
  onRedo,
  onClearWorkspace,
  canUndo = false,
  canRedo = false,
}: ToolbarProps) {
  const handleViewModeClick = (mode: ViewMode) => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  return (
    <div className="toolbar">
      {/* View Mode Controls */}
      <div className="toolbar-group">
        <div className="toolbar-label">View:</div>
        <button
          className={`toolbar-button ${viewMode === 'solid' ? 'active' : ''}`}
          onClick={() => handleViewModeClick('solid')}
          title="Solid View"
        >
          Solid
        </button>
        <button
          className={`toolbar-button ${viewMode === 'wireframe' ? 'active' : ''}`}
          onClick={() => handleViewModeClick('wireframe')}
          title="Wireframe View"
        >
          Wireframe
        </button>
        <button
          className={`toolbar-button ${viewMode === 'both' ? 'active' : ''}`}
          onClick={() => handleViewModeClick('both')}
          title="Both Views"
        >
          Both
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Zoom Controls */}
      <div className="toolbar-group">
        <div className="toolbar-label">Zoom:</div>
        <button
          className="toolbar-button"
          onClick={onZoomOut}
          title="Zoom Out"
          disabled={!onZoomOut}
        >
          −
        </button>
        <button
          className="toolbar-button"
          onClick={onResetView}
          title="Reset View"
          disabled={!onResetView}
        >
          Reset
        </button>
        <button
          className="toolbar-button"
          onClick={onZoomIn}
          title="Zoom In"
          disabled={!onZoomOut}
        >
          +
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Angle Snapping */}
      <div className="toolbar-group">
        <label className="toolbar-checkbox-label">
          <input
            type="checkbox"
            checked={snapToAngle}
            onChange={(e) => onSnapToAngleToggle?.(e.target.checked)}
          />
          <span>Snap Angles</span>
        </label>
      </div>

      <div className="toolbar-separator" />

      {/* Undo/Redo */}
      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={onUndo}
          title="Undo (Ctrl+Z)"
          disabled={!canUndo || !onUndo}
        >
          ↶ Undo
        </button>
        <button
          className="toolbar-button"
          onClick={onRedo}
          title="Redo (Ctrl+Y)"
          disabled={!canRedo || !onRedo}
        >
          ↷ Redo
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Clear Workspace */}
      <div className="toolbar-group">
        <button
          className="toolbar-button danger"
          onClick={onClearWorkspace}
          title="Clear Workspace"
          disabled={!onClearWorkspace}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

