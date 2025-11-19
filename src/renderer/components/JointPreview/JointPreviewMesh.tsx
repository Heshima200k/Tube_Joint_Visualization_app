/**
 * JointPreviewMesh Component
 * Visualizes joint preview when tubes are close
 */

import { useMemo } from 'react';
import { MeshStandardMaterial, SphereGeometry } from 'three';
import type { JointPreview } from '../../types';

interface JointPreviewMeshProps {
  preview: JointPreview;
}

/**
 * JointPreviewMesh Component
 * Renders a visual preview of a potential joint
 */
export default function JointPreviewMesh({ preview }: JointPreviewMeshProps) {
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: preview.valid ? '#00ff00' : '#ff0000',
        transparent: true,
        opacity: 0.6,
        emissive: preview.valid ? '#00ff00' : '#ff0000',
        emissiveIntensity: 0.5,
      }),
    [preview.valid]
  );

  const geometry = useMemo(() => new SphereGeometry(5, 16, 16), []);

  if (!preview.valid) return null;

  return (
    <mesh
      position={preview.position}
      rotation={preview.rotation}
      geometry={geometry}
      material={material}
    >
      {/* Optional: Add wireframe sphere */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={preview.valid ? '#00ff00' : '#ff0000'}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </mesh>
  );
}

