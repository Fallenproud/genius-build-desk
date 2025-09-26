import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, Settings, Share, Save, MoreHorizontal } from 'lucide-react';
import { usePlaygroundStore } from '@/stores/playground';
import { DeviceType } from '@/types/playground';

interface PlaygroundHeaderProps {
  projectId: string;
}

export function PlaygroundHeader({ projectId }: PlaygroundHeaderProps) {
  const { 
    project, 
    ui: { mode }, 
    preview: { device },
    setMode, 
    setDevice 
  } = usePlaygroundStore();

  const deviceIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  } as const;

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-12 border-b border-border glass-strong">
      {/* Left: Project Info */}
      <div className="flex items-center min-w-0 gap-3">
        <div className="w-7 h-7 rounded-full bg-gradient-primary grid place-items-center font-bold text-white shadow-glow">
          L
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">/</span>
          <span className="truncate text-foreground font-medium">{project.name}</span>
          <span className="text-muted-foreground">/</span>
        </div>
      </div>

      {/* Center: Mode Toggle */}
      <div className="hidden sm:flex items-center justify-center">
        <div className="inline-flex rounded-xl glass p-1 shadow-inner">
          <button
            onClick={() => setMode('workspace')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'workspace' 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'preview' 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Device Selectors */}
        <div className="hidden md:flex items-center gap-1">
          {Object.entries(deviceIcons).map(([deviceType, Icon]) => (
            <button
              key={deviceType}
              onClick={() => setDevice(deviceType as DeviceType)}
              className={`p-2 rounded-lg border transition-all duration-200 hover:bg-muted ${
                device === deviceType 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border bg-muted/50 text-muted-foreground'
              }`}
              aria-label={`Preview on ${deviceType}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground glow-hover">
            Export
          </Button>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground glow-hover">
            Publish
          </Button>

          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}