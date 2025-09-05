import type { GraphDoc } from '../../lib/graphTypes';

// A singleton promise to ensure we only initialize ELK once.
let elkPromise: Promise<any> | null = null;

const getElk = () => {
  if (!elkPromise) {
    // Dynamically import the library. As you've pointed out, there is no '.default' export.
    // For this kind of UMD module, the dynamic import often resolves directly to the
    // constructor function itself, rather than a module namespace object.
    elkPromise = import('elkjs/lib/elk.bundled.js').then((ElkConstructor) => {
      return new ElkConstructor();
    });
  }
  return elkPromise;
};

export async function layoutGraph(g: GraphDoc) {
  const elk = await getElk();

  const elkGraph = {
    id: 'root',
    layoutOptions: { 'elk.algorithm': 'layered', 'elk.layered.spacing.nodeNodeBetweenLayers': '60' },
    children: g.nodes.map(n => ({
      id: n.id,
      width: 180,
      height: 60,
      labels: [{ text: n.label }],
    })),
    edges: g.edges.map(e => ({ id: e.id, sources: [e.from], targets: [e.to] })),
  };
  const res = await elk.layout(elkGraph as any);
  const nodeRects = Object.fromEntries(res.children!.map(c => [c.id, c]));
  return {
    nodes: g.nodes.map(n => ({
      id: n.id, data: { label: n.label }, position: { x: nodeRects[n.id].x, y: nodeRects[n.id].y },
      style: { width: 180, height: 60 }
    })),
    edges: g.edges.map(e => ({ id: e.id, source: e.from, target: e.to }))
  };
} 