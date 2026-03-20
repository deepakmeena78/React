// src/hooks/useHistory.js
import { useState, useCallback } from 'react';

/**
 * useHistory — Manages undo/redo stack for editor state
 * @param {Object} initial - initial snapshot
 * @param {number} maxSteps - max history length (default 50)
 */
export default function useHistory(initial, maxSteps = 50) {
  const [stack, setStack] = useState([initial]);
  const [cursor, setCursor] = useState(0);

  const canUndo = cursor > 0;
  const canRedo = cursor < stack.length - 1;
  const current = stack[cursor];

  /** Push a new snapshot — trims redo tail */
  const push = useCallback((snapshot) => {
    setStack(prev => {
      const trimmed = prev.slice(0, cursor + 1);
      const next = [...trimmed, snapshot];
      return next.length > maxSteps ? next.slice(next.length - maxSteps) : next;
    });
    setCursor(prev => Math.min(prev + 1, maxSteps - 1));
  }, [cursor, maxSteps]);

  /** Step back one */
  const undo = useCallback(() => {
    if (canUndo) setCursor(c => c - 1);
  }, [canUndo]);

  /** Step forward one */
  const redo = useCallback(() => {
    if (canRedo) setCursor(c => c + 1);
  }, [canRedo]);

  /** Clear history and reset to new initial */
  const clear = useCallback((newInitial) => {
    setStack([newInitial]);
    setCursor(0);
  }, []);

  return { current, push, undo, redo, clear, canUndo, canRedo, historyLength: stack.length };
}