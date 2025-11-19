/**
 * Parent-Child Relationship Utilities
 * Functions for managing parent-child relationships between tubes
 */

import type { Tube, Joint } from '../types';

/**
 * Get all child tubes of a parent tube
 */
export function getChildTubes(parentId: string, tubes: Tube[]): Tube[] {
  return tubes.filter((tube) => tube.parentId === parentId);
}

/**
 * Get parent tube of a child tube
 */
export function getParentTube(childTube: Tube, tubes: Tube[]): Tube | null {
  if (!childTube.parentId) return null;
  return tubes.find((tube) => tube.id === childTube.parentId) || null;
}

/**
 * Create a parent-child relationship between two tubes
 */
export function createParentChildRelationship(
  parentId: string,
  childId: string,
  tubes: Tube[]
): Tube[] {
  return tubes.map((tube) =>
    tube.id === childId ? { ...tube, parentId } : tube
  );
}

/**
 * Remove parent-child relationship
 */
export function removeParentChildRelationship(
  childId: string,
  tubes: Tube[]
): Tube[] {
  return tubes.map((tube) => {
    if (tube.id === childId) {
      const { parentId, ...rest } = tube;
      return rest as Tube;
    }
    return tube;
  });
}

/**
 * Update child positions when parent moves
 */
export function updateChildPositions(
  parentId: string,
  parentDelta: [number, number, number],
  tubes: Tube[]
): Tube[] {
  return tubes.map((tube) => {
    if (tube.parentId === parentId) {
      return {
        ...tube,
        position: [
          tube.position[0] + parentDelta[0],
          tube.position[1] + parentDelta[1],
          tube.position[2] + parentDelta[2],
        ],
      };
    }
    return tube;
  });
}

/**
 * Create joint and establish parent-child relationship
 */
export function createJointWithRelationship(
  parentTube: Tube,
  childTube: Tube,
  joint: Joint,
  tubes: Tube[]
): { tubes: Tube[]; joint: Joint } {
  const updatedTubes = createParentChildRelationship(
    parentTube.id,
    childTube.id,
    tubes
  );

  return {
    tubes: updatedTubes,
    joint,
  };
}




