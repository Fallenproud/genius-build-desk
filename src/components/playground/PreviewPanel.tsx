import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RefreshCw, 
  ExternalLink, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { usePlaygroundStore } from '@/stores/playground';
import { DeviceType } from '@/types/playground';

export function PreviewPanel() {
  const {
    project: { files, settings },
    preview: { device, isLoading, errors },
    setDevice
  } = usePlaygroundStore();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Simulate build process when files change
    setBuildStatus('building');
    
    const buildTimer = setTimeout(() => {
      // Simulate successful build
      const mockUrl = `data:text/html;charset=utf-8,${encodeURIComponent(generatePreviewHTML())}`;
      setPreviewUrl(mockUrl);
      setBuildStatus('success');
    }, 1500);

    return () => clearTimeout(buildTimer);
  }, [files]);

  const generatePreviewHTML = () => {
    // Generate a simple HTML preview based on the React components
    const appContent = files['src/App.tsx']?.content || '';
    const cssContent = files['src/index.css']?.content || '';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        ${cssContent}
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    </style>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        ${appContent.replace('export default App;', `
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
        `)}
    </script>
</body>
</html>`;
  };

  const deviceSizes = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px] max-w-full max-h-full mx-auto',
    mobile: 'w-[375px] h-[667px] max-w-full max-h-full mx-auto'
  };

  const handleRefresh = () => {
    setBuildStatus('building');
    setTimeout(() => {
      const mockUrl = `data:text/html;charset=utf-8,${encodeURIComponent(generatePreviewHTML())}`;
      setPreviewUrl(mockUrl);
      setBuildStatus('success');
    }, 1000);
  };

  const handleOpenExternal = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full glass border-l border-border">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-sm text-foreground">Preview</h3>
          <BuildStatusIndicator status={buildStatus} />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <div className="flex items-center gap-1 p-1 glass rounded-lg border border-border">
            {[
              { type: 'desktop' as DeviceType, icon: Monitor },
              { type: 'tablet' as DeviceType, icon: Tablet },
              { type: 'mobile' as DeviceType, icon: Smartphone }
            ].map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setDevice(type)}
                className={`p-1.5 rounded transition-all duration-200 ${
                  device === type 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                aria-label={`Preview on ${type}`}
              >
                <Icon className="w-3 h-3" />
              </button>
            ))}
          </div>

          {/* Actions */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRefresh}
            disabled={buildStatus === 'building'}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-3 h-3 ${buildStatus === 'building' ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleOpenExternal}
            disabled={!previewUrl}
            className="h-8 w-8 p-0"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 relative bg-muted/20">
        {buildStatus === 'building' ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <div>
                <h3 className="font-medium text-foreground">Building your app...</h3>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </div>
            </div>
          </div>
        ) : buildStatus === 'error' ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <XCircle className="w-8 h-8 text-destructive mx-auto" />
              <div>
                <h3 className="font-medium text-foreground">Build failed</h3>
                <p className="text-sm text-muted-foreground">Check the console for errors</p>
              </div>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                Try again
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 h-full flex items-center justify-center">
            <div className={`${deviceSizes[device]} border border-border rounded-lg overflow-hidden bg-background shadow-depth transition-all duration-300`}>
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                  title="App Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center space-y-2">
                    <Monitor className="w-8 h-8 mx-auto opacity-50" />
                    <p className="text-sm">Preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Console/Errors */}
      {errors.length > 0 && (
        <div className="border-t border-border p-3 max-h-32 overflow-y-auto">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Console Output</h4>
          <div className="space-y-1">
            {errors.map((error, index) => (
              <div key={index} className="text-xs flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-warning flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{error.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface BuildStatusIndicatorProps {
  status: 'idle' | 'building' | 'success' | 'error';
}

function BuildStatusIndicator({ status }: BuildStatusIndicatorProps) {
  const statusConfig = {
    idle: { icon: Monitor, text: 'Ready', className: 'text-muted-foreground' },
    building: { icon: Loader2, text: 'Building...', className: 'text-warning animate-spin' },
    success: { icon: CheckCircle, text: 'Ready', className: 'text-success' },
    error: { icon: XCircle, text: 'Error', className: 'text-destructive' }
  };

  const { icon: Icon, text, className } = statusConfig[status];

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Icon className={`w-3 h-3 ${className}`} />
      <span className={className}>{text}</span>
    </div>
  );
}