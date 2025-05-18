
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Conversation, Message, ModelSettings } from '../types/chat';
import { generateUniqueId } from '../utils/helpers';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isModelLoaded: boolean;
  isGenerating: boolean;
  modelSettings: ModelSettings;
  darkMode: boolean;
  
  // Actions
  createNewConversation: () => void;
  setCurrentConversation: (id: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  deleteConversation: (id: string) => void;
  clearConversations: () => void;
  updateModelSettings: (settings: Partial<ModelSettings>) => void;
  setModelLoaded: (loaded: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
}

const DEFAULT_SETTINGS: ModelSettings = {
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 1000,
  useHistory: true
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isModelLoaded: false,
      isGenerating: false,
      modelSettings: DEFAULT_SETTINGS,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      
      createNewConversation: () => {
        const newConversation: Conversation = {
          id: generateUniqueId(),
          title: 'New Conversation',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        set(state => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newConversation.id
        }));
        
        return newConversation.id;
      },
      
      setCurrentConversation: (id: string) => {
        set({ currentConversationId: id });
      },
      
      addMessage: (messageData) => {
        const { currentConversationId, conversations } = get();
        
        if (!currentConversationId) {
          const newId = get().createNewConversation();
          set({ currentConversationId: newId });
          get().addMessage(messageData);
          return;
        }
        
        const message: Message = {
          id: generateUniqueId(),
          ...messageData,
          timestamp: Date.now()
        };
        
        set(state => {
          const updatedConversations = state.conversations.map(conv => {
            if (conv.id === currentConversationId) {
              // Update conversation title if it's the first user message
              const isFirstUserMessage = conv.messages.length === 0 && message.role === 'user';
              const title = isFirstUserMessage 
                ? message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')
                : conv.title;
              
              return {
                ...conv,
                title,
                messages: [...conv.messages, message],
                updatedAt: Date.now()
              };
            }
            return conv;
          });
          
          return { conversations: updatedConversations };
        });
      },
      
      deleteConversation: (id: string) => {
        set(state => {
          const newConversations = state.conversations.filter(c => c.id !== id);
          
          // If we're deleting the current conversation, set current to the most recent one
          let newCurrentId = state.currentConversationId;
          if (state.currentConversationId === id) {
            newCurrentId = newConversations.length > 0 ? newConversations[0].id : null;
          }
          
          return {
            conversations: newConversations,
            currentConversationId: newCurrentId
          };
        });
      },
      
      clearConversations: () => {
        set({ conversations: [], currentConversationId: null });
      },
      
      updateModelSettings: (settings: Partial<ModelSettings>) => {
        set(state => ({
          modelSettings: { ...state.modelSettings, ...settings }
        }));
      },
      
      setModelLoaded: (loaded: boolean) => {
        set({ isModelLoaded: loaded });
      },
      
      setIsGenerating: (generating: boolean) => {
        set({ isGenerating: generating });
      },
      
      setDarkMode: (darkMode: boolean) => {
        set({ darkMode });
        if (darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }),
    {
      name: 'mindmeld-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        modelSettings: state.modelSettings,
        darkMode: state.darkMode
      })
    }
  )
);
