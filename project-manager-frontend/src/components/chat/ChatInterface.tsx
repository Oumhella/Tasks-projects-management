import React, { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { keycloak } from '../../config/Keycloak';
import apiService from '../../services/api';
import './ChatInterface.css';

interface ChatMessage {
  id?: string;
  content: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  createdAt?: string;
  sessionId?: string;
}

interface ChatSession {
  id: string;
  sessionName: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

const ChatInterface: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (currentSession) {
      setMessages(currentSession.messages || []);
    } else {
      setMessages([]);
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    try {
      const loadedSessions = await apiService.getChatSessions();
      setSessions(loadedSessions);
      if (loadedSessions.length > 0 && !currentSession) {
        setCurrentSession(loadedSessions[0]);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const newSession = await apiService.createChatSession({ sessionName: 'New Chat' });
      setSessions([newSession, ...sessions]);
      setCurrentSession(newSession);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const selectSession = async (sessionId: string) => {
    try {
      const session = await apiService.getChatSession(sessionId);
      setCurrentSession(session);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const connectWebSocket = () => {
    const token = keycloak.token;
    if (!token) {
      console.error('No token available');
      return;
    }

    const socket = new SockJS('http://localhost:8081/ws?access_token=' + token);
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Subscribe to user's private message queue
        // Principal.getName() returns the Keycloak ID (subject)
        const keycloakId = keycloak.tokenParsed?.sub;
        if (keycloakId) {
          // Standard Spring User Destination subscription
          client.subscribe('/user/queue/chat/messages', (message: IMessage) => {
            const response: ChatMessage = JSON.parse(message.body);
            handleIncomingMessage(response);
          });
        }
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
    });

    client.activate();
    setStompClient(client);
  };

  const disconnectWebSocket = () => {
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
      setIsConnected(false);
    }
  };

  const handleIncomingMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
    setIsLoading(false);
    
    // Update current session
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        messages: [...(currentSession.messages || []), message],
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      content: inputMessage,
      role: 'USER',
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (!currentSession) {
        // Create new session if none exists
        const newSession = await apiService.createChatSession({ sessionName: 'New Chat' });
        setCurrentSession(newSession);
        setSessions([newSession, ...sessions]);
      }

      // Send via WebSocket if connected, otherwise fallback to REST
      if (stompClient && isConnected) {
        stompClient.publish({
          destination: '/app/chat/message',
          body: JSON.stringify({
            message: userMessage.content,
            sessionId: currentSession?.id,
          }),
        });
      } else {
        // Fallback to REST API
        const response = await apiService.sendChatMessage({
          message: userMessage.content,
          sessionId: currentSession?.id,
        });
        handleIncomingMessage(response);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
      const errorMessage: ChatMessage = {
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'ASSISTANT',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await apiService.deleteChatSession(sessionId);
      setSessions(sessions.filter((s) => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Chat Sessions</h2>
          <button onClick={createNewSession} className="btn-new-chat">
            + New Chat
          </button>
        </div>
        <div className="chat-sessions-list">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`chat-session-item ${currentSession?.id === session.id ? 'active' : ''}`}
              onClick={() => selectSession(session.id)}
            >
              <div className="session-name">{session.sessionName}</div>
              <div className="session-date">
                {new Date(session.updatedAt).toLocaleDateString()}
              </div>
              <button
                className="btn-delete-session"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {currentSession ? (
          <>
            <div className="chat-header">
              <h3>{currentSession.sessionName}</h3>
              <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? '● Connected' : '○ Disconnected'}
              </div>
            </div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.role === 'USER' ? 'user-message' : 'assistant-message'}`}
                >
                  <div className="message-content">{message.content}</div>
                  {message.createdAt && (
                    <div className="message-time">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="chat-message assistant-message">
                  <div className="message-content">
                    <span className="typing-indicator">●</span>
                    <span className="typing-indicator">●</span>
                    <span className="typing-indicator">●</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
              <textarea
                className="chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={3}
                disabled={isLoading}
              />
              <button
                className="btn-send"
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="chat-empty-state">
            <h3>Welcome to AI Assistant</h3>
            <p>Start a new conversation to get help with your projects and tasks.</p>
            <button onClick={createNewSession} className="btn-new-chat-large">
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;

