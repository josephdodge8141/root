import type { GraphDoc } from '../../lib/graphTypes';

export function graphToMermaid(g: GraphDoc) {
  // Flowchart LR by default
  const header = 'flowchart LR';
  const nodes = g.nodes.map(n => `${sanitize(n.id)}["${escape(n.label)}"]`).join('\\n');
  const edges = g.edges.map(e => `${sanitize(e.from)} -->|${e.rel}| ${sanitize(e.to)}`).join('\\n');
  return [header, nodes, edges].join('\\n');
}

function sanitize(id: string) {
  return id.replace(/[^A-Za-z0-9_]/g, '_');
}
function escape(s: string) {
  return s.replace(/"/g, '\\"');
} 