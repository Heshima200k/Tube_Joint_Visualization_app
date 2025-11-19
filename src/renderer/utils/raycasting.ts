/**
 * Raycasting Utilities
 * Functions for raycasting and 3D picking
 */

import { Raycaster, Vector3, Object3D, Vector2 } from 'three';
import type { RaycastHit } from '../types';

/**
 * Create a raycaster from mouse/pointer coordinates
 */
export function createRaycasterFromMouse(
  mouseX: number,
  mouseY: number,
  camera: THREE.Camera,
  width: number,
  height: number
): Raycaster {
  const raycaster = new Raycaster();
  
  // Normalize mouse coordinates to -1 to +1 range
  const normalizedX = (mouseX / width) * 2 - 1;
  const normalizedY = -(mouseY / height) * 2 + 1;
  
  const mouse = new Vector2(normalizedX, normalizedY);
  raycaster.setFromCamera(mouse, camera);
  
  return raycaster;
}

/**
 * Perform raycast against objects
 */
export function performRaycast(
  raycaster: Raycaster,
  objects: Object3D[]
): RaycastHit | null {
  const intersects = raycaster.intersectObjects(objects, true);
  
  if (intersects.length > 0) {
    const hit = intersects[0];
    return {
      distance: hit.distance,
      point: [hit.point.x, hit.point.y, hit.point.z] as [number, number, number],
      normal: [hit.face?.normal.x || 0, hit.face?.normal.y || 0, hit.face?.normal.z || 0] as [number, number, number],
      objectId: hit.object.userData?.tubeId || '',
    };
  }
  
  return null;
}

/**
 * Convert screen coordinates to world coordinates
 */
export function screenToWorld(
  screenX: number,
  screenY: number,
  camera: THREE.Camera,
  width: number,
  height: number,
  distance: number = 0
): Vector3 {
  const normalizedX = (screenX / width) * 2 - 1;
  const normalizedY = -(screenY / height) * 2 + 1;
  
  const vector = new Vector3(normalizedX, normalizedY, 0.5);
  vector.unproject(camera);
  
  const dir = vector.sub(camera.position).normalize();
  return camera.position.clone().add(dir.multiplyScalar(distance));
}

