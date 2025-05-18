
import React from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "../store/chatStore";
import { truncateText } from "../utils/helpers";
import { formatTimestamp } from "../utils/helpers";

const ConversationList: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    createNewConversation,
    setCurrentConversation,
    deleteConversation
  } = useChatStore();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button 
          className="w-full flex items-center gap-2 bg-mindmeld-primary hover:bg-mindmeld-primary/90"
          onClick={() => createNewConversation()}
        >
          <Plus size={18} />
          <span>New Conversation</span>
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No conversations yet. Start a new one!
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex justify-between items-center mb-1 p-2 rounded-md cursor-pointer transition-colors group ${
                  conversation.id === currentConversationId
                    ? "bg-secondary"
                    : "hover:bg-secondary/50"
                }`}
                onClick={() => setCurrentConversation(conversation.id)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare size={18} />
                  <div className="overflow-hidden">
                    <div className="font-medium truncate">
                      {truncateText(conversation.title, 25)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(conversation.updatedAt)}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conversation.id);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
