export type Persona = 'Code' | 'Infrastructure' | 'Cloud' | 'Product';
export type NodeKind = 'service' | 'endpoint' | 'resource' | 'workflow' | 'feature' | 'package' | 'var' | 'db';

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  personaTags: Persona[];
  meta?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  rel:
    | 'relies_on' | 'exposed_via' | 'deployed_by' | 'reads_writes'
    | 'publishes_to' | 'consumes_from' | 'secured_by' | 'runs_in'
    | 'uses_package' | 'requires_var';
  meta?: Record<string, unknown>;
}

export interface GraphDoc {
  nodes: GraphNode[];
  edges: GraphEdge[];
} 