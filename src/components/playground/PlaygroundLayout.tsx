import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { PlaygroundHeader } from './PlaygroundHeader';
import { ChatPanel } from './ChatPanel';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { StatusBar } from './StatusBar';
import { usePlaygroundStore } from '@/stores/playground';

interface PlaygroundLayoutProps {
  projectId: string;
}

export function PlaygroundLayout({ projectId }: PlaygroundLayoutProps) {
  const { ui: { mode } } = usePlaygroundStore();

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col playground-layout">
      {/* Header */}
      <PlaygroundHeader projectId={projectId} />

      {/* Main Layout */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Chat Panel */}
          <Panel 
            defaultSize={30} 
            minSize={20} 
            maxSize={50}
            className="relative"
          >
            <ChatPanel />
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors duration-200 relative group">
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-border group-hover:bg-primary/50 transition-colors duration-200 transform -translate-x-1/2" />
          </PanelResizeHandle>

          {/* Editor/Preview Area */}
          <Panel defaultSize={70} minSize={50}>
            {mode === 'workspace' ? (
              <PanelGroup direction="horizontal">
                {/* Editor Panel */}
                <Panel 
                  defaultSize={60} 
                  minSize={30}
                  className="relative"
                >
                  <EditorPanel />
                </Panel>

                <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors duration-200 relative group">
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-border group-hover:bg-primary/50 transition-colors duration-200 transform -translate-x-1/2" />
                </PanelResizeHandle>

                {/* Preview Panel */}
                <Panel 
                  defaultSize={40} 
                  minSize={30}
                  className="relative"
                >
                  <PreviewPanel />
                </Panel>
              </PanelGroup>
            ) : (
              /* Full Preview Mode */
              <PreviewPanel />
            )}
          </Panel>
        </PanelGroup>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}