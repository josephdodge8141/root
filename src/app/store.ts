import { create } from 'zustand';
import type { GraphDoc, Persona } from '../lib/graphTypes';

type Tab = 'Interactive' | 'Dependencies';

interface AppState {
  persona: Persona;
  tab: Tab;
  graph: GraphDoc;
  selectedId?: string;
  setPersona: (p: Persona) => void;
  setTab: (t: Tab) => void;
  setGraph: (g: GraphDoc) => void;
  setSelected: (id?: string) => void;
}

export const useApp = create<AppState>((set) => ({
  persona: 'Code',
  tab: 'Interactive',
  graph: { nodes: [], edges: [] },
  selectedId: undefined,
  setPersona: (persona) => set({ persona }),
  setTab: (tab) => set({ tab }),
  setGraph: (graph) => set({ graph }),
  setSelected: (selectedId) => set({ selectedId }),
})); 