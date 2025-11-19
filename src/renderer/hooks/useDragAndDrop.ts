/**
 * useDragAndDrop Hook
 * Handles drag and drop functionality for tubes
 */

import { useState, useCallback, useRef } from 'react';
import type { Vector3 } from '../types';

interface UseDragAndDropOptions {
  onTubeMove: (tubeId: string, position: Vector3) => void;
}

/**
 * Hook for drag and drop functionality
 */
export function useDragAndDrop({
  onTubeMove,
}: UseDragAndDropOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTubeId, setDraggedTubeId] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; tubePosition: Vector3 } | null>(null);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent, tubeId: string, tubePosition: Vector3) => {
      event.stopPropagation();
      setIsDragging(true);
      setDraggedTubeId(tubeId);
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        tubePosition: [...tubePosition] as Vector3,
      };
    },
    []
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!isDragging || !draggedTubeId || !dragStartRef.current) return;

      const deltaX = event.clientX - dragStartRef.current.x;
      const deltaY = event.clientY - dragStartRef.current.y;

      // Convert screen delta to world space movement
      // This is a simplified version - proper implementation would use raycasting
      const sensitivity = 0.5;
      const worldDeltaX = deltaX * sensitivity;
      const worldDeltaY = -deltaY * sensitivity; // Invert Y for screen-to-world

      const newPosition: Vector3 = [
        dragStartRef.current.tubePosition[0] + worldDeltaX,
        dragStartRef.current.tubePosition[1] + worldDeltaY,
        dragStartRef.current.tubePosition[2],
      ];

      onTubeMove(draggedTubeId, newPosition);
    },
    [isDragging, draggedTubeId, onTubeMove]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setDraggedTubeId(null);
    dragStartRef.current = null;
  }, []);

  return {
    isDragging,
    draggedTubeId,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}

