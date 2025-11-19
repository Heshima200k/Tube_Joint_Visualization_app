/**
 * useRotation Hook
 * Handles rotation controls for tubes
 */

import { useState, useCallback } from 'react';
import { snapRotation } from '../utils/snapAngles';
import type { Tube, Rotation } from '../types';

interface UseRotationOptions {
  tubes: Tube[];
  onTubeRotate: (tubeId: string, rotation: Rotation) => void;
  snapToAngle?: boolean;
  snapThreshold?: number;
}

/**
 * Hook for rotation functionality
 */
export function useRotation({
  tubes,
  onTubeRotate,
  snapToAngle = false,
  snapThreshold = 5,
}: UseRotationOptions) {
  const [isRotating, setIsRotating] = useState(false);
  const [rotatedTubeId, setRotatedTubeId] = useState<string | null>(null);

  const rotateTube = useCallback(
    (tubeId: string, axis: 'x' | 'y' | 'z', delta: number) => {
      const tube = tubes.find((t) => t.id === tubeId);
      if (!tube) return;

      const [rx, ry, rz] = tube.rotation;
      let newRotation: Rotation;

      switch (axis) {
        case 'x':
          newRotation = [rx + delta, ry, rz];
          break;
        case 'y':
          newRotation = [rx, ry + delta, rz];
          break;
        case 'z':
          newRotation = [rx, ry, rz + delta];
          break;
      }

      // Apply snapping if enabled
      if (snapToAngle) {
        newRotation = snapRotation(newRotation, snapThreshold);
      }

      onTubeRotate(tubeId, newRotation);
    },
    [tubes, onTubeRotate, snapToAngle, snapThreshold]
  );

  const setRotation = useCallback(
    (tubeId: string, rotation: Rotation) => {
      let finalRotation = rotation;
      
      // Apply snapping if enabled
      if (snapToAngle) {
        finalRotation = snapRotation(rotation, snapThreshold);
      }

      onTubeRotate(tubeId, finalRotation);
    },
    [onTubeRotate, snapToAngle, snapThreshold]
  );

  return {
    isRotating,
    rotatedTubeId,
    rotateTube,
    setRotation,
    setIsRotating,
    setRotatedTubeId,
  };
}

