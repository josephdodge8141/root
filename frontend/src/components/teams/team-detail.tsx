import { useState } from 'react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Users } from 'lucide-react';
import { cn } from '../ui/utils';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Viewer' | 'Editor' | 'Admin';
  memberSince: string;
  projectsCreated: number;
}

interface TeamDetailProps {
  teamId: string;
  teamName: string;
  isCurrentUserAdmin: boolean;
}

const mockMembers: TeamMember[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@company.com',
    role: 'Admin',
    memberSince: 'Jan 15, 2023',
    projectsCreated: 8
  },
  {
    id: '2',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    email: 'mike.rodriguez@company.com',
    role: 'Editor',
    memberSince: 'Mar 22, 2023',
    projectsCreated: 5
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Zhang',
    email: 'emily.zhang@company.com',
    role: 'Editor',
    memberSince: 'May 10, 2023',
    projectsCreated: 3
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Johnson',
    email: 'david.johnson@company.com',
    role: 'Viewer',
    memberSince: 'Aug 03, 2023',
    projectsCreated: 1
  }
];

const availableUsers = [
  { id: '5', name: 'Alex Thompson', email: 'alex.thompson@company.com' },
  { id: '6', name: 'Lisa Wang', email: 'lisa.wang@company.com' },
  { id: '7', name: 'Chris Martinez', email: 'chris.martinez@company.com' },
];

export function TeamDetail({ teamId, teamName, isCurrentUserAdmin = true }: TeamDetailProps) {
  const [members, setMembers] = useState<TeamMember[]>(mockMembers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleRoleChange = (memberId: string, newRole: 'Viewer' | 'Editor' | 'Admin') => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ));
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleAddMembers = () => {
    // In a real app, you'd make an API call here
    const newMembers: TeamMember[] = selectedUsers.map(userId => {
      const user = availableUsers.find(u => u.id === userId)!;
      return {
        id: userId,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1],
        email: user.email,
        role: 'Viewer' as const,
        memberSince: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        projectsCreated: 0
      };
    });
    
    setMembers(prev => [...prev, ...newMembers]);
    setSelectedUsers([]);
    setSearchQuery('');
    setShowAddModal(false);
  };

  const filteredUsers = availableUsers.filter(user =>
    searchQuery.length >= 2 && 
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const teamStats = {
    totalMembers: members.length,
    totalProjects: members.reduce((sum, member) => sum + member.projectsCreated, 0),
    adminCount: members.filter(m => m.role === 'Admin').length,
    editorCount: members.filter(m => m.role === 'Editor').length,
    viewerCount: members.filter(m => m.role === 'Viewer').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-medium">{teamName}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span>{teamStats.totalMembers} members</span>
                <span>{teamStats.totalProjects} projects created</span>
              </div>
            </div>
          </div>
          
          {isCurrentUserAdmin && (
            <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add members
            </Button>
          )}
        </div>
        
        {/* Team stats */}
        <div className="flex gap-2">
          <Badge variant="secondary">{teamStats.adminCount} Admin{teamStats.adminCount !== 1 ? 's' : ''}</Badge>
          <Badge variant="secondary">{teamStats.editorCount} Editor{teamStats.editorCount !== 1 ? 's' : ''}</Badge>
          <Badge variant="secondary">{teamStats.viewerCount} Viewer{teamStats.viewerCount !== 1 ? 's' : ''}</Badge>
        </div>
      </div>

      {/* Members table */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First name</TableHead>
              <TableHead>Last name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Member since</TableHead>
              <TableHead># Projects created</TableHead>
              {isCurrentUserAdmin && <TableHead className="w-[70px]">Delete</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => (
              <TableRow 
                key={member.id}
                className={cn(index % 2 === 1 && "bg-muted/25")}
              >
                <TableCell className="font-medium">{member.firstName}</TableCell>
                <TableCell>{member.lastName}</TableCell>
                <TableCell>
                  {isCurrentUserAdmin ? (
                    <Select
                      value={member.role}
                      onValueChange={(value: 'Viewer' | 'Editor' | 'Admin') => 
                        handleRoleChange(member.id, value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline">{member.role}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{member.memberSince}</TableCell>
                <TableCell>{member.projectsCreated}</TableCell>
                {isCurrentUserAdmin && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Members Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add team members</DialogTitle>
            <DialogDescription>
              Add members from the same client.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-search">Search users</Label>
              <Input
                id="user-search"
                placeholder="Type at least 2 characters to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-input-background"
              />
            </div>
            
            {searchQuery.length >= 2 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div 
                      key={user.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted",
                        selectedUsers.includes(user.id) && "bg-primary/10 border border-primary/20"
                      )}
                      onClick={() => {
                        setSelectedUsers(prev => 
                          prev.includes(user.id) 
                            ? prev.filter(id => id !== user.id)
                            : [...prev, user.id]
                        );
                      }}
                    >
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No users found matching "{searchQuery}"
                  </p>
                )}
              </div>
            )}
            
            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <Label>Selected users ({selectedUsers.length})</Label>
                <div className="flex flex-wrap gap-1">
                  {selectedUsers.map(userId => {
                    const user = availableUsers.find(u => u.id === userId);
                    return user ? (
                      <Badge key={userId} variant="secondary" className="text-xs">
                        {user.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMembers}
              disabled={selectedUsers.length === 0}
            >
              Add team members
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}