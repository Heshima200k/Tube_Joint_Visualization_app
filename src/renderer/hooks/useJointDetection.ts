/**
 * useJointDetection Hook
 * Detects when tubes are close/intersecting and calculates joint preview
 */

import { useMemo } from 'react';
import { areTubesClose, calculateTubeIntersection } from '../utils/geometry';
import type { Tube, JointPreview } from '../types';

interface UseJointDetectionOptions {
  tubes: Tube[];
  selectedTubeId: string | null;
  detectionThreshold?: number;
}

/**
 * Hook for joint detection
 */
export function useJointDetection({
  tubes,
  selectedTubeId,
  detectionThreshold = 20,
}: UseJointDetectionOptions) {
  const jointPreviews = useMemo(() => {
    if (!selectedTubeId) return [];

    const selectedTube = tubes.find((t) => t.id === selectedTubeId);
    if (!selectedTube) return [];

    const previews: JointPreview[] = [];

    for (const tube of tubes) {
      if (tube.id === selectedTubeId) continue;

      const isClose = areTubesClose(selectedTube, tube, detectionThreshold);
      if (isClose) {
        const intersection = calculateTubeIntersection(selectedTube, tube);
        
        if (intersection) {
          // Calculate angle between tubes (simplified)
          const angle = 90; // TODO: Calculate actual angle
          
          previews.push({
            parentTubeId: tube.id,
            position: intersection,
            rotation: [0, 0, 0], // TODO: Calculate proper rotation
            angle,
            valid: true,
            intersectionData: {
              points: [intersection],
              normal: [0, 1, 0], // TODO: Calculate proper normal
            },
          });
        }
      }
    }

    return previews;
  }, [tubes, selectedTubeId, detectionThreshold]);

  return {
    jointPreviews,
    hasPreviews: jointPreviews.length > 0,
  };
}

