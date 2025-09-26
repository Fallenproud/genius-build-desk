export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
  metadata: {
    size: number;
    modified: Date;
    language: string;
  };
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    codeBlocks?: CodeBlock[];
    files?: string[];
    actions?: Action[];
  };
}

export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

export interface Action {
  type: 'create_file' | 'update_file' | 'delete_file' | 'run_command';
  payload: any;
}

export interface PlaygroundState {
  project: {
    id: string;
    name: string;
    files: Record<string, FileNode>;
    settings: ProjectSettings;
  };
  editor: {
    activeFile: string | null;
    openTabs: string[];
    cursorPosition?: Position;
    selection?: Selection;
  };
  chat: {
    messages: ChatMessage[];
    isTyping: boolean;
    context: ChatContext;
  };
  preview: {
    url: string | null;
    device: DeviceType;
    isLoading: boolean;
    errors: PreviewError[];
  };
  ui: {
    mode: 'workspace' | 'preview';
    panelSizes: [number, number, number]; // Chat, Editor, Preview percentages
    sidebarCollapsed: boolean;
  };
}

export interface ProjectSettings {
  framework: 'react' | 'vue' | 'vanilla';
  buildTool: 'vite' | 'webpack' | 'parcel';
  dependencies: Record<string, string>;
  environment: 'development' | 'production';
}

export interface Position {
  line: number;
  column: number;
}

export interface Selection {
  start: Position;
  end: Position;
}

export interface ChatContext {
  projectFiles: string[];
  currentFile?: string;
  selectedCode?: string;
  errorContext?: string;
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface PreviewError {
  message: string;
  line?: number;
  file?: string;
  type: 'error' | 'warning';
}

export interface PanelLayout {
  chatWidth: number;
  editorWidth: number;
  previewWidth: number;
}