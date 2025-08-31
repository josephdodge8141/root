import { useApp } from '../../app/store';

export function Sidebar() {
  const { graph, selectedId, persona } = useApp();
  const node = graph.nodes.find(n => n.id === selectedId);
  return (
    <aside className="w-1/3 p-4 overflow-auto">
      <div className="text-sm text-gray-500 mb-2">Persona: {persona}</div>
      {node ? (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{node.label}</h3>
          <div className="text-xs">Kind: {node.kind}</div>
          <div className="text-xs">Tags: {node.personaTags.join(', ')}</div>
          {/* Cross-links preview (fill later from node.meta) */}
          <div className="mt-3 text-sm font-medium">Context</div>
          <ul className="list-disc ml-5 text-sm">
            <li>Infra pipeline (if any)</li>
            <li>Cloud resources (if any)</li>
            <li>Product feature mapping (if any)</li>
          </ul>
        </div>
      ) : (
        <div className="text-sm text-gray-600">Select a node to see details.</div>
      )}
    </aside>
  );
} 