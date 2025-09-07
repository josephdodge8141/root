import { useState } from 'react';
import { AppShell } from './components/layout/app-shell';
import { LoginForm } from './components/auth/login-form';
import { ProjectsList } from './components/projects/projects-list';
import { NewProjectModal } from './components/projects/new-project-modal';
import { ProjectWorkspace } from './components/projects/project-workspace';
import { TeamsList } from './components/teams/teams-list';
import { TeamDetail } from './components/teams/team-detail';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

type AppState = 
  | { type: 'login' }
  | { type: 'projects' }
  | { type: 'project-workspace'; projectId: string }
  | { type: 'teams' }
  | { type: 'team-detail'; teamId: string; teamName: string };

export default function App() {
  const [appState, setAppState] = useState<AppState>({ type: 'login' });
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const handleLogin = () => {
    setAppState({ type: 'projects' });
    toast.success('Welcome back!');
  };

  const handleSectionChange = (section: 'projects' | 'teams') => {
    if (section === 'projects') {
      setAppState({ type: 'projects' });
    } else {
      setAppState({ type: 'teams' });
    }
  };

  const handleOpenProject = (projectId: string) => {
    setAppState({ type: 'project-workspace', projectId });
  };

  const handleBackToProjects = () => {
    setAppState({ type: 'projects' });
  };

  const handleTeamSelect = (teamId: string) => {
    const teamNames: Record<string, string> = {
      '1': 'Infrastructure',
      '2': 'Backend', 
      '3': 'Frontend',
      '4': 'Data'
    };
    
    setAppState({ 
      type: 'team-detail', 
      teamId, 
      teamName: teamNames[teamId] || 'Unknown Team' 
    });
  };

  const handleBackToTeams = () => {
    setAppState({ type: 'teams' });
  };

  const handleCreateProject = (project: any) => {
    console.log('Creating project:', project);
    toast.success(`Project "${project.name}" created successfully!`);
    setShowNewProjectModal(false);
  };

  if (appState.type === 'login') {
    return (
      <>
        <LoginForm onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  const currentSection = appState.type === 'projects' || appState.type === 'project-workspace' 
    ? 'projects' 
    : 'teams';

  return (
    <>
      <AppShell 
        activeSection={currentSection}
        onSectionChange={handleSectionChange}
      >
        {appState.type === 'projects' && (
          <ProjectsList
            onNewProject={() => setShowNewProjectModal(true)}
            onOpenProject={handleOpenProject}
          />
        )}
        
        {appState.type === 'project-workspace' && (
          <ProjectWorkspace
            projectId={appState.projectId}
            onBack={handleBackToProjects}
          />
        )}
        
        {appState.type === 'teams' && (
          <TeamsList onTeamSelect={handleTeamSelect} />
        )}
        
        {appState.type === 'team-detail' && (
          <TeamDetail
            teamId={appState.teamId}
            teamName={appState.teamName}
            isCurrentUserAdmin={true}
          />
        )}
      </AppShell>

      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
        onCreate={handleCreateProject}
      />

      <Toaster position="top-right" />
    </>
  );
}