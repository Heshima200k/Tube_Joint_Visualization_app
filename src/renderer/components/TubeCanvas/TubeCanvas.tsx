/**
 * TubeCanvas Component
 * Main 3D visualization component using React Three Fiber
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import { PerspectiveCamera } from 'three';
import type { ViewSettings, CameraSettings, Tube, Vector3 } from '../../types';
import TubeMesh from '../Tube';
import JointPreviewMesh from '../JointPreview';
import { useJointDetection } from '../../hooks/useJointDetection';
import './TubeCanvas.css';

interface TubeCanvasProps {
  viewSettings: ViewSettings;
  cameraSettings: CameraSettings;
  tubes?: Tube[];
  selectedTubeId?: string | null;
  snapToAngle?: boolean;
  snapThreshold?: number;
  onCameraChange?: (settings: Partial<CameraSettings>) => void;
  onTubeSelect?: (tubeId: string) => void;
  onTubeMove?: (tubeId: string, position: Vector3) => void;
  onJointPreviewsChange?: (previews: import('../../types').JointPreview[]) => void;
}

/**
 * Scene content component
 * Contains all 3D objects in the scene
 */
function SceneContent({
  viewSettings,
  tubes = [],
  selectedTubeId,
  onTubeSelect,
  draggedTubeId,
  onDragStart,
  onJointPreviewsChange,
}: {
  viewSettings: ViewSettings;
  tubes: Tube[];
  selectedTubeId?: string | null;
  onTubeSelect?: (tubeId: string) => void;
  draggedTubeId?: string | null;
  onDragStart?: (event: React.PointerEvent, tubeId: string, position: Vector3) => void;
  onJointPreviewsChange?: (previews: import('../../types').JointPreview[]) => void;
}) {
  // Joint detection
  const { jointPreviews } = useJointDetection({
    tubes,
    selectedTubeId: selectedTubeId || null,
  });

  // Notify parent of joint previews
  useEffect(() => {
    if (onJointPreviewsChange) {
      onJointPreviewsChange(jointPreviews);
    }
  }, [jointPreviews, onJointPreviewsChange]);
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Grid helper */}
      {viewSettings.showGrid && (
        <Grid
          args={[1000, 1000]}
          cellColor="#6f6f6f"
          sectionColor="#9d4b4b"
          cellThickness={0.5}
          sectionThickness={1}
          fadeDistance={500}
          fadeStrength={1}
        />
      )}

      {/* Axes helper */}
      {viewSettings.showAxes && (
        <axesHelper args={[100]} />
      )}

      {/* Render tubes */}
      {tubes.map((tube) => (
        <TubeMesh
          key={tube.id}
          tube={tube}
          viewMode={viewSettings.viewMode}
          selected={tube.id === selectedTubeId}
          isDragging={tube.id === draggedTubeId}
          onSelect={onTubeSelect}
          onDragStart={onDragStart}
        />
      ))}

      {/* Render joint previews */}
      {viewSettings.showJointHighlights &&
        jointPreviews.map((preview, index) => (
          <JointPreviewMesh key={`preview-${index}`} preview={preview} />
        ))}
    </>
  );
}


/**
 * TubeCanvas Component
 * Main 3D canvas for visualizing tubes and joints
 */
export default function TubeCanvas({
  viewSettings,
  cameraSettings,
  tubes = [],
  selectedTubeId,
  onCameraChange,
  onTubeSelect,
  onTubeMove,
  onJointPreviewsChange,
}: TubeCanvasProps) {
  const [draggedTubeId, setDraggedTubeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; tubePosition: Vector3 } | null>(null);

  const handleDragStart = (event: React.PointerEvent, tubeId: string, position: Vector3) => {
    setIsDragging(true);
    setDraggedTubeId(tubeId);
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      tubePosition: [...position] as Vector3,
    };
  };

  // Handle global pointer events for dragging
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!draggedTubeId || !onTubeMove) return;

      // Simplified drag movement - would need proper raycasting in production
      if (!dragStartRef.current) return;
      
      const sensitivity = 0.5;
      const deltaX = event.clientX - dragStartRef.current.x;
      const deltaY = event.clientY - dragStartRef.current.y;

      const newPosition: Vector3 = [
        dragStartRef.current.tubePosition[0] + deltaX * sensitivity,
        dragStartRef.current.tubePosition[1] - deltaY * sensitivity,
        dragStartRef.current.tubePosition[2],
      ];

      onTubeMove(draggedTubeId, newPosition);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDraggedTubeId(null);
      dragStartRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, draggedTubeId, tubes, onTubeMove]);
  return (
    <div className="tube-canvas-container">
      <Canvas
        className="tube-canvas"
        gl={{ antialias: true, alpha: false }}
        camera={{
          position: cameraSettings.position,
          fov: cameraSettings.fov,
          near: cameraSettings.near,
          far: cameraSettings.far,
        }}
        onCreated={({ camera, gl }) => {
          // Set background color
          gl.setClearColor(viewSettings.backgroundColor);
          
          // Update camera look-at target
          if (camera instanceof PerspectiveCamera) {
            camera.lookAt(...cameraSettings.target);
          }
        }}
      >
        <Suspense fallback={null}>
          <SceneContent
            viewSettings={viewSettings}
            tubes={tubes}
            selectedTubeId={selectedTubeId}
            onTubeSelect={onTubeSelect}
            draggedTubeId={draggedTubeId}
            onDragStart={handleDragStart}
            onJointPreviewsChange={onJointPreviewsChange}
          />
          
          {/* Orbit controls for camera manipulation */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={50}
            maxDistance={1000}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            target={cameraSettings.target}
            onChange={(e) => {
              if (e?.target && onCameraChange) {
                const controls = e.target;
                const position: [number, number, number] = [
                  controls.object.position.x,
                  controls.object.position.y,
                  controls.object.position.z,
                ];
                const target: [number, number, number] = [
                  controls.target.x,
                  controls.target.y,
                  controls.target.z,
                ];
                onCameraChange({ position, target });
              }
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
