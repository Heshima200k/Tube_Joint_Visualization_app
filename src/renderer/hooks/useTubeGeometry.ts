/**
 * useTubeGeometry Hook
 * Generates Three.js geometry for rectangular/square tubes
 */

import { useMemo } from 'react';
import { BoxGeometry, BufferGeometry } from 'three';
import type { Tube, TubeParameters, TubeType } from '../types';

/**
 * Create Three.js geometry for a tube
 * Uses BoxGeometry as a simplified representation
 * Full implementation would create proper hollow rectangular geometry
 */
export function createTubeGeometry(
  params: TubeParameters,
  type: TubeType
): BufferGeometry {
  const { width, height, length } = params;
  
  // For square tubes, use the larger dimension for both width and height
  const w = type === 'square' ? Math.max(width, height) : width;
  const h = type === 'square' ? Math.max(width, height) : height;
  
  // Create outer box geometry
  const geometry = new BoxGeometry(w, h, length);
  
  // For now, return the geometry as-is
  // TODO: Implement proper hollow geometry by creating a CSG subtraction
  // or using a custom BufferGeometry with proper vertices/indices
  return geometry;
}

/**
 * Hook to generate tube geometry
 * Returns a Three.js BufferGeometry for the tube
 */
export function useTubeGeometry(tube: Tube) {
  return useMemo(() => {
    return createTubeGeometry(tube.parameters, tube.type);
  }, [
    tube.parameters.width,
    tube.parameters.height,
    tube.parameters.thickness,
    tube.parameters.length,
    tube.type,
  ]);
}

