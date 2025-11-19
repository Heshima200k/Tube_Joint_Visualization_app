import { useState, useCallback, useEffect } from 'react';
import TubeCanvas from './components/TubeCanvas';
import ControlPanel from './components/ControlPanel';
import Toolbar from './components/Toolbar';
import { useUndoRedo } from './hooks/useUndoRedo';
import {
  DEFAULT_VIEW_SETTINGS,
  DEFAULT_CAMERA_SETTINGS,
  DEFAULT_APP_STATE,
  createTube,
  createJoint,
  type Tube,
  type Joint,
  type ViewMode,
  type AppState,
  type JointPreview,
} from './types';
import './App.css';

function App() {
  const [viewSettings, setViewSettings] = useState(DEFAULT_VIEW_SETTINGS);
  const [cameraSettings, setCameraSettings] = useState(DEFAULT_CAMERA_SETTINGS);
  const [tubes, setTubes] = useState(DEFAULT_APP_STATE.tubes);
  const [joints, setJoints] = useState(DEFAULT_APP_STATE.joints);
  const [selectedTubeId, setSelectedTubeId] = useState<string | null>(null);
  const [selectedJointId, setSelectedJointId] = useState<string | null>(null);
  const [snapToAngle, setSnapToAngle] = useState(DEFAULT_APP_STATE.snapToAngle);

  // Create app state for undo/redo
  const createAppState = useCallback((): AppState => {
    return {
      tubes,
      joints,
      selectedTubeId,
      selectedJointId,
      viewSettings,
      cameraSettings,
      snapToAngle,
      snapThreshold: DEFAULT_APP_STATE.snapThreshold,
    };
  }, [tubes, joints, selectedTubeId, selectedJointId, viewSettings, cameraSettings, snapToAngle]);

  const initialAppState = createAppState();

  const { canUndo, canRedo, undo, redo, addToHistory } = useUndoRedo({
    initialState: initialAppState,
    onStateChange: (state: AppState) => {
      setTubes(state.tubes);
      setJoints(state.joints);
      setSelectedTubeId(state.selectedTubeId);
      setSelectedJointId(state.selectedJointId);
      setViewSettings(state.viewSettings);
      setCameraSettings(state.cameraSettings);
      setSnapToAngle(state.snapToAngle);
    },
  });

  // Save state to history when it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      addToHistory(createAppState());
    }, 300); // Debounce to avoid too many history entries

    return () => clearTimeout(timeoutId);
  }, [tubes, joints, viewSettings, cameraSettings, snapToAngle, createAppState, addToHistory]);

  const handleAddTube = () => {
    const newTube = createTube({
      position: [
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
      ],
    });
    setTubes([...tubes, newTube]);
  };

  const handleTubeSelect = (tubeId: string) => {
    setSelectedTubeId(tubeId === selectedTubeId ? null : tubeId);
  };

  const handleTubeMove = (tubeId: string, position: [number, number, number]) => {
    const movedTube = tubes.find((t) => t.id === tubeId);
    if (!movedTube) return;

    const deltaX = position[0] - movedTube.position[0];
    const deltaY = position[1] - movedTube.position[1];
    const deltaZ = position[2] - movedTube.position[2];

    setTubes(
      tubes.map((tube) => {
        if (tube.id === tubeId) {
          return { ...tube, position };
        }
        // Update child tubes when parent moves
        if (tube.parentId === tubeId) {
          return {
            ...tube,
            position: [
              tube.position[0] + deltaX,
              tube.position[1] + deltaY,
              tube.position[2] + deltaZ,
            ],
          };
        }
        return tube;
      })
    );
  };

  const handleTubeUpdate = (tubeId: string, updates: Partial<Tube>) => {
    setTubes(
      tubes.map((tube) =>
        tube.id === tubeId ? { ...tube, ...updates } : tube
      )
    );
  };

  const handleJointUpdate = (jointId: string, updates: Partial<Joint>) => {
    setJoints(
      joints.map((joint) =>
        joint.id === jointId ? { ...joint, ...updates } : joint
      )
    );
  };

  const handleCreateJointFromPreview = useCallback((preview: JointPreview) => {
    if (!selectedTubeId) return;

    // Check if joint already exists between these tubes
    const existingJoint = joints.find(
      (j) =>
        (j.tube1Id === preview.parentTubeId && j.tube2Id === selectedTubeId) ||
        (j.tube1Id === selectedTubeId && j.tube2Id === preview.parentTubeId)
    );

    if (existingJoint) {
      alert('A joint already exists between these tubes.');
      return;
    }

    // Create the joint
    const joint = createJoint(preview.parentTubeId, selectedTubeId, {
      angle: preview.angle,
      position: preview.position,
      rotation: preview.rotation,
    });

    // Update tubes with parent-child relationship
    const updatedTubes = tubes.map((tube) => {
      if (tube.id === selectedTubeId) {
        return {
          ...tube,
          parentId: preview.parentTubeId,
          position: preview.position,
        };
      }
      return tube;
    });

    setJoints([...joints, joint]);
    setTubes(updatedTubes);
  }, [selectedTubeId, tubes, joints]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewSettings({ ...viewSettings, viewMode: mode });
  };

  const handleSnapToAngleToggle = (enabled: boolean) => {
    setSnapToAngle(enabled);
  };

  const handleZoomIn = useCallback(() => {
    setCameraSettings((prev) => ({
      ...prev,
      position: [
        prev.position[0] * 0.9,
        prev.position[1] * 0.9,
        prev.position[2] * 0.9,
      ] as [number, number, number],
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setCameraSettings((prev) => ({
      ...prev,
      position: [
        prev.position[0] * 1.1,
        prev.position[1] * 1.1,
        prev.position[2] * 1.1,
      ] as [number, number, number],
    }));
  }, []);

  const handleResetView = useCallback(() => {
    setCameraSettings(DEFAULT_CAMERA_SETTINGS);
  }, []);

  const handleCameraChange = useCallback((settings: Partial<typeof cameraSettings>) => {
    setCameraSettings({ ...cameraSettings, ...settings });
  }, [cameraSettings]);

  const handleClearWorkspace = () => {
    if (confirm('Are you sure you want to clear the workspace? This will remove all tubes and joints.')) {
      setTubes([]);
      setJoints([]);
      setSelectedTubeId(null);
      setSelectedJointId(null);
    }
  };

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const selectedTube = tubes.find((t) => t.id === selectedTubeId) || null;
  const selectedJoint = joints.find((j) => j.id === selectedJointId) || null;
  const [jointPreviews, setJointPreviews] = useState<JointPreview[]>([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tube Joint Visualization</h1>
        <div className="controls">
          <button onClick={handleAddTube}>Add Tube</button>
          <span className="info">
            {tubes.length} tube{tubes.length !== 1 ? 's' : ''} in scene
          </span>
        </div>
      </header>
      <Toolbar
        viewMode={viewSettings.viewMode}
        snapToAngle={snapToAngle}
        onViewModeChange={handleViewModeChange}
        onSnapToAngleToggle={handleSnapToAngleToggle}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearWorkspace={handleClearWorkspace}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <main className="App-main">
        <TubeCanvas
          viewSettings={viewSettings}
          cameraSettings={cameraSettings}
          tubes={tubes}
          selectedTubeId={selectedTubeId}
          snapToAngle={snapToAngle}
          onCameraChange={handleCameraChange}
          onTubeSelect={handleTubeSelect}
          onTubeMove={handleTubeMove}
          onJointPreviewsChange={setJointPreviews}
        />
        <ControlPanel
          selectedTube={selectedTube}
          selectedJoint={selectedJoint}
          jointPreviews={jointPreviews}
          onTubeUpdate={handleTubeUpdate}
          onJointUpdate={handleJointUpdate}
          onCreateJoint={handleCreateJointFromPreview}
        />
      </main>
    </div>
  );
}

export default App;
