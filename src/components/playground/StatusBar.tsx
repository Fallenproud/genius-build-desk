import React from 'react';
import { usePlaygroundStore } from '@/stores/playground';
import { 
  File, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Cloud,
  Wifi,
  Activity
} from 'lucide-react';

export function StatusBar() {
  const {
    project: { files },
    editor: { openTabs },
    preview: { errors }
  } = usePlaygroundStore();

  const fileCount = Object.keys(files).length;
  const errorCount = errors.filter(e => e.type === 'error').length;
  const warningCount = errors.filter(e => e.type === 'warning').length;

  return (
    <div className="h-6 bg-muted/30 border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
      {/* Left Side - File Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <File className="w-3 h-3" />
          <span>{fileCount} files</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span>{openTabs.length} open</span>
        </div>

        {errorCount > 0 && (
          <div className="flex items-center gap-1 text-destructive">
            <AlertTriangle className="w-3 h-3" />
            <span>{errorCount} errors</span>
          </div>
        )}

        {warningCount > 0 && (
          <div className="flex items-center gap-1 text-warning">
            <AlertTriangle className="w-3 h-3" />
            <span>{warningCount} warnings</span>
          </div>
        )}

        {errorCount === 0 && warningCount === 0 && (
          <div className="flex items-center gap-1 text-success">
            <CheckCircle className="w-3 h-3" />
            <span>No problems</span>
          </div>
        )}
      </div>

      {/* Right Side - Status Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3" />
          <span>Auto-save</span>
        </div>

        <div className="flex items-center gap-1">
          <Cloud className="w-3 h-3" />
          <span>Synced</span>
        </div>

        <div className="flex items-center gap-1">
          <Wifi className="w-3 h-3" />
          <span>Connected</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}