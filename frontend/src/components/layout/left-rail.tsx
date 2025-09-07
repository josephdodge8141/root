import { useState } from 'react';
import { Button } from '../ui/button';
import { Leaf, ChevronLeft, ChevronRight, FolderOpen, Users } from 'lucide-react';
import { cn } from '../ui/utils';

interface LeftRailProps {
  activeSection: 'projects' | 'teams';
  onSectionChange: (section: 'projects' | 'teams') => void;
}

export function LeftRail({ activeSection, onSectionChange }: LeftRailProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <aside className={cn(
      "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200",
      isExpanded ? "w-60" : "w-16"
    )}>
      {/* Brand lockup */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          {isExpanded && (
            <span className="font-medium text-sidebar-foreground">root</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          <Button
            variant={activeSection === 'projects' ? 'default' : 'ghost'}
            className={cn(
              "w-full justify-start gap-3 h-10",
              !isExpanded && "px-2 justify-center"
            )}
            onClick={() => onSectionChange('projects')}
          >
            <FolderOpen className="w-5 h-5" />
            {isExpanded && <span>Projects</span>}
          </Button>
          
          <Button
            variant={activeSection === 'teams' ? 'default' : 'ghost'}
            className={cn(
              "w-full justify-start gap-3 h-10",
              !isExpanded && "px-2 justify-center"
            )}
            onClick={() => onSectionChange('teams')}
          >
            <Users className="w-5 h-5" />
            {isExpanded && <span>Teams</span>}
          </Button>
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full",
            !isExpanded && "px-2 justify-center"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}