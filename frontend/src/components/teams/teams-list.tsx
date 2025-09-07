import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Team {
  id: string;
  name: string;
  memberCount: number;
  projectCount: number;
}

interface TeamsListProps {
  onTeamSelect: (teamId: string) => void;
}

const mockTeams: Team[] = [
  { id: '1', name: 'Infrastructure', memberCount: 8, projectCount: 12 },
  { id: '2', name: 'Backend', memberCount: 6, projectCount: 8 },
  { id: '3', name: 'Frontend', memberCount: 5, projectCount: 6 },
  { id: '4', name: 'Data', memberCount: 4, projectCount: 3 },
];

export function TeamsList({ onTeamSelect }: TeamsListProps) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-medium">Teams</h1>
      
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead># Members</TableHead>
              <TableHead># Projects</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTeams.map((team, index) => (
              <TableRow 
                key={team.id}
                className={`cursor-pointer hover:bg-muted/50 ${index % 2 === 1 ? 'bg-muted/25' : ''}`}
                onClick={() => onTeamSelect(team.id)}
              >
                <TableCell className="font-medium text-primary">{team.name}</TableCell>
                <TableCell>{team.memberCount}</TableCell>
                <TableCell>{team.projectCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}