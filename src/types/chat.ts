
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ModelSettings {
  temperature: number; // 0 to 1
  topP: number; // 0 to 1
  maxTokens: number; // max response length
  useHistory: boolean; // whether to use conversation history
}
