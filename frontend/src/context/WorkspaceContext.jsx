/**
 * WorkspaceContext
 * ─────────────────────────────────────────────────────────────────
 * Stores the currently selected workspace so every page can read
 * { workspaceId, workspaceName } without making a redundant API call.
 *
 * Usage:
 *   const { workspaceId, workspaceName, setWorkspace, clearWorkspace } = useWorkspace();
 *
 * The selection is persisted in localStorage so it survives page refresh.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkspaceContext = createContext(null);

const STORAGE_KEY = 'nfp_workspace';

export const WorkspaceProvider = ({ children }) => {
  const [workspace, setWorkspaceState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { workspaceId: null, workspaceName: null };
    } catch {
      return { workspaceId: null, workspaceName: null };
    }
  });

  /** Call this when the user "Enters" a workspace from the Home page */
  const setWorkspace = (workspaceId, workspaceName) => {
    const next = { workspaceId, workspaceName };
    setWorkspaceState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  /** Call this on logout or when workspace is deleted */
  const clearWorkspace = () => {
    setWorkspaceState({ workspaceId: null, workspaceName: null });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <WorkspaceContext.Provider value={{ ...workspace, setWorkspace, clearWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside <WorkspaceProvider>');
  return ctx;
};
