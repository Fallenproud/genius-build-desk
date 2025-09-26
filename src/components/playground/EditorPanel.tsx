import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { 
  File, 
  Folder, 
  FolderOpen, 
  X, 
  Plus,
  Search,
  MoreHorizontal,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { usePlaygroundStore } from '@/stores/playground';
import { FileNode } from '@/types/playground';

export function EditorPanel() {
  const editorRef = useRef<any>(null);
  const {
    project: { files },
    editor: { activeFile, openTabs },
    setActiveFile,
    updateFileContent,
    addTab,
    closeTab
  } = usePlaygroundStore();

  const currentFile = activeFile ? files[activeFile] : null;

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateFileContent(activeFile, value);
    }
  };

  const handleFileSelect = (filePath: string) => {
    setActiveFile(filePath);
    addTab(filePath);
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'tsx': 'typescript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'js': 'javascript',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'html': 'html',
      'md': 'markdown'
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  return (
    <div className="flex h-full">
      {/* File Explorer */}
      <div className="w-64 border-r border-border glass flex flex-col">
        {/* Explorer Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground">Explorer</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Search className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto p-2 editor-scrollbar">
          <FileTree 
            files={files} 
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
          />
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="flex items-center border-b border-border glass overflow-x-auto">
          {openTabs.map((filePath) => (
            <div
              key={filePath}
              className={`flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer min-w-0 transition-colors ${
                activeFile === filePath 
                  ? 'bg-muted/50 text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
              onClick={() => setActiveFile(filePath)}
            >
              <File className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs truncate">{filePath.split('/').pop()}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(filePath);
                }}
                className="flex-shrink-0 hover:bg-muted rounded p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {openTabs.length === 0 && (
            <div className="flex items-center justify-center h-full w-full text-muted-foreground text-sm">
              Select a file to start editing
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 bg-editor-bg">
          {currentFile ? (
            <Editor
              height="100%"
              language={getLanguage(currentFile.name)}
              value={currentFile.content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
                minimap: { enabled: true },
                automaticLayout: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderWhitespace: 'boundary',
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: true,
                formatOnPaste: true,
                formatOnType: true,
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                }
              }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-4">
                <File className="w-12 h-12 mx-auto opacity-50" />
                <div>
                  <h3 className="font-medium mb-2">No file selected</h3>
                  <p className="text-sm">Choose a file from the explorer to start coding</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface FileTreeProps {
  files: Record<string, FileNode>;
  activeFile: string | null;
  onFileSelect: (filePath: string) => void;
}

function FileTree({ files, activeFile, onFileSelect }: FileTreeProps) {
  // Group files by directory structure
  const fileEntries = Object.entries(files);
  
  // For now, display files in a flat structure
  // TODO: Implement proper tree structure for nested directories
  
  return (
    <div className="space-y-1">
      {fileEntries.map(([filePath, file]) => (
        <FileItem
          key={filePath}
          filePath={filePath}
          file={file}
          isActive={activeFile === filePath}
          onClick={() => onFileSelect(filePath)}
        />
      ))}
    </div>
  );
}

interface FileItemProps {
  filePath: string;
  file: FileNode;
  isActive: boolean;
  onClick: () => void;
}

function FileItem({ filePath, file, isActive, onClick }: FileItemProps) {
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    // You could extend this with more specific icons
    return <File className="w-4 h-4" />;
  };

  return (
    <div
      className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-sm transition-colors ${
        isActive 
          ? 'bg-primary/20 text-primary border border-primary/30' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      {getFileIcon(file.name)}
      <span className="truncate">{file.name}</span>
    </div>
  );
}