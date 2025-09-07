import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { 
  ChevronLeft, 
  ZoomIn, 
  ZoomOut, 
  Github, 
  Cloud, 
  Users, 
  Calendar, 
  Hash, 
  GitBranch,
  ExternalLink,
  FileText,
  Database,
  Server,
  Zap,
  Shield,
  Globe,
  Code2,
  Layers
} from 'lucide-react';

type NodeType = 'vpc' | 'ec2' | 'rds' | 'lambda' | 'api-gateway' | 'react-component' | 'django-template' | 'service' | 'database' | 'cache';

interface Node {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  children?: Node[];
  containedNodes?: Node[];
}

interface Connection {
  from: string;
  to: string;
  type: 'arrow' | 'contains';
  label?: string;
}

interface ProjectWorkspaceProps {
  projectId: string;
  onBack: () => void;
}

const mockProject = {
  id: '1',
  name: 'microservices-arch',
  sources: ['github', 'aws'] as const,
  team: 'Infrastructure',
  createdBy: 'Sarah Chen',
  lastUpdated: '2 hours ago',
  agents: 3,
  nodes: 142,
  edges: 89
};

// Complex AWS architecture with VPC, EC2, RDS, and Lambda
const mockNodes: Node[] = [
  {
    id: 'vpc-main',
    label: 'Main VPC',
    type: 'vpc',
    x: 100,
    y: 100,
    width: 500,
    height: 300,
    containedNodes: [
      {
        id: 'ec2-web-server',
        label: 'Web Server',
        type: 'ec2',
        x: 150,
        y: 180,
        width: 120,
        height: 80,
        children: [
          { id: 'load-balancer', label: 'Load Balancer', type: 'service', x: 50, y: 100 },
          { id: 'app-service', label: 'App Service', type: 'service', x: 200, y: 100 }
        ]
      },
      {
        id: 'rds-database',
        label: 'PostgreSQL DB',
        type: 'rds',
        x: 400,
        y: 180,
        width: 120,
        height: 80,
        children: [
          { id: 'backup-service', label: 'Backup Service', type: 'service', x: 100, y: 150 }
        ]
      }
    ]
  },
  {
    id: 'lambda-processor',
    label: 'Data Processor',
    type: 'lambda',
    x: 700,
    y: 200,
    width: 140,
    height: 100,
    children: [
      { id: 'processing-service', label: 'Processing Service', type: 'service', x: 150, y: 150 },
      { id: 'notification-service', label: 'Notification Service', type: 'service', x: 350, y: 150 }
    ]
  }
];

const mockConnections: Connection[] = [
  { from: 'ec2-web-server', to: 'lambda-processor', type: 'arrow', label: 'API calls' },
  { from: 'ec2-web-server', to: 'rds-database', type: 'arrow', label: 'DB queries' },
  { from: 'vpc-main', to: 'ec2-web-server', type: 'contains' },
  { from: 'vpc-main', to: 'rds-database', type: 'contains' }
];

const getNodeIcon = (type: NodeType) => {
  const iconProps = { className: "w-5 h-5" };
  
  switch (type) {
    case 'vpc':
      return <Shield {...iconProps} className="w-5 h-5 text-blue-600" />;
    case 'ec2':
      return <Server {...iconProps} className="w-5 h-5 text-orange-600" />;
    case 'rds':
      return <Database {...iconProps} className="w-5 h-5 text-blue-500" />;
    case 'lambda':
      return <Zap {...iconProps} className="w-5 h-5 text-yellow-500" />;
    case 'api-gateway':
      return <Globe {...iconProps} className="w-5 h-5 text-purple-600" />;
    case 'react-component':
      return <Code2 {...iconProps} className="w-5 h-5 text-cyan-500" />;
    case 'django-template':
      return <Layers {...iconProps} className="w-5 h-5 text-green-600" />;
    case 'service':
      return <Hash {...iconProps} className="w-5 h-5 text-gray-600" />;
    case 'database':
      return <Database {...iconProps} className="w-5 h-5 text-blue-500" />;
    case 'cache':
      return <Zap {...iconProps} className="w-5 h-5 text-red-500" />;
    default:
      return <Hash {...iconProps} />;
  }
};

const getNodeColors = (type: NodeType, isSelected: boolean) => {
  if (isSelected) {
    return {
      fill: '#4a7c59',
      stroke: '#2d5a27',
      textFill: '#ffffff'
    };
  }
  
  switch (type) {
    case 'vpc':
      return { fill: '#eff6ff', stroke: '#2563eb', textFill: '#1e40af' };
    case 'ec2':
      return { fill: '#fff7ed', stroke: '#ea580c', textFill: '#c2410c' };
    case 'rds':
      return { fill: '#eff6ff', stroke: '#3b82f6', textFill: '#2563eb' };
    case 'lambda':
      return { fill: '#fefce8', stroke: '#eab308', textFill: '#ca8a04' };
    default:
      return { fill: '#ffffff', stroke: '#d1d5d0', textFill: '#1a1a1a' };
  }
};

export function ProjectWorkspace({ projectId, onBack }: ProjectWorkspaceProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [currentNodes, setCurrentNodes] = useState<Node[]>(mockNodes);
  const [persona, setPersona] = useState('code');
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Root']);
  const [currentConnections] = useState<Connection[]>(mockConnections);

  const handleNodeClick = (node: Node, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedNode(node);
  };

  const handleNodeDoubleClick = (node: Node, event: React.MouseEvent) => {
    event.stopPropagation();
    if (node.children && node.children.length > 0) {
      setCurrentNodes(node.children);
      setBreadcrumb(prev => [...prev, node.label]);
    }
  };

  const handleContainerDoubleClick = (node: Node, event: React.MouseEvent) => {
    event.stopPropagation();
    // For containers like VPC, show contained nodes when double-clicked
    if (node.containedNodes && node.containedNodes.length > 0) {
      setCurrentNodes(node.containedNodes);
      setBreadcrumb(prev => [...prev, node.label]);
    } else if (node.children && node.children.length > 0) {
      setCurrentNodes(node.children);
      setBreadcrumb(prev => [...prev, node.label]);
    }
  };

  const handleGoDeeper = () => {
    if (selectedNode?.children && selectedNode.children.length > 0) {
      setCurrentNodes(selectedNode.children);
      setBreadcrumb(prev => [...prev, selectedNode.label]);
    } else if (selectedNode?.containedNodes && selectedNode.containedNodes.length > 0) {
      setCurrentNodes(selectedNode.containedNodes);
      setBreadcrumb(prev => [...prev, selectedNode.label]);
    }
  };

  const handleBackOut = () => {
    if (breadcrumb.length > 1) {
      setCurrentNodes(mockNodes);
      setBreadcrumb(prev => prev.slice(0, -1));
    }
  };

  const getNodeDetails = (node: Node) => {
    const baseDetails = {
      overview: `${node.type.toUpperCase()} resource: ${node.label}`,
      ownership: { team: mockProject.team, user: mockProject.createdBy },
      environments: ['Development', 'Staging', 'Production'],
    };

    switch (node.type) {
      case 'vpc':
        return {
          ...baseDetails,
          overview: `Virtual Private Cloud providing isolated network environment for AWS resources.`,
          links: [
            { type: 'aws-console', url: 'https://console.aws.amazon.com/vpc', label: 'VPC Console' },
            { type: 'terraform', url: 'https://github.com/company/terraform/vpc.tf', label: 'Terraform Config' }
          ],
          evidence: [
            { file: 'infrastructure/vpc.tf', line: 1 },
            { file: 'infrastructure/security-groups.tf', line: 15 },
            { file: 'infrastructure/subnets.tf', line: 8 }
          ],
          crossReferences: node.containedNodes?.map(n => ({ id: n.id, label: n.label })) || []
        };
      case 'ec2':
        return {
          ...baseDetails,
          overview: `EC2 instance running the web application server with auto-scaling capabilities.`,
          links: [
            { type: 'aws-console', url: 'https://console.aws.amazon.com/ec2', label: 'EC2 Console' },
            { type: 'monitoring', url: 'https://cloudwatch.aws.amazon.com', label: 'CloudWatch Metrics' }
          ],
          evidence: [
            { file: 'infrastructure/ec2.tf', line: 20 },
            { file: 'scripts/user-data.sh', line: 1 },
            { file: 'docker/app/Dockerfile', line: 1 }
          ],
          crossReferences: [
            { id: 'rds-database', label: 'PostgreSQL DB' },
            { id: 'lambda-processor', label: 'Data Processor' }
          ]
        };
      case 'rds':
        return {
          ...baseDetails,
          overview: `Managed PostgreSQL database with automated backups and high availability.`,
          links: [
            { type: 'aws-console', url: 'https://console.aws.amazon.com/rds', label: 'RDS Console' },
            { type: 'monitoring', url: 'https://cloudwatch.aws.amazon.com', label: 'DB Metrics' }
          ],
          evidence: [
            { file: 'infrastructure/rds.tf', line: 1 },
            { file: 'database/schema.sql', line: 1 },
            { file: 'database/migrations/', line: 0 }
          ],
          crossReferences: [
            { id: 'ec2-web-server', label: 'Web Server' }
          ]
        };
      case 'lambda':
        return {
          ...baseDetails,
          overview: `Serverless function processing data and handling background tasks.`,
          links: [
            { type: 'aws-console', url: 'https://console.aws.amazon.com/lambda', label: 'Lambda Console' },
            { type: 'repository', url: 'https://github.com/company/lambda-processor', label: 'Source Code' }
          ],
          evidence: [
            { file: 'lambda/processor/handler.py', line: 1 },
            { file: 'lambda/processor/requirements.txt', line: 1 },
            { file: 'infrastructure/lambda.tf', line: 1 }
          ],
          crossReferences: [
            { id: 'ec2-web-server', label: 'Web Server' }
          ]
        };
      default:
        return {
          ...baseDetails,
          links: [
            { type: 'repository', url: 'https://github.com/company/microservices-arch', label: 'GitHub Repository' }
          ],
          evidence: [
            { file: 'src/service/main.go', line: 1 }
          ],
          crossReferences: []
        };
    }
  };

  const nodeDetails = selectedNode ? getNodeDetails(selectedNode) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Sub-bar */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Projects
            </Button>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-medium">{mockProject.name}</Badge>
              <div className="flex gap-1">
                {mockProject.sources.map((source) => (
                  <Badge key={source} variant="secondary" className="flex items-center gap-1">
                    {source === 'github' ? <Github className="w-3 h-3" /> : <Cloud className="w-3 h-3" />}
                    <span className="capitalize">{source}</span>
                  </Badge>
                ))}
              </div>
              <Badge variant="outline">{mockProject.team}</Badge>
              <span className="text-sm text-muted-foreground">by {mockProject.createdBy}</span>
              <span className="text-sm text-muted-foreground">{mockProject.lastUpdated}</span>
              <Badge variant="outline">{mockProject.agents} agents</Badge>
              <Badge variant="outline">{mockProject.nodes} nodes</Badge>
              <Badge variant="outline">{mockProject.edges} edges</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={persona} onValueChange={setPersona}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoDeeper}
                disabled={!selectedNode?.children?.length && !selectedNode?.containedNodes?.length}
                className="flex items-center gap-1"
              >
                <ZoomIn className="w-4 h-4" />
                Go deeper
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackOut}
                disabled={breadcrumb.length <= 1}
                className="flex items-center gap-1"
              >
                <ZoomOut className="w-4 h-4" />
                Back out
              </Button>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          {breadcrumb.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              <span>{crumb}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal">
          {/* Canvas */}
          <ResizablePanel defaultSize={70} minSize={50}>
            <div className="h-full bg-gradient-to-br from-background via-muted/20 to-muted/40 relative overflow-hidden">
              {/* Architecture canvas */}
              <svg className="w-full h-full" viewBox="0 0 1200 800">
                {/* Background pattern */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
                  </pattern>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6b7168" />
                  </marker>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Connection lines */}
                {currentConnections
                  .filter(conn => conn.type === 'arrow')
                  .map((connection, index) => {
                    const fromNode = currentNodes.find(n => n.id === connection.from) || 
                                   currentNodes.flatMap(n => n.containedNodes || []).find(n => n.id === connection.from);
                    const toNode = currentNodes.find(n => n.id === connection.to) || 
                                 currentNodes.flatMap(n => n.containedNodes || []).find(n => n.id === connection.to);
                    
                    if (!fromNode || !toNode) return null;
                    
                    const fromX = fromNode.x + (fromNode.width || 120) / 2;
                    const fromY = fromNode.y + (fromNode.height || 80) / 2;
                    const toX = toNode.x + (toNode.width || 120) / 2;
                    const toY = toNode.y + (toNode.height || 80) / 2;
                    
                    const midX = (fromX + toX) / 2;
                    const midY = (fromY + toY) / 2 - 30;
                    
                    return (
                      <g key={`connection-${index}`}>
                        <path
                          d={`M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`}
                          fill="none"
                          stroke="#6b7168"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                        {connection.label && (
                          <text
                            x={midX}
                            y={midY - 5}
                            textAnchor="middle"
                            className="text-xs fill-current"
                            style={{ fill: "#6b7168" }}
                          >
                            {connection.label}
                          </text>
                        )}
                      </g>
                    );
                  })
                }
                
                {/* Render nodes */}
                {currentNodes.map((node) => {
                  const colors = getNodeColors(node.type, selectedNode?.id === node.id);
                  const isContainer = node.containedNodes && node.containedNodes.length > 0;
                  
                  return (
                    <g key={node.id}>
                      {/* Container nodes (like VPC) */}
                      {isContainer ? (
                        <g>
                          {/* Container background */}
                          <rect
                            x={node.x}
                            y={node.y}
                            width={node.width || 400}
                            height={node.height || 200}
                            rx="16"
                            fill={colors.fill}
                            stroke={colors.stroke}
                            strokeWidth="3"
                            strokeDasharray="8,4"
                            className="cursor-pointer drop-shadow-sm hover:drop-shadow-md transition-all"
                            onClick={(e) => handleNodeClick(node, e as any)}
                          />
                          
                          {/* Container title area - clickable for double click */}
                          <rect
                            x={node.x}
                            y={node.y}
                            width={node.width || 400}
                            height={40}
                            rx="16"
                            fill={colors.stroke}
                            className="cursor-pointer"
                            onDoubleClick={(e) => handleContainerDoubleClick(node, e as any)}
                          />
                          
                          {/* Container title */}
                          <foreignObject
                            x={node.x + 12}
                            y={node.y + 8}
                            width={(node.width || 400) - 24}
                            height={32}
                          >
                            <div className="flex items-center gap-2 text-white">
                              {getNodeIcon(node.type)}
                              <span className="font-medium">{node.label}</span>
                              <span className="text-xs opacity-75 ml-auto">
                                Double-click to explore
                              </span>
                            </div>
                          </foreignObject>
                          
                          {/* Contained nodes */}
                          {node.containedNodes?.map((containedNode) => {
                            const containedColors = getNodeColors(containedNode.type, selectedNode?.id === containedNode.id);
                            return (
                              <g key={containedNode.id}>
                                <rect
                                  x={containedNode.x}
                                  y={containedNode.y}
                                  width={containedNode.width || 120}
                                  height={containedNode.height || 80}
                                  rx="12"
                                  fill={containedColors.fill}
                                  stroke={containedColors.stroke}
                                  strokeWidth="2"
                                  className="cursor-pointer drop-shadow-sm hover:drop-shadow-md transition-all"
                                  onClick={(e) => handleNodeClick(containedNode, e as any)}
                                  onDoubleClick={(e) => handleNodeDoubleClick(containedNode, e as any)}
                                />
                                
                                {/* Icon and label for contained nodes */}
                                <foreignObject
                                  x={containedNode.x + 8}
                                  y={containedNode.y + 8}
                                  width={(containedNode.width || 120) - 16}
                                  height={(containedNode.height || 80) - 16}
                                >
                                  <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="mb-1">{getNodeIcon(containedNode.type)}</div>
                                    <div className="text-sm font-medium" style={{ color: containedColors.textFill }}>
                                      {containedNode.label}
                                    </div>
                                    <div className="text-xs opacity-75 mt-1" style={{ color: containedColors.textFill }}>
                                      {containedNode.type.toUpperCase()}
                                    </div>
                                  </div>
                                </foreignObject>
                                
                                {/* Children indicator for contained nodes */}
                                {containedNode.children && containedNode.children.length > 0 && (
                                  <circle
                                    cx={containedNode.x + (containedNode.width || 120) - 15}
                                    cy={containedNode.y + 15}
                                    r="8"
                                    fill="#4a7c59"
                                    className="cursor-pointer"
                                  />
                                )}
                              </g>
                            );
                          })}
                        </g>
                      ) : (
                        /* Regular nodes */
                        <g>
                          <rect
                            x={node.x}
                            y={node.y}
                            width={node.width || 140}
                            height={node.height || 100}
                            rx="12"
                            fill={colors.fill}
                            stroke={colors.stroke}
                            strokeWidth="2"
                            className="cursor-pointer drop-shadow-sm hover:drop-shadow-md transition-all"
                            onClick={(e) => handleNodeClick(node, e as any)}
                            onDoubleClick={(e) => handleNodeDoubleClick(node, e as any)}
                          />
                          
                          {/* Icon and label for regular nodes */}
                          <foreignObject
                            x={node.x + 8}
                            y={node.y + 8}
                            width={(node.width || 140) - 16}
                            height={(node.height || 100) - 16}
                          >
                            <div className="flex flex-col items-center justify-center h-full text-center">
                              <div className="mb-2">{getNodeIcon(node.type)}</div>
                              <div className="text-sm font-medium" style={{ color: colors.textFill }}>
                                {node.label}
                              </div>
                              <div className="text-xs opacity-75 mt-1" style={{ color: colors.textFill }}>
                                {node.type.toUpperCase()}
                              </div>
                            </div>
                          </foreignObject>
                          
                          {/* Children indicator */}
                          {node.children && node.children.length > 0 && (
                            <circle
                              cx={node.x + (node.width || 140) - 15}
                              cy={node.y + 15}
                              r="8"
                              fill="#4a7c59"
                              className="cursor-pointer"
                            />
                          )}
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
              
              {/* Empty state */}
              {currentNodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="text-6xl mb-4">🔍</div>
                    <p>Select a node to see details</p>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Info panel */}
          <ResizablePanel defaultSize={30} minSize={25}>
            <div className="h-full bg-card border-l overflow-auto">
              {selectedNode && nodeDetails ? (
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getNodeIcon(selectedNode.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedNode.label}</h3>
                        <Badge variant="secondary" className="text-xs">{selectedNode.type.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Overview */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Overview</h4>
                    <p className="text-sm text-muted-foreground">{nodeDetails.overview}</p>
                  </div>
                  
                  {/* Ownership */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Ownership</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{nodeDetails.ownership.team}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{nodeDetails.ownership.user}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Environments */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Environments</h4>
                    <div className="flex gap-1 flex-wrap">
                      {nodeDetails.environments.map((env) => (
                        <Badge key={env} variant="outline" className="text-xs">{env}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Links */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Links</h4>
                    <div className="space-y-2">
                      {nodeDetails.links.map((link, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {link.type === 'repository' ? (
                            <Github className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <GitBranch className="w-4 h-4 text-muted-foreground" />
                          )}
                          <a href={link.url} className="text-primary hover:underline flex items-center gap-1">
                            {link.label}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Evidence */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Evidence</h4>
                    <div className="space-y-1">
                      {nodeDetails.evidence.map((evidence, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm font-mono bg-muted p-2 rounded">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-primary">{evidence.file}</span>
                          <span className="text-muted-foreground">:{evidence.line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Cross-references */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Cross-references</h4>
                    <div className="space-y-1">
                      {nodeDetails.crossReferences.map((ref) => (
                        <div key={ref.id} className="flex items-center gap-2 text-sm">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <button 
                            className="text-primary hover:underline"
                            onClick={() => {
                              const refNode = currentNodes.find(n => n.id === ref.id) || 
                                            currentNodes.flatMap(n => n.containedNodes || []).find(n => n.id === ref.id);
                              if (refNode) setSelectedNode(refNode);
                            }}
                          >
                            {ref.label}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="text-4xl mb-2">📋</div>
                    <p>Select a node to see details</p>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}