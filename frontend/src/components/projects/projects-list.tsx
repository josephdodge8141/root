import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Search, Filter, MoreHorizontal, Github, Cloud, Users, Calendar, Hash, GitBranch } from 'lucide-react';
import { cn } from '../ui/utils';

interface Project {
  id: string;
  name: string;
  sources: ('github' | 'aws')[];
  team: string;
  createdBy: string;
  lastUpdated: string;
  agents: number;
  nodes: number;
  edges: number;
}

interface ProjectsListProps {
  onNewProject: () => void;
  onOpenProject: (projectId: string) => void;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'microservices-arch',
    sources: ['github', 'aws'],
    team: 'Infrastructure',
    createdBy: 'Sarah Chen',
    lastUpdated: '2 hours ago',
    agents: 3,
    nodes: 142,
    edges: 89
  },
  {
    id: '2',
    name: 'payment-gateway',
    sources: ['github'],
    team: 'Backend',
    createdBy: 'Mike Rodriguez',
    lastUpdated: '5 hours ago',
    agents: 2,
    nodes: 78,
    edges: 45
  },
  {
    id: '3',
    name: 'user-analytics',
    sources: ['aws'],
    team: 'Data',
    createdBy: 'Emily Zhang',
    lastUpdated: '1 day ago',
    agents: 1,
    nodes: 203,
    edges: 156
  }
];

export function ProjectsList({ onNewProject, onOpenProject }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState('week');
  const [sortBy, setSortBy] = useState('updated');

  const filteredProjects = mockProjects.filter(project => {
    if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedTeam && project.team !== selectedTeam) {
      return false;
    }
    if (selectedUser && project.createdBy !== selectedUser) {
      return false;
    }
    if (selectedSources.length > 0 && !selectedSources.some(source => project.sources.includes(source as any))) {
      return false;
    }
    return true;
  });

  const SourceIcon = ({ source }: { source: 'github' | 'aws' }) => {
    return source === 'github' ? 
      <Github className="w-4 h-4" /> : 
      <Cloud className="w-4 h-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Projects</h1>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-input-background"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Data">Data</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                <SelectItem value="Mike Rodriguez">Mike Rodriguez</SelectItem>
                <SelectItem value="Emily Zhang">Emily Zhang</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              {['github', 'aws'].map((source) => (
                <Button
                  key={source}
                  variant={selectedSources.includes(source) ? 'default' : 'outline'}
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setSelectedSources(prev => 
                      prev.includes(source) 
                        ? prev.filter(s => s !== source)
                        : [...prev, source]
                    );
                  }}
                >
                  <SourceIcon source={source as any} />
                  <span className="ml-1 capitalize">{source}</span>
                </Button>
              ))}
            </div>

            <Tabs value={timeFilter} onValueChange={setTimeFilter} className="ml-2">
              <TabsList>
                <TabsTrigger value="hour">Last hour</TabsTrigger>
                <TabsTrigger value="day">Last day</TabsTrigger>
                <TabsTrigger value="week">Last week</TabsTrigger>
                <TabsTrigger value="month">Last month</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last updated</SelectItem>
                <SelectItem value="nodes">Node count</SelectItem>
                <SelectItem value="edges">Edge count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={onNewProject} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Projects table */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sources</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Last updated</TableHead>
              <TableHead>Agents</TableHead>
              <TableHead>Nodes</TableHead>
              <TableHead>Edges</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <TableRow 
                  key={project.id} 
                  className={cn("cursor-pointer hover:bg-muted/50", index % 2 === 1 && "bg-muted/25")}
                  onClick={() => onOpenProject(project.id)}
                >
                  <TableCell className="font-medium text-primary">
                    {project.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {project.sources.map((source) => (
                        <Badge key={source} variant="secondary" className="flex items-center gap-1">
                          <SourceIcon source={source} />
                          <span className="capitalize">{source}</span>
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{project.team}</TableCell>
                  <TableCell>{project.createdBy}</TableCell>
                  <TableCell className="text-muted-foreground">{project.lastUpdated}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.agents}</Badge>
                  </TableCell>
                  <TableCell>{project.nodes}</TableCell>
                  <TableCell>{project.edges}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onOpenProject(project.id)}>
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-6xl mb-2">🌱</div>
                    <p>No projects yet — create one to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}