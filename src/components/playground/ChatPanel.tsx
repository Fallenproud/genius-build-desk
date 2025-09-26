import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, User, Bot, Zap } from 'lucide-react';
import { usePlaygroundStore } from '@/stores/playground';
import { ChatMessage } from '@/types/playground';

export function ChatPanel() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    chat: { messages, isTyping },
    sendMessage 
  } = usePlaygroundStore();

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <aside className="flex flex-col h-full glass border-r border-border">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-primary grid place-items-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Ready to help you build</p>
          </div>
        </div>
        <div className="text-xs px-2 py-1 rounded-full glass border border-border">
          <Zap className="w-3 h-3 inline mr-1 text-primary" />
          5 credits
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 editor-scrollbar">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3 animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-gradient-primary grid place-items-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="glass-strong rounded-lg p-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        {/* Credits Notice */}
        <div className="mb-3 text-xs text-muted-foreground glass border border-border rounded-lg px-3 py-2 flex items-center justify-between">
          <span>5 daily free credits left</span>
          <button className="text-primary hover:text-primary-glow hover:underline transition-colors">
            Upgrade for more ›
          </button>
        </div>

        {/* Input Area */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Lumi to create, modify, or explain..."
              className="glass border-border bg-muted/30 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none min-h-[2.5rem]"
              disabled={isTyping}
            />
          </div>
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow transition-all duration-200 h-10 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  return (
    <div className={`flex items-start gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full grid place-items-center flex-shrink-0 ${
        isUser 
          ? 'bg-secondary' 
          : isSystem 
            ? 'bg-muted' 
            : 'bg-gradient-primary'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : isSystem ? (
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`glass-strong rounded-lg p-3 ${
          isUser 
            ? 'bg-secondary/10 border-secondary/20' 
            : isSystem 
              ? 'bg-muted/10 border-muted/20'
              : 'bg-card/50 border-border'
        }`}>
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
          
          {/* Message Actions */}
          {message.metadata?.actions && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="space-y-2">
                {message.metadata.actions.map((action, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded glass border border-border">
                      <Zap className="w-3 h-3" />
                      {action.type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`mt-1 text-xs text-muted-foreground ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}