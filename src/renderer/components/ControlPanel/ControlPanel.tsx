/**
 * ControlPanel Component
 * UI controls for tube and joint parameters
 */

import { useState, useEffect } from 'react';
import type { Tube, TubeType, TubeParameters, Joint, JointPreview } from '../../types';
import './ControlPanel.css';

interface ControlPanelProps {
  selectedTube: Tube | null;
  selectedJoint: Joint | null;
  jointPreviews?: JointPreview[];
  onTubeUpdate?: (tubeId: string, updates: Partial<Tube>) => void;
  onJointUpdate?: (jointId: string, updates: Partial<Joint>) => void;
  onCreateJoint?: (preview: JointPreview) => void;
}

/**
 * ControlPanel Component
 * Displays and allows editing of tube/joint parameters
 */
export default function ControlPanel({
  selectedTube,
  selectedJoint,
  jointPreviews = [],
  onTubeUpdate,
  onJointUpdate,
  onCreateJoint,
}: ControlPanelProps) {
  const [tubeParams, setTubeParams] = useState<TubeParameters | null>(null);
  const [tubeType, setTubeType] = useState<TubeType>('rectangular');

  useEffect(() => {
    if (selectedTube) {
      setTubeParams(selectedTube.parameters);
      setTubeType(selectedTube.type);
    } else {
      setTubeParams(null);
    }
  }, [selectedTube]);

  const handleTubeParamChange = (field: keyof TubeParameters, value: number) => {
    if (!selectedTube || !tubeParams) return;

    const newParams = { ...tubeParams, [field]: value };
    setTubeParams(newParams);

    if (onTubeUpdate) {
      onTubeUpdate(selectedTube.id, { parameters: newParams });
    }
  };

  const handleTubeTypeChange = (type: TubeType) => {
    if (!selectedTube) return;

    setTubeType(type);
    if (onTubeUpdate) {
      onTubeUpdate(selectedTube.id, { type });
    }
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedTube) return;

    const [rx, ry, rz] = selectedTube.rotation;
    const newRotation: [number, number, number] =
      axis === 'x' ? [value, ry, rz] : axis === 'y' ? [rx, value, rz] : [rx, ry, value];

    if (onTubeUpdate) {
      onTubeUpdate(selectedTube.id, { rotation: newRotation });
    }
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedTube) return;

    const [px, py, pz] = selectedTube.position;
    const newPosition: [number, number, number] =
      axis === 'x' ? [value, py, pz] : axis === 'y' ? [px, value, pz] : [px, py, value];

    if (onTubeUpdate) {
      onTubeUpdate(selectedTube.id, { position: newPosition });
    }
  };

  // Show joint creation option if previews exist
  const hasJointPreviews = jointPreviews.length > 0 && selectedTube;

  if (!selectedTube && !selectedJoint) {
    return (
      <div className="control-panel">
        <div className="control-panel-header">
          <h3>Properties</h3>
        </div>
        <div className="control-panel-content">
          <p className="no-selection">No object selected</p>
          <p className="hint">Select a tube or joint to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <h3>Properties</h3>
      </div>
      
      {/* Joint Creation Section */}
      {hasJointPreviews && (
        <div className="control-panel-section">
          <div className="section-header">
            <h4>Joint Preview</h4>
          </div>
          <div className="section-content">
            <p className="info-text">
              {jointPreviews.length} joint preview{jointPreviews.length !== 1 ? 's' : ''} available
            </p>
            {jointPreviews.map((preview, index) => (
              <div key={index} className="joint-preview-item">
                <div className="preview-info">
                  <span>Angle: {preview.angle}°</span>
                  <span>Parent: Tube {preview.parentTubeId.slice(-6)}</span>
                </div>
                <button
                  className="create-joint-button"
                  onClick={() => onCreateJoint?.(preview)}
                  title="Create joint between selected tube and parent tube"
                >
                  Create Joint
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="control-panel-content">
        {selectedTube && tubeParams && (
          <div className="control-section">
            <h4>Tube Properties</h4>

            {/* Tube Type */}
            <div className="control-group">
              <label>Type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="tubeType"
                    value="rectangular"
                    checked={tubeType === 'rectangular'}
                    onChange={() => handleTubeTypeChange('rectangular')}
                  />
                  Rectangular
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="tubeType"
                    value="square"
                    checked={tubeType === 'square'}
                    onChange={() => handleTubeTypeChange('square')}
                  />
                  Square
                </label>
              </div>
            </div>

            {/* Tube Parameters */}
            <div className="control-group">
              <label>Width</label>
              <input
                type="number"
                min="1"
                step="1"
                value={tubeParams.width}
                onChange={(e) => handleTubeParamChange('width', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="control-group">
              <label>Height</label>
              <input
                type="number"
                min="1"
                step="1"
                value={tubeParams.height}
                onChange={(e) => handleTubeParamChange('height', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="control-group">
              <label>Thickness</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={tubeParams.thickness}
                onChange={(e) => handleTubeParamChange('thickness', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="control-group">
              <label>Length</label>
              <input
                type="number"
                min="1"
                step="1"
                value={tubeParams.length}
                onChange={(e) => handleTubeParamChange('length', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Position */}
            <div className="control-section">
              <h4>Position</h4>
              <div className="control-group">
                <label>X</label>
                <input
                  type="number"
                  step="1"
                  value={selectedTube.position[0].toFixed(2)}
                  onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="control-group">
                <label>Y</label>
                <input
                  type="number"
                  step="1"
                  value={selectedTube.position[1].toFixed(2)}
                  onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="control-group">
                <label>Z</label>
                <input
                  type="number"
                  step="1"
                  value={selectedTube.position[2].toFixed(2)}
                  onChange={(e) => handlePositionChange('z', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Rotation */}
            <div className="control-section">
              <h4>Rotation (degrees)</h4>
              <div className="control-group">
                <label>X</label>
                <input
                  type="number"
                  step="1"
                  value={((selectedTube.rotation[0] * 180) / Math.PI).toFixed(1)}
                  onChange={(e) =>
                    handleRotationChange('x', ((parseFloat(e.target.value) || 0) * Math.PI) / 180)
                  }
                />
              </div>
              <div className="control-group">
                <label>Y</label>
                <input
                  type="number"
                  step="1"
                  value={((selectedTube.rotation[1] * 180) / Math.PI).toFixed(1)}
                  onChange={(e) =>
                    handleRotationChange('y', ((parseFloat(e.target.value) || 0) * Math.PI) / 180)
                  }
                />
              </div>
              <div className="control-group">
                <label>Z</label>
                <input
                  type="number"
                  step="1"
                  value={((selectedTube.rotation[2] * 180) / Math.PI).toFixed(1)}
                  onChange={(e) =>
                    handleRotationChange('z', ((parseFloat(e.target.value) || 0) * Math.PI) / 180)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {selectedJoint && (
          <div className="control-section">
            <h4>Joint Properties</h4>
            <div className="control-group">
              <label>Angle (degrees)</label>
              <input
                type="number"
                min="0"
                max="180"
                step="1"
                value={selectedJoint.angle}
                onChange={(e) => {
                  if (onJointUpdate) {
                    onJointUpdate(selectedJoint.id, {
                      angle: parseFloat(e.target.value) || 0,
                    });
                  }
                }}
              />
            </div>
            <div className="control-group">
              <label>Type</label>
              <select
                value={selectedJoint.type}
                onChange={(e) => {
                  if (onJointUpdate) {
                    onJointUpdate(selectedJoint.id, {
                      type: e.target.value as Joint['type'],
                    });
                  }
                }}
              >
                <option value="butt">Butt</option>
                <option value="miter">Miter</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

