import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { PlaygroundState, ChatMessage, FileNode, DeviceType } from '@/types/playground';

// Mock data for initial development
const mockFiles: Record<string, FileNode> = {
  'src/App.tsx': {
    name: 'App.tsx',
    type: 'file',
    content: `import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Lumi IDE</h1>
        <p>Start building something amazing!</p>
      </header>
    </div>
  );
}

export default App;`,
    children: undefined,
    metadata: {
      size: 234,
      modified: new Date(),
      language: 'typescript'
    }
  },
  'src/index.tsx': {
    name: 'index.tsx',
    type: 'file',
    content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    children: undefined,
    metadata: {
      size: 298,
      modified: new Date(),
      language: 'typescript'
    }
  },
  'src/index.css': {
    name: 'index.css',
    type: 'file',
    content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}`,
    children: undefined,
    metadata: {
      size: 486,
      modified: new Date(),
      language: 'css'
    }
  }
};

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'system',
    content: 'Welcome to Lumi IDE! I\'m here to help you build amazing applications. What would you like to create today?',
    timestamp: new Date(),
  }
];

interface PlaygroundStore extends PlaygroundState {
  // Actions
  sendMessage: (content: string) => void;
  setActiveFile: (filePath: string) => void;
  updateFileContent: (filePath: string, content: string) => void;
  createFile: (filePath: string, content?: string) => void;
  deleteFile: (filePath: string) => void;
  setDevice: (device: DeviceType) => void;
  setMode: (mode: 'workspace' | 'preview') => void;
  setPanelSizes: (sizes: [number, number, number]) => void;
  addTab: (filePath: string) => void;
  closeTab: (filePath: string) => void;
  setTyping: (isTyping: boolean) => void;
}

export const usePlaygroundStore = create<PlaygroundStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    project: {
      id: 'demo-project',
      name: 'My Lumi Project',
      files: mockFiles,
      settings: {
        framework: 'react',
        buildTool: 'vite',
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0'
        },
        environment: 'development'
      }
    },
    editor: {
      activeFile: 'src/App.tsx',
      openTabs: ['src/App.tsx'],
      cursorPosition: undefined,
      selection: undefined
    },
    chat: {
      messages: mockMessages,
      isTyping: false,
      context: {
        projectFiles: Object.keys(mockFiles),
        currentFile: 'src/App.tsx'
      }
    },
    preview: {
      url: null,
      device: 'desktop',
      isLoading: false,
      errors: []
    },
    ui: {
      mode: 'workspace',
      panelSizes: [30, 40, 30],
      sidebarCollapsed: false
    },

    // Actions
    sendMessage: (content: string) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content,
        timestamp: new Date()
      };

      set((state) => ({
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, newMessage],
          isTyping: true
        }
      }));

      // Simulate AI response
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'I understand what you want to build. Let me help you with that. I\'ll start by creating the necessary files and components.',
          timestamp: new Date(),
          metadata: {
            actions: [{
              type: 'create_file',
              payload: { filename: 'src/NewComponent.tsx', content: '// Generated component' }
            }]
          }
        };

        set((state) => ({
          chat: {
            ...state.chat,
            messages: [...state.chat.messages, response],
            isTyping: false
          }
        }));
      }, 2000);
    },

    setActiveFile: (filePath: string) => {
      set((state) => ({
        editor: {
          ...state.editor,
          activeFile: filePath
        },
        chat: {
          ...state.chat,
          context: {
            ...state.chat.context,
            currentFile: filePath
          }
        }
      }));
    },

    updateFileContent: (filePath: string, content: string) => {
      set((state) => ({
        project: {
          ...state.project,
          files: {
            ...state.project.files,
            [filePath]: {
              ...state.project.files[filePath],
              content,
              metadata: {
                ...state.project.files[filePath].metadata,
                modified: new Date(),
                size: content.length
              }
            }
          }
        }
      }));
    },

    createFile: (filePath: string, content = '') => {
      const language = filePath.split('.').pop() || 'text';
      const newFile: FileNode = {
        name: filePath.split('/').pop() || filePath,
        type: 'file',
        content,
        metadata: {
          size: content.length,
          modified: new Date(),
          language
        }
      };

      set((state) => ({
        project: {
          ...state.project,
          files: {
            ...state.project.files,
            [filePath]: newFile
          }
        }
      }));
    },

    deleteFile: (filePath: string) => {
      set((state) => {
        const newFiles = { ...state.project.files };
        delete newFiles[filePath];
        
        return {
          project: {
            ...state.project,
            files: newFiles
          },
          editor: {
            ...state.editor,
            openTabs: state.editor.openTabs.filter(tab => tab !== filePath),
            activeFile: state.editor.activeFile === filePath 
              ? state.editor.openTabs.find(tab => tab !== filePath) || null
              : state.editor.activeFile
          }
        };
      });
    },

    setDevice: (device: DeviceType) => {
      set((state) => ({
        preview: {
          ...state.preview,
          device
        }
      }));
    },

    setMode: (mode: 'workspace' | 'preview') => {
      set((state) => ({
        ui: {
          ...state.ui,
          mode
        }
      }));
    },

    setPanelSizes: (sizes: [number, number, number]) => {
      set((state) => ({
        ui: {
          ...state.ui,
          panelSizes: sizes
        }
      }));
    },

    addTab: (filePath: string) => {
      set((state) => ({
        editor: {
          ...state.editor,
          openTabs: state.editor.openTabs.includes(filePath) 
            ? state.editor.openTabs 
            : [...state.editor.openTabs, filePath]
        }
      }));
    },

    closeTab: (filePath: string) => {
      set((state) => ({
        editor: {
          ...state.editor,
          openTabs: state.editor.openTabs.filter(tab => tab !== filePath),
          activeFile: state.editor.activeFile === filePath 
            ? state.editor.openTabs.find(tab => tab !== filePath) || null
            : state.editor.activeFile
        }
      }));
    },

    setTyping: (isTyping: boolean) => {
      set((state) => ({
        chat: {
          ...state.chat,
          isTyping
        }
      }));
    }
  }))
);