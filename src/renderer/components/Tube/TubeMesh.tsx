/**
 * TubeMesh Component
 * Renders a single tube as a 3D mesh
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';
import type { Mesh } from 'three';
import { useTubeGeometry } from '../../hooks/useTubeGeometry';
import type { Tube, ViewMode } from '../../types';

interface TubeMeshProps {
  tube: Tube;
  viewMode: ViewMode;
  selected?: boolean;
  isDragging?: boolean;
  onSelect?: (tubeId: string) => void;
  onDragStart?: (event: React.PointerEvent, tubeId: string, position: [number, number, number]) => void;
}

/**
 * TubeMesh Component
 * Renders a tube in the 3D scene
 */
export default function TubeMesh({
  tube,
  viewMode,
  selected = false,
  isDragging = false,
  onSelect,
  onDragStart,
}: TubeMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const geometry = useTubeGeometry(tube);

  // Material based on view mode and selection state
  const material = useMemo(() => {
    let color = tube.color || '#4a90e2';
    
    if (isDragging) {
      color = '#ffa500'; // Orange when dragging
    } else if (selected) {
      color = '#ff6b6b'; // Red when selected
    }
    
    if (viewMode === 'wireframe') {
      return new MeshStandardMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
    }
    
    return new MeshStandardMaterial({
      color,
      metalness: 0.3,
      roughness: 0.7,
      transparent: selected || isDragging,
      opacity: selected || isDragging ? 0.9 : 1.0,
    });
  }, [viewMode, selected, isDragging, tube.color]);

  // Update position and rotation
  useFrame(() => {
    if (meshRef.current) {
      const [x, y, z] = tube.position;
      meshRef.current.position.set(x, y, z);
      const [rx, ry, rz] = tube.rotation;
      meshRef.current.rotation.set(rx, ry, rz);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(tube.id);
    }
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (onDragStart) {
      onDragStart(e.nativeEvent, tube.id, tube.position);
    }
    if (onSelect) {
      onSelect(tube.id);
    }
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Optional: Add wireframe overlay for 'both' mode */}
      {viewMode === 'both' && (
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color={tube.color || '#4a90e2'}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </mesh>
  );
}

