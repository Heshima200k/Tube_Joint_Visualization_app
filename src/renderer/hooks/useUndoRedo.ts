/**
 * useUndoRedo Hook
 * Implements undo/redo functionality using command pattern
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { AppState } from '../types';

interface UseUndoRedoOptions {
  initialState: AppState;
  onStateChange: (state: AppState) => void;
  maxHistorySize?: number;
}

/**
 * Hook for undo/redo functionality
 */
export function useUndoRedo({
  initialState,
  onStateChange,
  maxHistorySize = 50,
}: UseUndoRedoOptions) {
  const [history, setHistory] = useState<AppState[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isUndoingRef = useRef(false);
  const isRedoingRef = useRef(false);

  const currentState = history[currentIndex];

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const addToHistory = useCallback(
    (newState: AppState) => {
      if (isUndoingRef.current || isRedoingRef.current) {
        return;
      }

      setHistory((prev) => {
        // Remove any states after current index (when undoing then making new change)
        const newHistory = prev.slice(0, currentIndex + 1);
        
        // Add new state
        newHistory.push(newState);
        
        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          setCurrentIndex(maxHistorySize - 1);
          return newHistory;
        }
        
        setCurrentIndex(newHistory.length - 1);
        return newHistory;
      });
    },
    [currentIndex, maxHistorySize]
  );

  const undo = useCallback(() => {
    if (!canUndo) return;

    isUndoingRef.current = true;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    onStateChange(history[newIndex]);
    
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 0);
  }, [canUndo, currentIndex, history, onStateChange]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    isRedoingRef.current = true;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    onStateChange(history[newIndex]);
    
    setTimeout(() => {
      isRedoingRef.current = false;
    }, 0);
  }, [canRedo, currentIndex, history, onStateChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Z (Undo) or Ctrl+Y (Redo)
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          undo();
        } else if ((event.key === 'y' || (event.key === 'z' && event.shiftKey)) && !event.shiftKey) {
          event.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    currentState,
    canUndo,
    canRedo,
    undo,
    redo,
    addToHistory,
  };
}

