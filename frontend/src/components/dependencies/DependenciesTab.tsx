import { useApp } from '../../app/store';

export function DependenciesTab() {
  const { graph, persona, setSelected, setTab } = useApp();

  const filtered = graph.nodes.filter(n => n.personaTags.includes(persona));
  
  const handleRevealClick = (nodeId: string) => {
    setSelected(nodeId);
    setTab('Interactive');
  };

  return (
    <div className="p-4 space-y-2">
      <h3 className="font-semibold text-lg">Dependencies for {persona}</h3>
      <ul className="divide-y">
        {filtered.map(n => (
          <li key={n.id} className="py-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{n.label}</div>
              <div className="text-xs text-gray-500">{n.kind}</div>
            </div>
            <button
              className="text-blue-600 text-sm"
              onClick={() => handleRevealClick(n.id)}
            >
              Reveal in Interactive
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 