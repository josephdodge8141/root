import { ReactNode } from 'react';
import { LeftRail } from './left-rail';
import { TopNavbar } from './top-navbar';

interface AppShellProps {
  children: ReactNode;
  activeSection: 'projects' | 'teams';
  onSectionChange: (section: 'projects' | 'teams') => void;
}

export function AppShell({ children, activeSection, onSectionChange }: AppShellProps) {
  return (
    <div className="h-screen flex">
      <LeftRail activeSection={activeSection} onSectionChange={onSectionChange} />
      
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}