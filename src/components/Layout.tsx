
import React, { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import ConversationList from "./ConversationList";
import SettingsDialog from "./SettingsDialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode, setDarkMode } = useChatStore();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <div
          className={`border-r transition-all duration-300 ${
            sidebarOpen ? "w-72" : "w-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-mindmeld-primary" />
                <h1 className="font-bold text-xl">MindMeld</h1>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ConversationList />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="border-b px-4 py-3 flex items-center justify-between bg-card">
          <div className="flex items-center">
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-6 w-6 text-mindmeld-primary" />
                        <h1 className="font-bold text-xl">MindMeld</h1>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <ConversationList />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="mr-2"
              >
                {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </Button>
            )}
            <h1 className="font-bold text-xl">MindMeld</h1>
          </div>
          <SettingsDialog />
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
