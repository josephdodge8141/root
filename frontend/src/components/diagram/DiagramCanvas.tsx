import { useEffect, useState, useCallback, useMemo } from 'react';
import { useApp } from '../../app/store';
import { ReactFlow, Background, Controls, MiniMap, Panel, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng, toSvg } from 'html-to-image';
import { layoutGraph } from './useElkLayout';
import { graphToMermaid } from './exportMermaid';

function download(dataUrl: string, name: string) {
  const a = document.createElement('a');
  a.setAttribute('download', name);
  a.setAttribute('href', dataUrl);
  a.click();
}

export function DiagramCanvas() {
  const { graph, setSelected, persona, selectedId } = useApp();
  const { fitView } = useReactFlow();
  const [flow, setFlow] = useState<{nodes:any[]; edges:any[]}>({ nodes: [], edges: [] });

  const filteredGraph = useMemo(() => {
    const nodes = graph.nodes.filter(n => n.personaTags.includes(persona));
    const nodeIds = new Set(nodes.map(n => n.id));
    const edges = graph.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
    return { nodes, edges };
  }, [graph, persona]);

  useEffect(() => {
    if (filteredGraph.nodes.length > 0) {
      layoutGraph(filteredGraph).then(setFlow);
    } else {
      setFlow({ nodes: [], edges: [] });
    }
  }, [filteredGraph]);

  useEffect(() => {
    if (selectedId) {
      const node = flow.nodes.find(n => n.id === selectedId);
      if (node) {
        fitView({ nodes: [{ id: selectedId }], duration: 300, padding: 0.2 });
      }
    }
  }, [selectedId, fitView, flow.nodes]);


  const handleExportPNG = useCallback(() => {
    const flowEl = document.querySelector('.react-flow');
    if (flowEl) {
      toPng(flowEl as HTMLElement, { cacheBust: true, pixelRatio: 2 })
        .then((dataUrl) => download(dataUrl, 'graph.png'));
    }
  }, []);

  const handleExportSVG = useCallback(() => {
    const flowEl = document.querySelector('.react-flow');
    if (flowEl) {
      toSvg(flowEl as HTMLElement, { cacheBust: true })
        .then((dataUrl) => download(dataUrl, 'graph.svg'));
    }
  }, []);

  const handleExportMermaid = useCallback(() => {
    const mermaidString = graphToMermaid(filteredGraph);
    const dataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(mermaidString)}`;
    download(dataUrl, 'graph.mmd');
  }, [filteredGraph]);

  return (
    <div className="h-full">
      <ReactFlow
        nodes={flow.nodes}
        edges={flow.edges}
        onNodeClick={(_, n) => setSelected(n.id)}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
        <Panel position="top-right">
          <div className="flex gap-2">
            <button onClick={handleExportPNG} className="px-3 py-1 bg-gray-100 rounded text-sm">Export PNG</button>
            <button onClick={handleExportSVG} className="px-3 py-1 bg-gray-100 rounded text-sm">Export SVG</button>
            <button onClick={handleExportMermaid} className="px-3 py-1 bg-gray-100 rounded text-sm">Export Mermaid</button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
} 