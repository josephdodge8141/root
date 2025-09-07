import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { Github, Cloud, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (project: any) => void;
}

export function NewProjectModal({ open, onOpenChange, onCreate }: NewProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [awsCredentials, setAwsCredentials] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: ''
  });

  const totalSteps = getTotalSteps();
  const progress = (currentStep / totalSteps) * 100;

  function getTotalSteps() {
    let steps = 2; // Details + Review
    if (selectedSources.includes('github')) steps++;
    if (selectedSources.includes('aws')) steps++;
    return steps;
  }

  const handleNext = () => {
    const nextStep = getNextStep();
    if (nextStep) {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = getPrevStep();
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  function getNextStep() {
    if (currentStep === 1) {
      if (selectedSources.includes('github')) return 2;
      if (selectedSources.includes('aws')) return selectedSources.includes('github') ? 3 : 2;
      return getTotalSteps(); // Go to review
    }
    if (currentStep === 2 && selectedSources.includes('github')) {
      if (selectedSources.includes('aws')) return 3;
      return getTotalSteps(); // Go to review
    }
    if (currentStep === 2 && selectedSources.includes('aws')) {
      return getTotalSteps(); // Go to review
    }
    if (currentStep === 3) {
      return getTotalSteps(); // Go to review
    }
    return null;
  }

  function getPrevStep() {
    if (currentStep === getTotalSteps()) {
      if (selectedSources.includes('aws')) {
        return selectedSources.includes('github') ? 3 : 2;
      }
      if (selectedSources.includes('github')) return 2;
      return 1;
    }
    if (currentStep === 3) return 2;
    if (currentStep === 2) return 1;
    return null;
  }

  const handleCreate = () => {
    const project = {
      name: projectName,
      team: selectedTeam,
      sources: selectedSources,
      githubUrl: selectedSources.includes('github') ? githubUrl : undefined,
      awsCredentials: selectedSources.includes('aws') ? awsCredentials : undefined
    };
    onCreate(project);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setProjectName('');
    setSelectedTeam('');
    setSelectedSources([]);
    setGithubUrl('');
    setAwsCredentials({
      accessKeyId: '',
      secretAccessKey: '',
      sessionToken: ''
    });
  };

  const isStep1Valid = projectName.trim() && selectedTeam && selectedSources.length > 0;
  const isStep2Valid = !selectedSources.includes('github') || githubUrl.trim();
  const isStep3Valid = !selectedSources.includes('aws') || 
    (awsCredentials.accessKeyId.trim() && awsCredentials.secretAccessKey.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <div className="flex items-center gap-2 mt-4">
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
            <Progress value={progress} className="flex-1" />
          </div>
        </DialogHeader>

        <div className="py-6">
          {/* Step 1: Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project name</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Sources to analyze</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="github"
                      checked={selectedSources.includes('github')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSources(prev => [...prev, 'github']);
                        } else {
                          setSelectedSources(prev => prev.filter(s => s !== 'github'));
                        }
                      }}
                    />
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      GitHub
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="aws"
                      checked={selectedSources.includes('aws')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSources(prev => [...prev, 'aws']);
                        } else {
                          setSelectedSources(prev => prev.filter(s => s !== 'aws'));
                        }
                      }}
                    />
                    <Label htmlFor="aws" className="flex items-center gap-2">
                      <Cloud className="w-4 h-4" />
                      AWS
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: GitHub (conditional) */}
          {currentStep === 2 && selectedSources.includes('github') && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github-url">Repository URL</Label>
                <Input
                  id="github-url"
                  placeholder="https://github.com/org/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="bg-input-background"
                />
                <p className="text-sm text-muted-foreground">
                  Public repo URL, e.g., https://github.com/org/repo
                </p>
              </div>
            </div>
          )}

          {/* Step 3: AWS (conditional) */}
          {((currentStep === 2 && selectedSources.includes('aws') && !selectedSources.includes('github')) || 
            (currentStep === 3 && selectedSources.includes('aws'))) && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="access-key-id">Access Key ID</Label>
                  <Input
                    id="access-key-id"
                    type="password"
                    value={awsCredentials.accessKeyId}
                    onChange={(e) => setAwsCredentials(prev => ({
                      ...prev,
                      accessKeyId: e.target.value
                    }))}
                    className="bg-input-background"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secret-access-key">Secret Access Key</Label>
                  <Input
                    id="secret-access-key"
                    type="password"
                    value={awsCredentials.secretAccessKey}
                    onChange={(e) => setAwsCredentials(prev => ({
                      ...prev,
                      secretAccessKey: e.target.value
                    }))}
                    className="bg-input-background"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-token">Session Token</Label>
                  <Input
                    id="session-token"
                    type="password"
                    value={awsCredentials.sessionToken}
                    onChange={(e) => setAwsCredentials(prev => ({
                      ...prev,
                      sessionToken: e.target.value
                    }))}
                    className="bg-input-background"
                  />
                  <p className="text-sm text-muted-foreground">
                    Temporary credentials
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Role must grant comprehensive read access.
                </p>
                <Button variant="link" className="p-0 h-auto text-sm">
                  Need help setting this role up?
                </Button>
              </div>
            </div>
          )}

          {/* Final Step: Review */}
          {currentStep === totalSteps && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium">{projectName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Team</span>
                  <span className="font-medium">{selectedTeam}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sources</span>
                  <div className="flex items-center gap-2">
                    {selectedSources.map((source) => (
                      <div key={source} className="flex items-center gap-1">
                        {source === 'github' ? <Github className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                        <span className="capitalize">{source}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedSources.includes('github') && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">GitHub URL</span>
                    <span className="font-medium truncate max-w-64">{githubUrl}</span>
                  </div>
                )}
                {selectedSources.includes('aws') && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AWS Credentials</span>
                    <span className="font-medium">••••••••</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !isStep1Valid) ||
                (currentStep === 2 && selectedSources.includes('github') && !isStep2Valid) ||
                ((currentStep === 2 && selectedSources.includes('aws') && !selectedSources.includes('github')) && !isStep3Valid) ||
                (currentStep === 3 && !isStep3Valid)
              }
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Create project
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}