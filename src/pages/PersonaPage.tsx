import { useApp } from '../app/store';
import { DiagramCanvas } from '../components/diagram/DiagramCanvas';
import { DependenciesTab } from '../components/dependencies/DependenciesTab';
import { ReactFlowProvider } from '@xyflow/react';

export function PersonaPage() {
  const { tab } = useApp();
  
  if (tab === 'Interactive') {
    return (
      <ReactFlowProvider>
        <DiagramCanvas />
      </ReactFlowProvider>
    );
  }

  return <DependenciesTab />;
} 