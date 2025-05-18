
import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import LoadingMessage from "../components/LoadingMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

const Chat: React.FC = () => {
  const { conversations, currentConversationId, isGenerating } = useChatStore();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollViewportRef.current) {
      const scrollElement = scrollViewportRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [currentConversation?.messages, isGenerating]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea viewportRef={scrollViewportRef} className="flex-1 px-4">
        <div className="py-6 max-w-3xl mx-auto">
          {/* Welcome message for empty conversation */}
          {(!currentConversation || currentConversation.messages.length === 0) && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-2">Welcome to MindMeld!</h2>
              <p className="text-muted-foreground mb-6">
                Your AI assistant that runs completely in your browser
              </p>
              <div className="max-w-md mx-auto text-left p-4 border rounded-lg bg-secondary/50">
                <h3 className="font-medium mb-2">Try asking:</h3>
                <ul className="space-y-2 text-sm">
                  <li>"How does MindMeld work?"</li>
                  <li>"What can you help me with?"</li>
                  <li>"Tell me about browser-based AI models"</li>
                  <li>"What are your limitations?"</li>
                </ul>
              </div>
            </div>
          )}

          {/* Chat messages */}
          {currentConversation?.messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {/* Loading message */}
          {isGenerating && <LoadingMessage />}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="max-w-3xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default Chat;
